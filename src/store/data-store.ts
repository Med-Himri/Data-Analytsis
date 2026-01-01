import { create } from 'zustand';
import { supabase } from '@/config/supabase'; // Adjust path if needed
import axios from 'axios';

export interface DataSummary {
  rows: number;
  columns: number;
  columnNames: string[];
  columnTypes: Record<string, string>;
  numericStats: Record<string, {
    mean: number;
    min: number;
    max: number;
    std: number;
  }>;
  missingValues: Record<string, number>;
  sampleData: Record<string, unknown>[];
  fullData?: Record<string, unknown>[]; 
}

interface DataStore {
  file: File | null;
  summary: DataSummary | null;
  loading: boolean;
  error: string | null;

  setFile: (file: File | null) => void;
  setSummary: (summary: DataSummary | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  uploadAndAnalyzeCSV: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
  file: null,
  summary: null,
  loading: false,
  error: null,

  setFile: (file) => set({ file, summary: null, error: null }),
  setSummary: (summary) => set({ summary }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  reset: () => set({ file: null, summary: null, loading: false, error: null }),

  uploadAndAnalyzeCSV: async () => {
    const file = get().file;
    if (!file) {
      set({ error: 'No file selected' });
      return;
    }

    set({ loading: true, error: null });

    try {
      // Upload CSV to Supabase storage bucket 'csv-uploads'
      const fileName = `uploads/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('csv-uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, data:', data);

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('csv-uploads')
        .getPublicUrl(fileName);

      const fileUrl = urlData.publicUrl;
      console.log('Generated fileUrl:', fileUrl);

      // Send to backend
      console.log('Sending to backend:', { fileUrl });
      const response = await axios.post('http://172.20.74.76:8000/analyze', { 
        fileUrl, 
        includeFullData: true, 
      });
      console.log('Backend response:', response.data);

      set({ summary: response.data });
    } catch (error: any) {
      console.error('Error in uploadAndAnalyzeCSV:', error);
      set({ error: error.message || 'Upload or analysis failed' });
    } finally {
      set({ loading: false });
    }
  },
}));
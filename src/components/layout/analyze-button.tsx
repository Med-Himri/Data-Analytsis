import { Play, Loader2 } from 'lucide-react';
import { useDataStore } from '@/store/data-store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AnalyzeButton = () => {
  const { file, loading, uploadAndAnalyzeCSV, error, setError } = useDataStore();

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a CSV file to analyze.');
      return;
    }

    await uploadAndAnalyzeCSV();

    if (!error) {
      toast.success('Analysis Complete', {
        description: 'Your CSV has been analyzed successfully.',
      });
    } else {
      toast.error('Analysis Failed', { description: error || undefined });
    }
  };

  return (
    <Button
      onClick={handleAnalyze}
      disabled={!file || loading}
      size="lg"
      className="w-full sm:w-auto min-w-45 bg-primary text-primary-foreground hover:bg-primary/90 glow-effect transition-all duration-300 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Play className="w-5 h-5 mr-2" />
          Analyze Data
        </>
      )}
    </Button>
  );
};

export default AnalyzeButton;
import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { useDataStore } from '@/store/data-store';
import { Button } from '@/components/ui/button';

const UploadForm = () => {
  const { file, setFile } = useDataStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full animate-fade-in">
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            glass-card p-12 cursor-pointer transition-all duration-300
            border-2 border-dashed hover:border-primary/50
            ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border/50'}
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-1">
                Drop your CSV file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>
            <Button variant="outline" className="mt-2">
              Choose File
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileSpreadsheet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;

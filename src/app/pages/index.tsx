import Header from '@/components/layout/header';
import UploadForm from '@/components/layout/upload-form';
import AnalyzeButton from '@/components/layout/analyze-button';
import SummaryDisplay from '@/components/layout/summary-display';
import { useDataStore } from '@/store/data-store';

const Index = () => {
  const { file, summary, loading } = useDataStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Upload Section */}
          <section className="space-y-6">
            <UploadForm />
            
            {file && !summary && !loading && (
              <div className="flex justify-center animate-fade-in">
                <AnalyzeButton />
              </div>
            )}

            {loading && (
              <div className="flex justify-center">
                <AnalyzeButton />
              </div>
            )}
          </section>

          {/* Results Section */}
          {summary && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Analysis Results
                </h2>
                <AnalyzeButton />
              </div>
              <SummaryDisplay />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Data Analysis Assistant • Upload CSV files for instant insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

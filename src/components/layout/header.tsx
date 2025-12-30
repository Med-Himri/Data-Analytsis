import { BarChart3, RefreshCw } from 'lucide-react';
import { useDataStore } from '@/store/data-store';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { file, summary, reset } = useDataStore();

  return (
    <header className="w-full py-6 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 glow-effect">
            <BarChart3 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              Data Analysis Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload CSV files and get instant insights
            </p>
          </div>
        </div>
        
        {(file || summary) && (
          <Button 
            variant="outline" 
            onClick={reset}
            className="border-border/50 hover:bg-secondary/50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;

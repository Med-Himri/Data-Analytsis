import { Database, Table2, Hash, AlertCircle } from 'lucide-react';
import { useDataStore } from '@/store/data-store';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2'; // Added Pie, Doughnut, Line for area
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // For pie/donut
  PointElement,
  LineElement,
  Filler, // For area fill
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const StatCard = ({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  delay?: number;
}) => (
  <div
    className="glass-card p-5 animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <p className="text-2xl font-semibold text-foreground">{value}</p>
  </div>
);

const SummaryDisplay = () => {
  const { summary, error } = useDataStore();

  if (error) {
    return (
      <div className="glass-card p-6 border-destructive/50 animate-fade-in">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const numericColumns = summary.numericStats ? Object.keys(summary.numericStats) : [];
  const totalMissing = summary.missingValues ? Object.values(summary.missingValues).reduce((a, b) => a + b, 0) : 0;

  // Bar Chart Data (existing, for means and std devs)
  const barChartData = numericColumns.length > 0 ? {
    labels: numericColumns,
    datasets: [
      {
        label: 'Mean',
        data: numericColumns.map((col) => summary.numericStats[col]?.mean ?? 0),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
      {
        label: 'Std Dev',
        data: numericColumns.map((col) => summary.numericStats[col]?.std ?? 0),
        backgroundColor: 'rgba(220, 38, 38, 0.7)',
      },
    ],
  } : null;

  // Pie Chart Data (for column types distribution)
  const columnTypes = summary.columnTypes ? Object.values(summary.columnTypes) : [];
  const typeCounts = columnTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieChartData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        data: Object.values(typeCounts),
        backgroundColor: ['rgba(37, 99, 235, 0.7)', 'rgba(220, 38, 38, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(251, 191, 36, 0.7)'],
      },
    ],
  };

  // Donut Chart Data (for results distribution, if available)
  const results = summary.sampleData?.map(row => row.results).filter(Boolean) || [];
  const resultCounts = results.reduce((acc, result) => {
    acc[result] = (acc[result] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const donutChartData = {
    labels: Object.keys(resultCounts),
    datasets: [
      {
        data: Object.values(resultCounts),
        backgroundColor: ['rgba(37, 99, 235, 0.7)', 'rgba(220, 38, 38, 0.7)', 'rgba(34, 197, 94, 0.7)'],
        borderWidth: 0,
      },
    ],
  };

  // Area Chart Data (cumulative means for numeric columns)
  const areaChartData = numericColumns.length > 0 ? {
    labels: numericColumns,
    datasets: [
      {
        label: 'Cumulative Mean',
        data: numericColumns.map((col, idx) => 
          numericColumns.slice(0, idx + 1).reduce((sum, c) => sum + (summary.numericStats[c]?.mean ?? 0), 0)
        ),
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        tension: 0.4,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Table2} label="Total Rows" value={summary.rows?.toLocaleString() ?? 'N/A'} delay={0} />
        <StatCard icon={Database} label="Columns" value={summary.columns ?? 'N/A'} delay={50} />
        <StatCard icon={Hash} label="Numeric Cols" value={numericColumns.length} delay={100} />
        <StatCard icon={AlertCircle} label="Missing Values" value={totalMissing} delay={150} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        {barChartData && (
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Bar Chart: Mean & Std Dev</h3>
            <Bar options={chartOptions} data={barChartData} />
          </div>
        )}

        {/* Pie Chart */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Pie Chart: Column Types</h3>
          <Pie options={chartOptions} data={pieChartData} />
        </div>

        {/* Donut Chart */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Donut Chart: Results Distribution</h3>
          <Doughnut options={chartOptions} data={donutChartData} />
        </div>

        {/* Area Chart */}
        {areaChartData && (
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '350ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Area Chart: Cumulative Means</h3>
            <Line options={chartOptions} data={areaChartData} />
          </div>
        )}
      </div>

      {/* Column Types */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Column Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.columnNames?.map((col) => (
            <div
              key={col}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
            >
              <span className="font-mono text-sm text-foreground truncate mr-2">{col}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  summary.columnTypes?.[col] === 'numeric'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {summary.columnTypes?.[col] ?? 'unknown'}
              </span>
            </div>
          )) ?? <p>No column data available</p>}
        </div>
      </div>

      {/* Numeric Statistics */}
      {numericColumns.length > 0 && (
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '450ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Numeric Statistics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Column</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Mean</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Min</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Max</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Std Dev</th>
                </tr>
              </thead>
              <tbody>
                {numericColumns.map((col) => (
                  <tr key={col} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-foreground">{col}</td>
                    <td className="py-3 px-4 text-right text-foreground">{summary.numericStats[col]?.mean ?? 'N/A'}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{summary.numericStats[col]?.min ?? 'N/A'}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{summary.numericStats[col]?.max ?? 'N/A'}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{summary.numericStats[col]?.std ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sample Data Preview */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Table2 className="w-5 h-5 text-primary" />
          Sample Data (First 5 Rows)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {summary.columnNames?.map((col) => (
                  <th
                    key={col}
                    className="text-left py-3 px-4 text-muted-foreground font-medium whitespace-nowrap"
                  >
                    {col}
                  </th>
                )) ?? <th>No columns</th>}
              </tr>
            </thead>
            <tbody>
              {summary.sampleData?.map((row, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  {summary.columnNames?.map((col) => (
                    <td key={col} className="py-3 px-4 text-foreground whitespace-nowrap">
                      {String(row[col] ?? '-')}
                    </td>
                  )) ?? <td>No data</td>}
                </tr>
              )) ?? <tr><td>No sample data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
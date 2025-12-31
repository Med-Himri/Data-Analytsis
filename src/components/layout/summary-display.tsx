// import { useState } from 'react';
// import { Database, Table2, Hash, AlertCircle, Filter } from 'lucide-react';
// import { useDataStore } from '@/store/data-store';
// import { Bar, Pie, Doughnut, Line, Scatter } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
//   Filler,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
//   Filler
// );

// const StatCard = ({
//   icon: Icon,
//   label,
//   value,
//   delay = 0,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string | number;
//   delay?: number;
// }) => (
//   <div
//     className="glass-card p-5 animate-slide-up"
//     style={{ animationDelay: `${delay}ms` }}
//   >
//     <div className="flex items-center gap-3 mb-2">
//       <div className="p-2 rounded-lg bg-primary/10">
//         <Icon className="w-4 h-4 text-primary" />
//       </div>
//       <span className="text-sm text-muted-foreground">{label}</span>
//     </div>
//     <p className="text-2xl font-semibold text-foreground">{value}</p>
//   </div>
// );

// const SummaryDisplay = () => {
//   const { summary, error } = useDataStore();
//   const [selectedColumn, setSelectedColumn] = useState<string>(''); // General filter
//   const [xAxis, setXAxis] = useState<string>(''); // X-axis selection
//   const [yAxis, setYAxis] = useState<string>(''); // Y-axis selection

//   if (error) {
//     return (
//       <div className="glass-card p-6 border-destructive/50 animate-fade-in">
//         <div className="flex items-center gap-3 text-destructive">
//           <AlertCircle className="w-5 h-5" />
//           <p className="font-medium">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!summary) return null;

//   const numericColumns = summary.numericStats ? Object.keys(summary.numericStats) : [];
//   const totalMissing = summary.missingValues ? Object.values(summary.missingValues).reduce((a, b) => a + b, 0) : 0;

//   // Use fullData if available, else sampleData
//   const chartDataSource = summary?.fullData || summary?.sampleData || [];
//   const isFullData = !!summary?.fullData;

//   // Debug logs
//   console.log('numericColumns:', numericColumns);
//   console.log('yAxis selected:', yAxis);
//   console.log('chartDataSource length:', chartDataSource.length);

//   // Filtered data for charts
//   const filteredData = chartDataSource.filter(row => 
//     !selectedColumn || row[selectedColumn] !== undefined
//   );

//   // Performance warning
//   const isLargeDataset = filteredData.length > 1000;

//   // Auto-select defaults if no axes chosen
//   const defaultXAxis = xAxis || (summary.columnNames?.[0] || '');
//   const defaultYAxis = yAxis || (numericColumns[0] || '');

//   // Bar Chart Data (x-axis labels from selected column, y-axis from selected numeric)
//   const barChartData = filteredData.length > 0 ? {
//     labels: filteredData.map(row => String(row[defaultXAxis] ?? 'N/A')), // Use x-axis column values as labels
//     datasets: [
//       {
//         label: defaultYAxis || 'Value',
//         data: filteredData.map(row => row[defaultYAxis] ?? 0),
//         backgroundColor: 'rgba(37, 99, 235, 0.7)',
//       },
//     ],
//   } : null;

//   // Scatter Chart Data (uses x/y axes directly)
//   const scatterChartData = filteredData.length > 0 ? {
//     datasets: [
//       {
//         label: `${defaultXAxis} vs ${defaultYAxis}`,
//         data: filteredData.map(row => ({
//           x: row[defaultXAxis] ?? 0,
//           y: row[defaultYAxis] ?? 0,
//         })),
//         backgroundColor: 'rgba(37, 99, 235, 0.7)',
//       },
//     ],
//   } : null;

//   // Line Chart Data (x-axis labels from selected column, y-axis from selected numeric)
//   const lineChartData = filteredData.length > 0 ? {
//     labels: filteredData.map(row => String(row[defaultXAxis] ?? 'N/A')), // Use x-axis column values as labels
//     datasets: [
//       {
//         label: defaultYAxis || 'Value',
//         data: filteredData.map(row => row[defaultYAxis] ?? 0),
//         backgroundColor: 'rgba(37, 99, 235, 1)',
//         borderColor: 'rgba(37, 99, 235, 1)',
//         tension: 0.4,
//       },
//     ],
//   } : null;

//   // Area Chart Data (same as line, with fill)
//   const areaChartData = filteredData.length > 0 ? {
//     labels: filteredData.map(row => String(row[defaultXAxis] ?? 'N/A')), // Use x-axis column values as labels
//     datasets: [
//       {
//         label: defaultYAxis || 'Value',
//         data: filteredData.map(row => row[defaultYAxis] ?? 0),
//         fill: true,
//         backgroundColor: 'rgba(37, 99, 235, 0.2)',
//         borderColor: 'rgba(37, 99, 235, 1)',
//         tension: 0.4,
//       },
//     ],
//   } : null;

//   // Pie Chart Data (categorical, e.g., results)
//   const pieChartData = {
//     labels: chartDataSource.map(row => row.results).filter(Boolean).reduce((acc, result) => {
//       if (!acc.includes(result)) acc.push(result);
//       return acc;
//     }, [] as string[]) || [],
//     datasets: [
//       {
//         data: chartDataSource.map(row => row.results).filter(Boolean).reduce((acc, result) => {
//           acc[result] = (acc[result] || 0) + 1;
//           return acc;
//         }, {} as Record<string, number>) ? Object.values(chartDataSource.map(row => row.results).filter(Boolean).reduce((acc, result) => {
//           acc[result] = (acc[result] || 0) + 1;
//           return acc;
//         }, {} as Record<string, number>)) : [],
//         backgroundColor: ['rgba(37, 99, 235, 0.7)', 'rgba(220, 38, 38, 0.7)', 'rgba(34, 197, 94, 0.7)'],
//       },
//     ],
//   };

//   // Donut Chart Data (same as pie)
//   const donutChartData = { ...pieChartData, datasets: [{ ...pieChartData.datasets[0], borderWidth: 0 }] };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' as const },
//       tooltip: { enabled: true },
//     },
//     scales: {
//       x: { title: { display: true, text: defaultXAxis || 'X-Axis' } },
//       y: { title: { display: true, text: defaultYAxis || 'Y-Axis' } },
//     },
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Filters */}
//       <div className="glass-card p-6 animate-slide-up">
//         <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
//           <Filter className="w-5 h-5 text-primary" />
//           Dashboard Filters & Axes
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <select
//             value={selectedColumn}
//             onChange={(e) => setSelectedColumn(e.target.value)}
//             className="p-2 border rounded"
//           >
//             <option value="">All Data</option>
//             {summary.columnNames?.map(col => (
//               <option key={col} value={col}>{col}</option>
//             ))}
//           </select>
//           <select
//             value={xAxis}
//             onChange={(e) => setXAxis(e.target.value)}
//             className="p-2 border rounded"
//           >
//             <option value="">Select X-Axis</option>
//             {summary.columnNames?.map(col => (
//               <option key={col} value={col}>{col}</option>
//             ))}
//           </select>
//           <select
//             value={yAxis}
//             onChange={(e) => {
//               setYAxis(e.target.value);
//               console.log('Y-Axis changed to:', e.target.value);
//             }}
//             className="p-2 border rounded"
//           >
//             <option value="">Select Y-Axis</option>
//             {numericColumns.map(col => (
//               <option key={col} value={col}>{col}</option>
//             ))}
//           </select>
//         </div>
//         {isFullData && (
//           <p className="text-sm text-muted-foreground mt-2">
//             Full dataset loaded ({chartDataSource.length} rows).
//           </p>
//         )}
//         {isLargeDataset && (
//           <p className="text-sm text-orange-600 mt-2">
//             Warning: Large dataset ({filteredData.length} rows) — performance may be slow.
//           </p>
//         )}
//       </div>

//       {/* Overview Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard icon={Table2} label="Total Rows" value={summary.rows?.toLocaleString() ?? 'N/A'} delay={0} />
//         <StatCard icon={Database} label="Columns" value={summary.columns ?? 'N/A'} delay={50} />
//         <StatCard icon={Hash} label="Numeric Cols" value={numericColumns.length} delay={100} />
//         <StatCard icon={AlertCircle} label="Missing Values" value={totalMissing} delay={150} />
//       </div>

//       {/* Fixed Charts Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Bar Chart */}
//         <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
//           <h3 className="text-lg font-semibold text-foreground mb-4">Bar Chart</h3>
//           {barChartData && <Bar key={xAxis + yAxis} options={chartOptions} data={barChartData} />}
//         </div>

//         {/* Line Chart */}
//         <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
//           <h3 className="text-lg font-semibold text-foreground mb-4">Line Chart</h3>
//           {lineChartData && <Line key={xAxis + yAxis} options={chartOptions} data={lineChartData} />}
//         </div>

//         {/* Area Chart */}
//         <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
//           <h3 className="text-lg font-semibold text-foreground mb-4">Area Chart</h3>
//           {areaChartData && <Line key={xAxis + yAxis} options={{ ...chartOptions, fill: true }} data={areaChartData} />}
//         </div>

//         {/* Scatter Plot */}
//         <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '350ms' }}>
//           <h3 className="text-lg font-semibold text-foreground mb-4">Scatter Plot</h3>
//           {scatterChartData && <Scatter key={`${xAxis}-${yAxis}`} options={chartOptions} data={scatterChartData} />}
//         </div>

//         {/* Pie Chart */}
//         <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
//           <h3 className="text-lg font-semibold text-foreground mb-4">Pie Chart</h3>
//           <Pie options={chartOptions} data={pieChartData} />
//         </div>

//         {/* Donut Chart */}
//         <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '450ms' }}>
//           <h3 className="text-lg font-semibold text-foreground mb-4">Donut Chart</h3>
//           <Doughnut options={chartOptions} data={donutChartData} />
//         </div>
//       </div>

//       {/* Tables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Numeric Statistics Table */}
//         {numericColumns.length > 0 && (
//           <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
//             <h3 className="text-lg font-semibold text-foreground mb-4">Numeric Statistics</h3>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-border">
//                     <th className="text-left py-3 px-4 text-muted-foreground font-medium">Column</th>
//                     <th className="text-right py-3 px-4 text-muted-foreground font-medium">Mean</th>
//                     <th className="text-right py-3 px-4 text-muted-foreground font-medium">Std Dev</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {numericColumns.map((col) => (
//                     <tr key={col} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
//                       <td className="py-3 px-4 font-mono text-foreground">{col}</td>
//                       <td className="py-3 px-4 text-right text-foreground">{summary.numericStats[col]?.mean ?? 'N/A'}</td>
//                       <td className="py-3 px-4 text-right text-muted-foreground">{summary.numericStats[col]?.std ?? 'N/A'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Sample Data Table */}
//         <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '550ms' }}>
//           <h3 className="text-lg font-semibold text-foreground mb-4">Sample Data Preview</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border">
//                   {summary.columnNames?.slice(0, 5).map((col) => (
//                     <th key={col} className="text-left py-3 px-4 text-muted-foreground font-medium whitespace-nowrap">
//                       {col}
//                     </th>
//                   )) ?? <th>No columns</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {summary.sampleData?.slice(0, 5).map((row, idx) => (
//                   <tr key={idx} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
//                     {summary.columnNames?.slice(0, 5).map((col) => (
//                       <td key={col} className="py-3 px-4 text-foreground whitespace-nowrap">
//                         {String(row[col] ?? '-')}
//                       </td>
//                     )) ?? <td>No data</td>}
//                   </tr>
//                 )) ?? <tr><td>No sample data</td></tr>}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SummaryDisplay;


import { useState } from 'react';
import { Database, Table2, Hash, AlertCircle, Filter } from 'lucide-react';
import { useDataStore } from '@/store/data-store';
import { Bar, Pie, Line, Scatter } from 'react-chartjs-2'; // Removed Doughnut and kept others
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
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
  const [selectedColumn, setSelectedColumn] = useState<string>(''); // General filter
  const [xAxis, setXAxis] = useState<string>(''); // X-axis selection
  const [yAxis, setYAxis] = useState<string>(''); // Y-axis selection
  const [pieColumn, setPieColumn] = useState<string>('results'); // Pie column selection

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

  // Use fullData if available, else sampleData
  const chartDataSource = summary?.fullData || summary?.sampleData || [];
  const isFullData = !!summary?.fullData;

  // Debug logs
  console.log('numericColumns:', numericColumns);
  console.log('yAxis selected:', yAxis);
  console.log('chartDataSource length:', chartDataSource.length);

  // Filtered data for charts
  const filteredData = chartDataSource.filter(row => 
    !selectedColumn || row[selectedColumn] !== undefined
  );

  // Performance warning
  const isLargeDataset = filteredData.length > 1000;

  // Auto-select defaults if no axes chosen
  const defaultXAxis = xAxis || (summary.columnNames?.[0] || '');
  const defaultYAxis = yAxis || (numericColumns[0] || '');

  // Bar Chart Data (x-axis labels from selected column, y-axis from selected numeric)
  const barChartData = filteredData.length > 0 ? {
    labels: filteredData.map(row => String(row[defaultXAxis] ?? 'N/A')), // Use x-axis column values as labels
    datasets: [
      {
        label: defaultYAxis || 'Value',
        data: filteredData.map(row => row[defaultYAxis] ?? 0),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
    ],
  } : null;

  // Scatter Chart Data (uses x/y axes directly)
  const scatterChartData = filteredData.length > 0 ? {
    datasets: [
      {
        label: `${defaultXAxis} vs ${defaultYAxis}`,
        data: filteredData.map(row => ({
          x: row[defaultXAxis] ?? 0,
          y: row[defaultYAxis] ?? 0,
        })),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
    ],
  } : null;

  // Line Chart Data (x-axis labels from selected column, y-axis from selected numeric)
  const lineChartData = filteredData.length > 0 ? {
    labels: filteredData.map(row => String(row[defaultXAxis] ?? 'N/A')), // Use x-axis column values as labels
    datasets: [
      {
        label: defaultYAxis || 'Value',
        data: filteredData.map(row => row[defaultYAxis] ?? 0),
        backgroundColor: 'rgba(37, 99, 235, 1)',
        borderColor: 'rgba(37, 99, 235, 1)',
        tension: 0.4,
      },
    ],
  } : null;

  // Pie Chart Data (uses selected pieColumn for categories)
  const pieChartData = {
    labels: chartDataSource.map(row => row[pieColumn]).filter(Boolean).reduce((acc, result) => {
      if (!acc.includes(result)) acc.push(result);
      return acc;
    }, [] as string[]) || [],
    datasets: [
      {
        data: chartDataSource.map(row => row[pieColumn]).filter(Boolean).reduce((acc, result) => {
          acc[result] = (acc[result] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) ? Object.values(chartDataSource.map(row => row[pieColumn]).filter(Boolean).reduce((acc, result) => {
          acc[result] = (acc[result] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)) : [],
        backgroundColor: ['rgba(37, 99, 235, 0.7)', 'rgba(220, 38, 38, 0.7)', 'rgba(34, 197, 94, 0.7)'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: defaultXAxis || 'X-Axis' } },
      y: { title: { display: true, text: defaultYAxis || 'Y-Axis' } },
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="glass-card p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          Dashboard Filters & Axes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Data</option>
            {summary.columnNames?.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select X-Axis</option>
            {summary.columnNames?.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <select
            value={yAxis}
            onChange={(e) => {
              setYAxis(e.target.value);
              console.log('Y-Axis changed to:', e.target.value);
            }}
            className="p-2 border rounded"
          >
            <option value="">Select Y-Axis</option>
            {numericColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <select
            value={pieColumn}
            onChange={(e) => setPieColumn(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Pie Column</option>
            {summary.columnNames?.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        {isFullData && (
          <p className="text-sm text-muted-foreground mt-2">
            Full dataset loaded ({chartDataSource.length} rows).
          </p>
        )}
        {isLargeDataset && (
          <p className="text-sm text-orange-600 mt-2">
            Warning: Large dataset ({filteredData.length} rows) — performance may be slow.
          </p>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Table2} label="Total Rows" value={summary.rows?.toLocaleString() ?? 'N/A'} delay={0} />
        <StatCard icon={Database} label="Columns" value={summary.columns ?? 'N/A'} delay={50} />
        <StatCard icon={Hash} label="Numeric Cols" value={numericColumns.length} delay={100} />
        <StatCard icon={AlertCircle} label="Missing Values" value={totalMissing} delay={150} />
      </div>

      {/* Fixed Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"> {/* Adjusted to 4 columns */}
        {/* Bar Chart */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Bar Chart</h3>
          {barChartData && <Bar key={xAxis + yAxis} options={chartOptions} data={barChartData} />}
        </div>

        {/* Line Chart */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Line Chart</h3>
          {lineChartData && <Line key={xAxis + yAxis} options={chartOptions} data={lineChartData} />}
        </div>

        {/* Scatter Plot */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Scatter Plot</h3>
          {scatterChartData && <Scatter key={`${xAxis}-${yAxis}`} options={chartOptions} data={scatterChartData} />}
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '350ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Pie Chart</h3>
          <Pie options={chartOptions} data={pieChartData} />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Numeric Statistics Table */}
        {numericColumns.length > 0 && (
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Numeric Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Column</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Mean</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Std Dev</th>
                  </tr>
                </thead>
                <tbody>
                  {numericColumns.map((col) => (
                    <tr key={col} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-foreground">{col}</td>
                      <td className="py-3 px-4 text-right text-foreground">{summary.numericStats[col]?.mean ?? 'N/A'}</td>
                      <td className="py-3 px-4 text-right text-muted-foreground">{summary.numericStats[col]?.std ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sample Data Table */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '450ms' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Sample Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {summary.columnNames?.slice(0, 5).map((col) => (
                    <th key={col} className="text-left py-3 px-4 text-muted-foreground font-medium whitespace-nowrap">
                      {col}
                    </th>
                  )) ?? <th>No columns</th>}
                </tr>
              </thead>
              <tbody>
                {summary.sampleData?.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    {summary.columnNames?.slice(0, 5).map((col) => (
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
    </div>
  );
};

export default SummaryDisplay;
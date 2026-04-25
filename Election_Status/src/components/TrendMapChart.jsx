import { useState, useEffect } from 'react';
import { MapPin, BarChart3 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TrendMapChart({ liveSeats }) {
  const [isDark, setIsDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const textColor = isDark ? '#9ca3af' : '#4b5563';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  const chartData = {
    labels: ['DMK', 'AIADMK', 'TVK', 'BJP'],
    datasets: [
      { label: 'Exit Poll', data: [128, 92, 12, 2], backgroundColor: '#3b82f6', borderRadius: 8 },
      { label: 'Live Lead', data: [liveSeats.DMK, liveSeats.AIADMK, liveSeats.TVK, liveSeats.BJP], backgroundColor: '#ef4444', borderRadius: 8 },
    ],
  };

  const districts = [
    { name: 'Chennai South', party: 'DMK', darkBg: 'bg-red-900/20', lightBg: 'bg-red-50', text: 'text-red-500' },
    { name: 'Coimbatore', party: 'AIADMK', darkBg: 'bg-blue-900/20', lightBg: 'bg-blue-50', text: 'text-blue-500' },
    { name: 'Madurai', party: 'TVK', darkBg: 'bg-yellow-900/20', lightBg: 'bg-yellow-50', text: 'text-yellow-600' },
    { name: 'Tiruchy', party: 'BJP+', darkBg: 'bg-orange-900/20', lightBg: 'bg-orange-50', text: 'text-orange-500' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6" data-aos="fade-left">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 theme-text-primary">
        <MapPin className="text-blue-400 w-5 h-5" /> Constituency Trend Map
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {districts.map(dd => (
          <div key={dd.name} className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-105 border border-gray-200 dark:border-white/5 ${isDark ? dd.darkBg : dd.lightBg}`}>
            <div className="text-[10px] mb-1 theme-text-muted">📍 {dd.name}</div>
            <div className={`text-xs font-bold ${dd.text}`}>{dd.party} Leading</div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-center mb-6 theme-text-muted">Hover markers on interactive map for details</p>

      <div className="pt-6 border-t border-gray-500/10">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 theme-text-primary">
          <BarChart3 className="w-4 h-4 text-blue-400" /> Exit Poll vs Live Lead
        </h4>
        <div className="h-[200px]">
          <Bar data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: textColor, font: { size: 10 } } } },
            scales: {
              y: { grid: { color: gridColor }, ticks: { color: textColor } },
              x: { grid: { display: false }, ticks: { color: textColor } },
            },
          }} />
        </div>
      </div>
    </div>
  );
}

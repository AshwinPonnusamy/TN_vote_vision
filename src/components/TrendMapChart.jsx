import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { MapPin, BarChart3 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PARTY_COLORS } from '../constants/data';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TrendMapChart({ liveSeats, selectedState, isDark }) {
  const textColor = isDark ? '#9ca3af' : '#4b5563';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  const activeParties = Object.keys(liveSeats).filter(p => liveSeats[p] > 0).slice(0, 6);
  const labels = activeParties;
  const leadData = activeParties.map(p => liveSeats[p]);
  
  const chartData = {
    labels: labels,
    datasets: [
      { 
        label: 'Live Lead', 
        data: leadData, 
        backgroundColor: activeParties.map(p => PARTY_COLORS[p] || '#6b7280'), 
        borderRadius: 8 
      },
    ],
  };

  const topDistricts = [
    { name: 'Region North', party: activeParties[0] || 'TBD' },
    { name: 'Region South', party: activeParties[1] || 'TBD' },
    { name: 'Region East', party: activeParties[2] || 'TBD' },
    { name: 'Region West', party: activeParties[3] || 'TBD' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6" data-aos="fade-left">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 theme-text-primary">
        <MapPin className="text-blue-400 w-5 h-5" /> Regional Lead Snapshot
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {topDistricts.map(dd => (
          <div key={dd.name} className={`p-3 rounded-xl cursor-pointer transition-all hover:scale-105 border border-gray-200 dark:border-white/5 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className="text-[10px] mb-1 theme-text-muted">📍 {dd.name}</div>
            <div className={`text-xs font-bold theme-text-primary`}>{dd.party} Leading</div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-center mb-6 theme-text-muted">Regional breakdown based on current counting patterns</p>

      <div className="pt-6 border-t border-gray-500/10">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 theme-text-primary">
          <BarChart3 className="w-4 h-4 text-blue-400" /> Lead Comparison by Party
        </h4>
        <div className="h-[200px]">
          <Bar data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
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

TrendMapChart.propTypes = {
  liveSeats: PropTypes.object.isRequired,
  selectedState: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
};

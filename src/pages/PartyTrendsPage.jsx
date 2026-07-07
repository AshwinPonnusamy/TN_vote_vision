import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Doughnut, Line, Radar, Bar } from 'react-chartjs-2';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart, ArrowLeft, Activity,
  Target, Zap, Award, ChevronUp, ChevronDown, Minus, RefreshCw,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { PARTIES, PARTY_COLORS } from '../constants/data';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler
);

const HIST = {
  DMK: { 2016: 89, 2021: 133, ep: 128 },
  AIADMK: { 2016: 134, 2021: 75, ep: 92 },
  TVK: { 2016: 0, 2021: 0, ep: 12 },
  BJP: { 2016: 0, 2021: 4, ep: 2 },
  NTK: { 2016: 0, 2021: 0, ep: 0 },
  Others: { 2016: 11, 2021: 22, ep: 0 },
};

function genRounds(seats) {
  return Array.from({ length: 18 }, (_, i) => {
    const m = Math.min(1, (i + 1) / 18 + (Math.random() * 0.1 - 0.05));
    const d = {};
    PARTIES.forEach(p => { d[p] = Math.max(0, Math.floor((seats[p] || 0) * m * (0.85 + Math.random() * 0.3))); });
    return { round: i + 1, ...d };
  });
}

export default function PartyTrendsPage({ liveSeats, voteShares, theme }) {
  const [selectedParty, setSelectedParty] = useState(null);
  const [roundData, setRoundData] = useState([]);
  const [updated, setUpdated] = useState(new Date());

  const isDark = theme === 'dark';

  const chartTooltip = useMemo(() => ({
    backgroundColor: isDark ? 'rgba(11,14,23,0.9)' : 'rgba(255,255,255,0.95)',
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderWidth: 1, padding: 12, cornerRadius: 12,
    titleColor: isDark ? '#fff' : '#000',
    bodyColor: isDark ? '#fff' : '#000',
  }), [isDark]);

  useEffect(() => { setRoundData(genRounds(liveSeats)); setUpdated(new Date()); }, [liveSeats]);

  const total = useMemo(() => Object.values(liveSeats).reduce((a, b) => a + b, 0), [liveSeats]);
  const leader = useMemo(() => PARTIES.reduce((m, p) => (liveSeats[p] > liveSeats[m] ? p : m), PARTIES[0]), [liveSeats]);

  const swings = PARTIES.map(p => ({ party: p, ep: HIST[p]?.ep || 0, live: liveSeats[p] || 0, swing: (liveSeats[p] || 0) - (HIST[p]?.ep || 0) }));

  const doughnut = useMemo(() => ({
    labels: PARTIES,
    datasets: [{ data: PARTIES.map(p => liveSeats[p] || 0), backgroundColor: PARTIES.map(p => PARTY_COLORS[p]), borderColor: isDark ? '#0B0E17' : '#ffffff', borderWidth: 3, hoverOffset: 12 }],
  }), [liveSeats, isDark]);

  const line = useMemo(() => ({
    labels: roundData.map(d => `R${d.round}`),
    datasets: PARTIES.filter(p => p !== 'Others').map(p => ({
      label: p, data: roundData.map(d => d[p] || 0), borderColor: PARTY_COLORS[p],
      backgroundColor: PARTY_COLORS[p] + '20', fill: false, tension: 0.4, pointRadius: 3, borderWidth: 2.5,
    })),
  }), [roundData]);

  const radar = useMemo(() => ({
    labels: ['Urban', 'Rural', 'Semi-Urban', 'Coastal', 'Hill', 'Delta'],
    datasets: ['DMK', 'AIADMK', 'TVK', 'BJP'].map(p => ({
      label: p, data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 40 + 20)),
      borderColor: PARTY_COLORS[p], backgroundColor: PARTY_COLORS[p] + '15', borderWidth: 2, pointBackgroundColor: PARTY_COLORS[p],
    })),
  }), []);

  const histBar = useMemo(() => ({
    labels: PARTIES.filter(p => p !== 'Others'),
    datasets: [
      { label: '2016', data: PARTIES.filter(p => p !== 'Others').map(p => HIST[p]?.[2016] || 0), backgroundColor: '#6b728040', borderRadius: 6 },
      { label: '2021', data: PARTIES.filter(p => p !== 'Others').map(p => HIST[p]?.[2021] || 0), backgroundColor: '#3b82f660', borderRadius: 6 },
      { label: 'Exit Poll', data: PARTIES.filter(p => p !== 'Others').map(p => HIST[p]?.ep || 0), backgroundColor: '#8b5cf660', borderRadius: 6 },
      { label: 'Live 2026', data: PARTIES.filter(p => p !== 'Others').map(p => liveSeats[p] || 0), backgroundColor: '#ef444490', borderRadius: 6 },
    ],
  }), [liveSeats]);

  const scaleOpts = useMemo(() => ({
    y: { grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }, ticks: { color: isDark ? '#9ca3af' : '#4b5563', font: { size: 10 } } },
    x: { grid: { display: false }, ticks: { color: isDark ? '#9ca3af' : '#4b5563', font: { size: 10 } } }
  }), [isDark]);

  const radarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: isDark ? '#9ca3af' : '#4b5563', font: { size: 11 }, usePointStyle: true } } },
    scales: { r: { grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }, angleLines: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }, pointLabels: { color: isDark ? '#9ca3af' : '#4b5563', font: { size: 10 } }, ticks: { display: false } } }
  }), [isDark]);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-[1600px] mx-auto px-3 md:px-6 py-4">
        {/* Nav */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-gray-500"><RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} /> {updated.toLocaleTimeString()}</span>
            <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> LIVE</span>
          </div>
        </div>

        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-red-600/5" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-blue-400" /></div>
            <div><h1 className="text-3xl md:text-4xl font-black tracking-tight">Party-Wise Trends</h1><p className="text-gray-400 text-sm mt-1">Deep dive into party performance · TN 2026</p></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {PARTIES.filter(p => p !== 'Others').map(p => {
            const s = liveSeats[p] || 0, sw = swings.find(x => x.party === p)?.swing || 0;
            return (
              <button key={p} onClick={() => setSelectedParty(selectedParty === p ? null : p)}
                className={cn("glass-card rounded-2xl p-4 text-left transition-all hover:scale-[1.02] cursor-pointer", selectedParty === p && "ring-2")}
                style={{ borderColor: selectedParty === p ? PARTY_COLORS[p] : undefined, boxShadow: selectedParty === p ? `0 0 20px ${PARTY_COLORS[p]}20` : undefined }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PARTY_COLORS[p] }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{p}</span>
                  {p === leader && <Award className="w-3.5 h-3.5 text-yellow-400 ml-auto" />}
                </div>
                <div className="text-3xl font-black" style={{ color: PARTY_COLORS[p] }}>{s}</div>
                <div className="text-xs text-gray-500 mt-1">seats</div>
                <div className="flex items-center gap-1 mt-2">
                  {sw > 0 ? <ChevronUp className="w-3 h-3 text-green-400" /> : sw < 0 ? <ChevronDown className="w-3 h-3 text-red-400" /> : <Minus className="w-3 h-3 text-gray-500" />}
                  <span className={cn("text-xs font-mono", sw > 0 ? "text-green-400" : sw < 0 ? "text-red-400" : "text-gray-500")}>{sw > 0 ? '+' : ''}{sw} vs exit poll</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><PieChart className="text-purple-400 w-5 h-5" /> Seat Share Distribution</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-[260px] h-[260px] relative">
                <Doughnut data={doughnut} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: chartTooltip } }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl font-black">{total}</span><span className="text-xs text-gray-500 uppercase">Total</span></div>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {PARTIES.map(p => { const s = liveSeats[p] || 0, pct = total > 0 ? ((s / total) * 100).toFixed(1) : 0; return (
                  <div key={p} className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PARTY_COLORS[p] }} />
                    <span className="text-sm font-medium w-16">{p}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: PARTY_COLORS[p] }} /></div>
                    <span className="text-sm font-mono w-20 text-right" style={{ color: PARTY_COLORS[p] }}>{s} <span className="text-gray-500 text-xs">({pct}%)</span></span>
                  </div>
                ); })}
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><TrendingUp className="text-green-400 w-5 h-5" /> Round-wise Seat Trends</h3>
            <div className="h-[320px]"><Line data={line} options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { color: isDark ? '#9ca3af' : '#4b5563', font: { size: 11 }, usePointStyle: true } }, tooltip: chartTooltip }, scales: scaleOpts }} /></div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Target className="text-cyan-400 w-5 h-5" /> Regional Strength</h3>
            <div className="h-[320px]"><Radar data={radar} options={radarOptions} /></div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BarChart3 className="text-amber-400 w-5 h-5" /> Historical Comparison</h3>
            <div className="h-[320px]"><Bar data={histBar} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: isDark ? '#9ca3af' : '#4b5563', font: { size: 10 }, usePointStyle: true }, position: 'top' }, tooltip: chartTooltip }, scales: scaleOpts }} /></div>
          </div>
        </div>

        {/* Swing Table */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Zap className="text-yellow-400 w-5 h-5" /> Swing Analysis — Exit Poll vs Live</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">
                <tr><th className="p-4 text-left rounded-l-xl">Party</th><th className="p-4 text-center">Exit Poll</th><th className="p-4 text-center">Live</th><th className="p-4 text-center">Swing</th><th className="p-4 text-center">Vote %</th><th className="p-4 text-center rounded-r-xl">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {swings.map(r => (<tr key={r.party} className="table-row-transition"><td className="p-4"><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: PARTY_COLORS[r.party] }} /><span className="font-bold">{r.party}</span></div></td><td className="p-4 text-center font-mono text-gray-400">{r.ep}</td><td className="p-4 text-center font-mono font-bold" style={{ color: PARTY_COLORS[r.party] }}>{r.live}</td><td className="p-4 text-center"><span className={cn("inline-flex items-center gap-1 font-mono font-bold", r.swing > 0 ? "text-green-400" : r.swing < 0 ? "text-red-400" : "text-gray-500")}>{r.swing > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : r.swing < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}{r.swing > 0 ? '+' : ''}{r.swing}</span></td><td className="p-4 text-center text-xs font-mono text-gray-400">{(voteShares[r.party] || 0).toFixed(1)}%</td><td className="p-4 text-center"><span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", r.live >= 118 ? "bg-green-500/10 text-green-400 border border-green-500/20" : r.live >= 80 ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20")}>{r.live >= 118 ? 'Majority' : r.live >= 80 ? 'Strong' : 'Trailing'}</span></td></tr>))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vote Share Cards */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Activity className="text-red-400 w-5 h-5" /> Detailed Vote Share</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARTIES.map(p => { const s = liveSeats[p] || 0, vs = (voteShares[p] || 0).toFixed(1); return (
              <div key={p} className="bg-black/[0.01] dark:bg-white/[0.02] rounded-xl p-5 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all" style={{ borderLeftColor: PARTY_COLORS[p], borderLeftWidth: '3px' }}>
                <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: PARTY_COLORS[p] }} /><span className="font-bold text-sm">{p}</span></div><span className="text-2xl font-black" style={{ color: PARTY_COLORS[p] }}>{s}</span></div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-black/5 dark:bg-black/20 rounded-lg p-2"><div className="text-green-600 dark:text-green-400 font-bold text-sm">{Math.floor(s * 0.6)}</div><div className="text-[9px] text-gray-500 uppercase">Won</div></div>
                  <div className="bg-black/5 dark:bg-black/20 rounded-lg p-2"><div className="text-blue-600 dark:text-blue-400 font-bold text-sm">{Math.floor(s * 0.4)}</div><div className="text-[9px] text-gray-500 uppercase">Leading</div></div>
                  <div className="bg-black/5 dark:bg-black/20 rounded-lg p-2"><div className="text-gray-700 dark:text-gray-300 font-bold text-sm">{vs}%</div><div className="text-[9px] text-gray-500 uppercase">Vote %</div></div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-4 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${(s / 234) * 100}%`, backgroundColor: PARTY_COLORS[p] }} /></div>
              </div>
            ); })}
          </div>
        </div>

        <footer className="text-center py-6 border-t border-black/5 dark:border-white/5"><p className="text-[11px] text-gray-500">Live counting trends · Auto-refreshes every 3s · TN Assembly 2026</p></footer>
      </div>
    </div>
  );
}

PartyTrendsPage.propTypes = {
  liveSeats: PropTypes.object.isRequired,
  voteShares: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
};

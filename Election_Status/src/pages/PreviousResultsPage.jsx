import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  ArrowLeft, Calendar, Trophy, Users, TrendingUp, TrendingDown, Award,
  ChevronRight, ChevronLeft, Star, MapPin, History, Crown, BarChart3,
  CircleDot, Sparkles, Flag,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { ELECTION_YEARS, HISTORICAL_RESULTS, PARTY_HISTORY_COLORS } from '../constants/historicalData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartTooltip = { backgroundColor: 'rgba(11,14,23,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 12, cornerRadius: 12 };
const scaleOpts = { y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280', font: { size: 10 } } }, x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 10 } } } };

export default function PreviousResultsPage() {
  const [selectedYear, setSelectedYear] = useState(2021);
  const data = HISTORICAL_RESULTS[selectedYear];
  const yearIdx = ELECTION_YEARS.indexOf(selectedYear);

  const goNext = () => { if (yearIdx > 0) setSelectedYear(ELECTION_YEARS[yearIdx - 1]); };
  const goPrev = () => { if (yearIdx < ELECTION_YEARS.length - 1) setSelectedYear(ELECTION_YEARS[yearIdx + 1]); };

  const barData = {
    labels: data.parties.map(p => p.party),
    datasets: [{
      label: 'Seats Won',
      data: data.parties.map(p => p.seats),
      backgroundColor: data.parties.map(p => (PARTY_HISTORY_COLORS[p.party] || '#6b7280') + 'cc'),
      borderRadius: 8, borderSkipped: false,
    }],
  };

  const doughnutData = {
    labels: data.parties.map(p => p.party),
    datasets: [{
      data: data.parties.map(p => p.voteShare),
      backgroundColor: data.parties.map(p => PARTY_HISTORY_COLORS[p.party] || '#6b7280'),
      borderColor: '#0B0E17', borderWidth: 3, hoverOffset: 10,
    }],
  };

  // Timeline trend: seats of DMK, AIADMK, and Congress across years
  const trendLine = useMemo(() => {
    const years = [...ELECTION_YEARS].reverse();
    const getPartySeats = (yr, names) => {
      const d = HISTORICAL_RESULTS[yr];
      const p = d.parties.find(p => names.includes(p.party));
      return p?.seats || 0;
    };
    const dmkSeats = years.map(y => getPartySeats(y, ['DMK+', 'DMK']));
    const aiSeats = years.map(y => getPartySeats(y, ['AIADMK+', 'AIADMK']));
    const congSeats = years.map(y => getPartySeats(y, ['Congress', 'Congress(I)']));
    return {
      labels: years.map(String),
      datasets: [
        { label: 'DMK/DMK+', data: dmkSeats, borderColor: '#ef4444', backgroundColor: '#ef444420', fill: true, tension: 0.4, pointRadius: 4, pointHoverRadius: 7, borderWidth: 2.5 },
        { label: 'AIADMK/AIADMK+', data: aiSeats, borderColor: '#3b82f6', backgroundColor: '#3b82f620', fill: true, tension: 0.4, pointRadius: 4, pointHoverRadius: 7, borderWidth: 2.5 },
        { label: 'Congress', data: congSeats, borderColor: '#0ea5e9', backgroundColor: '#0ea5e920', fill: true, tension: 0.4, pointRadius: 4, pointHoverRadius: 7, borderWidth: 2, borderDash: [5, 3] },
      ],
    };
  }, []);

  const winner = data.parties.find(p => p.status === 'Won');

  return (
    <div className="min-h-screen bg-[#0B0E17] text-gray-200">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-3 md:px-6 py-4">
        {/* Nav */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 via-purple-600/5 to-blue-600/5" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center"><History className="w-5 h-5 text-amber-400" /></div>
            <div><h1 className="text-3xl md:text-4xl font-black tracking-tight">Previous Election Results</h1><p className="text-gray-400 text-sm mt-1">Tamil Nadu / Madras State Assembly Elections · Historical Archive (1952 – 2021)</p></div>
          </div>
        </div>

        {/* Year Selector */}
        <div className="glass-card rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={goPrev} disabled={yearIdx >= ELECTION_YEARS.length - 1} className={cn("p-2 rounded-xl transition-all", yearIdx >= ELECTION_YEARS.length - 1 ? "text-gray-700 cursor-not-allowed" : "hover:bg-white/10 text-gray-400")}><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex-1 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {ELECTION_YEARS.map(y => (
                <button key={y} onClick={() => setSelectedYear(y)}
                  className={cn("px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border",
                    selectedYear === y ? "bg-amber-500/20 border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10" : "bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5"
                  )}>
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5" />{y}
                </button>
              ))}
            </div>
            <button onClick={goNext} disabled={yearIdx <= 0} className={cn("p-2 rounded-xl transition-all", yearIdx <= 0 ? "text-gray-700 cursor-not-allowed" : "hover:bg-white/10 text-gray-400")}><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Winner Banner */}
        <div className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden" style={{ borderLeft: `4px solid ${PARTY_HISTORY_COLORS[winner?.party] || '#6b7280'}` }}>
          <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${PARTY_HISTORY_COLORS[winner?.party] || '#6b7280'}, transparent)` }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: (PARTY_HISTORY_COLORS[winner?.party] || '#6b7280') + '20' }}>
                <Crown className="w-7 h-7" style={{ color: PARTY_HISTORY_COLORS[winner?.party] }} />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Election Winner · {selectedYear}</div>
                <h2 className="text-2xl font-black" style={{ color: PARTY_HISTORY_COLORS[winner?.party] }}>{winner?.party}</h2>
                <p className="text-gray-400 text-sm mt-1">Chief Minister: <span className="text-white font-semibold">{data.chiefMinister}</span></p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center"><div className="text-2xl font-black text-white">{winner?.seats}</div><div className="text-[10px] text-gray-500 uppercase">Seats Won</div></div>
              <div className="text-center"><div className="text-2xl font-black text-white">{winner?.voteShare}%</div><div className="text-[10px] text-gray-500 uppercase">Vote Share</div></div>
              <div className="text-center"><div className="text-2xl font-black text-white">{data.turnout}</div><div className="text-[10px] text-gray-500 uppercase">Turnout</div></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4 text-center"><BarChart3 className="w-5 h-5 text-red-400 mx-auto mb-2" /><div className="text-2xl font-black">{data.totalSeats}</div><div className="text-[10px] text-gray-500 uppercase">Total Seats</div></div>
          <div className="glass-card rounded-xl p-4 text-center"><Users className="w-5 h-5 text-green-400 mx-auto mb-2" /><div className="text-2xl font-black">{data.turnout}</div><div className="text-[10px] text-gray-500 uppercase">Voter Turnout</div></div>
          <div className="glass-card rounded-xl p-4 text-center"><Flag className="w-5 h-5 text-blue-400 mx-auto mb-2" /><div className="text-2xl font-black">{data.parties.length}</div><div className="text-[10px] text-gray-500 uppercase">Major Parties</div></div>
          <div className="glass-card rounded-xl p-4 text-center"><Award className="w-5 h-5 text-yellow-400 mx-auto mb-2" /><div className="text-2xl font-black">{data.rulingParty}</div><div className="text-[10px] text-gray-500 uppercase">Ruling Party</div></div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Seats Bar Chart */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BarChart3 className="text-red-400 w-5 h-5" /> Seats Won by Party — {selectedYear}</h3>
            <div className="h-[300px]"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false }, tooltip: chartTooltip }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280' } }, y: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 12, weight: 'bold' } } } } }} /></div>
          </div>
          {/* Vote Share Doughnut */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><CircleDot className="text-purple-400 w-5 h-5" /> Vote Share Distribution</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-[240px] h-[240px] relative">
                <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false }, tooltip: chartTooltip } }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-2xl font-black">{selectedYear}</span><span className="text-[10px] text-gray-500 uppercase">Election</span></div>
              </div>
              <div className="flex-1 space-y-2 w-full">
                {data.parties.map(p => (
                  <div key={p.party} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PARTY_HISTORY_COLORS[p.party] || '#6b7280' }} />
                    <span className="font-medium w-20">{p.party}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${p.voteShare * 2}%`, backgroundColor: PARTY_HISTORY_COLORS[p.party] || '#6b7280' }} /></div>
                    <span className="font-mono text-xs w-12 text-right text-gray-400">{p.voteShare}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Party Results Table */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Trophy className="text-yellow-400 w-5 h-5" /> Party-Wise Results — {selectedYear}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider">
                <tr><th className="p-4 text-left rounded-l-xl">Party</th><th className="p-4 text-center">Seats</th><th className="p-4 text-center">Vote Share</th><th className="p-4 text-center">Change</th><th className="p-4 text-center">Seat Share</th><th className="p-4 text-center rounded-r-xl">Result</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.parties.map(p => {
                  const color = PARTY_HISTORY_COLORS[p.party] || '#6b7280';
                  const pct = ((p.seats / data.totalSeats) * 100).toFixed(1);
                  const chg = parseInt(p.change);
                  return (
                    <tr key={p.party} className="table-row-transition">
                      <td className="p-4"><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} /><span className="font-bold">{p.party}</span></div></td>
                      <td className="p-4 text-center font-mono font-bold text-lg" style={{ color }}>{p.seats}</td>
                      <td className="p-4 text-center"><div className="flex items-center justify-center gap-2"><div className="w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${p.voteShare * 2}%`, backgroundColor: color }} /></div><span className="text-xs font-mono text-gray-400">{p.voteShare}%</span></div></td>
                      <td className="p-4 text-center"><span className={cn("inline-flex items-center gap-1 font-mono text-sm font-bold", chg > 0 ? "text-green-400" : chg < 0 ? "text-red-400" : "text-gray-500")}>{chg > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : chg < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}{p.change}</span></td>
                      <td className="p-4 text-center text-xs font-mono text-gray-400">{pct}%</td>
                      <td className="p-4 text-center"><span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", p.status === 'Won' ? "bg-green-500/10 text-green-400 border border-green-500/20" : p.status === 'Lost' ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20")}>{p.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Constituencies & Highlights */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Key Constituencies */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="text-blue-400 w-5 h-5" /> Key Constituencies</h3>
            <div className="space-y-3">
              {data.keyConstituencies.map((c, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: (PARTY_HISTORY_COLORS[c.party] || '#6b7280') + '20', color: PARTY_HISTORY_COLORS[c.party] }}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.winner} · <span style={{ color: PARTY_HISTORY_COLORS[c.party] }}>{c.party}</span></div>
                  </div>
                  <div className="text-right shrink-0"><div className="text-green-400 font-mono font-bold text-sm">+{c.margin.toLocaleString()}</div><div className="text-[9px] text-gray-500 uppercase">margin</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Sparkles className="text-amber-400 w-5 h-5" /> Election Highlights</h3>
            <div className="space-y-3">
              {data.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <Star className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-300 leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DMK vs AIADMK Timeline */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><TrendingUp className="text-green-400 w-5 h-5" /> DMK vs AIADMK vs Congress — Historical Seat Trend (1952–2021)</h3>
          <div className="h-[320px]"><Line data={trendLine} options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { color: '#9ca3af', font: { size: 11 }, usePointStyle: true } }, tooltip: chartTooltip }, scales: scaleOpts }} /></div>
        </div>

        {/* All Years Quick Compare */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><History className="text-purple-400 w-5 h-5" /> All Elections at a Glance</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ELECTION_YEARS.map(y => {
              const d = HISTORICAL_RESULTS[y];
              const w = d.parties.find(p => p.status === 'Won');
              const wColor = PARTY_HISTORY_COLORS[w?.party] || '#6b7280';
              return (
                <button key={y} onClick={() => setSelectedYear(y)}
                  className={cn("text-left p-5 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer",
                    selectedYear === y ? "bg-white/10 border-white/20 shadow-lg" : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                  )} style={{ borderLeftColor: wColor, borderLeftWidth: '3px' }}>
                  <div className="text-xs text-gray-500 mb-2">{y} Assembly Election</div>
                  <div className="flex items-center gap-2 mb-1"><Crown className="w-4 h-4" style={{ color: wColor }} /><span className="font-bold" style={{ color: wColor }}>{w?.party}</span></div>
                  <div className="text-lg font-black text-white">{w?.seats} <span className="text-xs text-gray-500 font-normal">seats</span></div>
                  <div className="text-[11px] text-gray-500 mt-1">CM: {d.chiefMinister}</div>
                </button>
              );
            })}
          </div>
        </div>

        <footer className="text-center py-6 border-t border-white/5"><p className="text-[11px] text-gray-500">Historical Data · Tamil Nadu / Madras State Assembly Elections · 1952–2021</p></footer>
      </div>
    </div>
  );
}

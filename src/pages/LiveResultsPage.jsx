import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search, Activity, Circle, Trophy, AlertTriangle,
  TrendingUp, Filter, RefreshCw, MapPin, ChevronDown, Eye,
  CheckCircle, Clock, Zap, X, Users, BarChart3,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { PARTIES, PARTY_COLORS } from '../constants/data';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current, end = value, diff = end - start;
    if (diff === 0) return;
    let frame = 0;
    const totalFrames = 20;
    const timer = setInterval(() => {
      frame++;
      setDisplay(Math.round(start + (diff * frame) / totalFrames));
      if (frame >= totalFrames) { clearInterval(timer); prev.current = value; }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

export default function LiveResultsPage({ liveSeats, voteShares, constituencies }) {
  const [search, setSearch] = useState('');
  const [partyFilter, setPartyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [sortBy, setSortBy] = useState('margin');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [updated, setUpdated] = useState(new Date());

  useEffect(() => { setUpdated(new Date()); }, [liveSeats]);

  const districts = useMemo(() => [...new Set(constituencies.map(c => c.district))], [constituencies]);
  const totalSeats = 234;
  const counted = useMemo(() => Object.values(liveSeats).reduce((a, b) => a + b, 0), [liveSeats]);
  const wonCount = useMemo(() => constituencies.filter(c => c.status === 'Won').length, [constituencies]);
  const tightCount = useMemo(() => constituencies.filter(c => c.status === 'Tight Fight').length, [constituencies]);
  const leader = useMemo(() => PARTIES.reduce((m, p) => (liveSeats[p] > liveSeats[m] ? p : m), PARTIES[0]), [liveSeats]);

  const filtered = useMemo(() => {
    let list = [...constituencies];
    if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.candidate.toLowerCase().includes(search.toLowerCase()));
    if (partyFilter) list = list.filter(c => c.party === partyFilter);
    if (statusFilter) list = list.filter(c => c.status === statusFilter);
    if (districtFilter) list = list.filter(c => c.district === districtFilter);
    list.sort((a, b) => {
      const mul = sortDir === 'desc' ? -1 : 1;
      if (sortBy === 'margin') return mul * (a.margin - b.margin);
      if (sortBy === 'rounds') return mul * (a.rounds - b.rounds);
      return mul * a.name.localeCompare(b.name);
    });
    return list;
  }, [constituencies, search, partyFilter, statusFilter, districtFilter, sortBy, sortDir]);

  const clearFilters = () => { setSearch(''); setPartyFilter(''); setStatusFilter(''); setDistrictFilter(''); };
  const hasFilters = search || partyFilter || statusFilter || districtFilter;

  return (
    <div className="min-h-screen bg-[#0B0E17] text-gray-200">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-3 md:px-6 py-4">
        {/* Nav */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-gray-500"><RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} /> {updated.toLocaleTimeString()}</span>
            <span className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE</span>
          </div>
        </div>

        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-orange-600/5 to-yellow-600/5" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><Activity className="w-5 h-5 text-red-400" /></div>
            <div><h1 className="text-3xl md:text-4xl font-black tracking-tight">Live Election Results</h1><p className="text-gray-400 text-sm mt-1">Real-time constituency-wise counting · TN 2026</p></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'Total Seats', val: totalSeats, icon: <BarChart3 className="text-red-400 w-5 h-5" />, color: 'red' },
            { label: 'Counted', val: counted, icon: <CheckCircle className="text-green-400 w-5 h-5" />, color: 'green' },
            { label: 'Declared', val: wonCount, icon: <Trophy className="text-yellow-400 w-5 h-5" />, color: 'yellow' },
            { label: 'Tight Fights', val: tightCount, icon: <AlertTriangle className="text-orange-400 w-5 h-5" />, color: 'orange' },
            { label: 'Leading Party', val: leader, icon: <TrendingUp className="text-blue-400 w-5 h-5" />, color: 'blue', isText: true },
            { label: 'Lead Seats', val: liveSeats[leader], icon: <Zap className="text-purple-400 w-5 h-5" />, color: 'purple' },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-xl p-4 text-center hover:bg-white/5 transition-all group">
              <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">{s.icon}</div>
              <div className={cn("text-2xl font-black", s.isText && "text-lg")}>{s.isText ? s.val : <AnimatedNumber value={s.val} />}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Party Mini Scoreboard */}
        <div className="glass-card rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {PARTIES.map(p => {
              const s = liveSeats[p] || 0, pct = ((s / 234) * 100).toFixed(1);
              return (
                <button key={p} onClick={() => setPartyFilter(partyFilter === p ? '' : p)}
                  className={cn("flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl transition-all cursor-pointer border", partyFilter === p ? "bg-white/10 border-white/20" : "bg-white/[0.02] border-white/5 hover:bg-white/5")}>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PARTY_COLORS[p] }} />
                  <span className="font-bold text-sm">{p}</span>
                  <span className="text-lg font-black" style={{ color: PARTY_COLORS[p] }}>{s}</span>
                  <div className="w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: PARTY_COLORS[p] }} /></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400"><Filter className="w-4 h-4" /> Filters</div>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search constituency or candidate..."
                className="w-full bg-gray-800/50 border border-white/10 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-1 ring-red-500 transition-all" />
            </div>
            <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)} className="bg-gray-800/50 border border-white/10 text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-1 ring-red-500">
              <option value="">All Districts</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={partyFilter} onChange={e => setPartyFilter(e.target.value)} className="bg-gray-800/50 border border-white/10 text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-1 ring-red-500">
              <option value="">All Parties</option>
              {PARTIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-800/50 border border-white/10 text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-1 ring-red-500">
              <option value="">All Status</option>
              <option value="Won">Won</option><option value="Leading">Leading</option><option value="Tight Fight">Tight Fight</option>
            </select>
            <select value={`${sortBy}-${sortDir}`} onChange={e => { const [b, d] = e.target.value.split('-'); setSortBy(b); setSortDir(d); }}
              className="bg-gray-800/50 border border-white/10 text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-1 ring-red-500">
              <option value="margin-desc">Highest Margin</option><option value="margin-asc">Lowest Margin</option>
              <option value="rounds-desc">Most Rounds</option><option value="rounds-asc">Least Rounds</option>
              <option value="name-asc">Name A-Z</option><option value="name-desc">Name Z-A</option>
            </select>
            {hasFilters && <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><X className="w-3 h-3" /> Clear</button>}
          </div>
          <div className="mt-3 text-xs text-gray-500">Showing {filtered.length} of {constituencies.length} constituencies</div>
        </div>

        {/* Constituency Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filtered.map((c, i) => (
            <div key={i}
              onClick={() => setSelectedConstituency(selectedConstituency?.name === c.name ? null : c)}
              className={cn(
                "glass-card rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] group relative overflow-hidden",
                selectedConstituency?.name === c.name && "ring-2",
                c.status === 'Won' && "border-l-4", c.status === 'Tight Fight' && "border-l-4"
              )}
              style={{
                borderLeftColor: c.status === 'Won' ? '#3b82f6' : c.status === 'Tight Fight' ? '#f97316' : 'transparent',
                borderColor: selectedConstituency?.name === c.name ? PARTY_COLORS[c.party] : undefined,
              }}>
              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at 50% 0%, ${PARTY_COLORS[c.party]}08, transparent 70%)` }} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-base">{c.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-[11px] text-gray-500">{c.district}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                    c.status === 'Leading' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    c.status === 'Won' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  )}>
                    {c.status === 'Tight Fight' && <AlertTriangle className="w-2.5 h-2.5 inline mr-1" />}
                    {c.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: PARTY_COLORS[c.party] + '30', color: PARTY_COLORS[c.party] }}>
                    {c.party.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{c.candidate}</div>
                    <div className="flex items-center gap-1.5" style={{ color: PARTY_COLORS[c.party] }}>
                      <Circle className="w-2 h-2 fill-current" />
                      <span className="text-xs font-bold">{c.party}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/20 rounded-lg p-2.5 text-center">
                    <div className="text-green-400 font-mono font-bold text-sm">+{c.margin.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500 uppercase mt-0.5">Margin</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-2.5 text-center">
                    <div className="text-gray-300 font-mono font-bold text-sm">{c.rounds}/18</div>
                    <div className="text-[9px] text-gray-500 uppercase mt-0.5">Rounds</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-2.5 text-center">
                    <div className="text-blue-400 font-mono font-bold text-sm">{((c.rounds / 18) * 100).toFixed(0)}%</div>
                    <div className="text-[9px] text-gray-500 uppercase mt-0.5">Done</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(c.rounds / 18) * 100}%`, backgroundColor: PARTY_COLORS[c.party] }} />
                  </div>
                </div>

                {/* Expanded Detail */}
                {selectedConstituency?.name === c.name && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between"><span>Voter Turnout</span><span className="text-white font-mono">{(82 + Math.random() * 6).toFixed(1)}%</span></div>
                    <div className="flex justify-between"><span>Total Votes Cast</span><span className="text-white font-mono">{(150000 + Math.floor(Math.random() * 50000)).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>EVM Machines</span><span className="text-white font-mono">{Math.floor(Math.random() * 50 + 200)}</span></div>
                    <div className="flex justify-between"><span>Postal Ballots</span><span className="text-white font-mono">{Math.floor(Math.random() * 2000 + 500)}</span></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center mb-8">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-400 mb-2">No constituencies found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm font-bold transition-colors">Clear All Filters</button>
          </div>
        )}

        <footer className="text-center py-6 border-t border-white/5"><p className="text-[11px] text-gray-500">Live counting results · Auto-refreshes every 3s · TN Assembly 2026</p></footer>
      </div>
    </div>
  );
}

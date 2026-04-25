import { useMemo } from 'react';
import { Activity, Search, Circle } from 'lucide-react';
import { cn } from '../utils/cn';
import { PARTIES, PARTY_COLORS, INITIAL_CONSTITUENCIES } from '../constants/data';

export default function ConstituencyTable({ filteredConstituencies, filters, setFilters, isTamil }) {
  const districts = useMemo(() => [...new Set(INITIAL_CONSTITUENCIES.map(c => c.district))].sort(), []);

  return (
    <div className="glass-card rounded-2xl p-6 mb-8" data-aos="fade-up">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 theme-text-primary">
          <Activity className="text-red-400 w-5 h-5" /> {isTamil ? 'நேரடி தேர்தல் நிலவரம்' : 'Live Counting Status'}
        </h3>
        <div className="flex flex-wrap gap-3">
          <select
            onChange={(e) => setFilters({ ...filters, district: e.target.value })}
            className="theme-input text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 ring-red-500"
          >
            <option value="">All Districts</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            onChange={(e) => setFilters({ ...filters, party: e.target.value })}
            className="theme-input text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 ring-red-500"
          >
            <option value="">All Parties</option>
            {PARTIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 theme-text-muted" />
            <input
              type="text"
              placeholder="Search constituency..."
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="theme-input text-xs rounded-lg pl-9 pr-4 py-2 outline-none focus:ring-1 ring-red-500 w-48"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead className="uppercase text-[10px] tracking-wider sticky top-0 z-10 glossy-header text-white">
            <tr>
              <th className="p-4 rounded-tl-xl border-b border-white/10">Constituency</th>
              <th className="p-4 border-b border-white/10">Candidate</th>
              <th className="p-4 border-b border-white/10">Party</th>
              <th className="p-4 text-right border-b border-white/10">Margin</th>
              <th className="p-4 text-center border-b border-white/10">Round</th>
              <th className="p-4 rounded-tr-xl border-b border-white/10">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500/10 theme-text-primary">
            {filteredConstituencies.map((c, i) => (
              <tr key={i} className="hover:bg-red-500/5 transition-all">
                <td className="p-4 font-semibold">{c.name}</td>
                <td className="p-4 theme-text-secondary">{c.candidate}</td>
                <td className="p-4">
                  <span className="flex items-center gap-2" style={{ color: PARTY_COLORS[c.party] }}>
                    <Circle className="w-2 h-2 fill-current" /> {c.party}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-green-500 font-bold">+{c.margin.toLocaleString()}</td>
                <td className="p-4 text-center theme-text-muted">{c.rounds}/18</td>
                <td className="p-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                    c.status === 'Leading' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    c.status === 'Won' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  )}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredConstituencies.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center theme-text-muted">No matching constituencies found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-center theme-text-muted">Showing {filteredConstituencies.length} of 234 constituencies</div>
    </div>
  );
}

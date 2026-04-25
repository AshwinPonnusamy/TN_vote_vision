import { Trophy } from 'lucide-react';

export default function Leaderboard({ constituencies }) {
  const topLeaders = [...constituencies].sort((a, b) => b.margin - a.margin).slice(0, 3);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 theme-text-primary">
        <Trophy className="text-yellow-400 w-5 h-5" /> Star Candidates
      </h3>
      <div className="space-y-3">
        {topLeaders.map((l, i) => (
          <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5 hover:border-yellow-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-bold theme-text-primary">{l.candidate}</div>
                <div className="text-[10px] uppercase theme-text-muted">{l.name} · {l.party}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-500 font-mono font-bold">+{l.margin}</div>
              <div className="text-[10px] uppercase theme-text-muted">Margin</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

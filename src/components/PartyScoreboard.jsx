import { Flag } from 'lucide-react';
import { PARTIES, PARTY_COLORS } from '../constants/data';

export default function PartyScoreboard({ liveSeats, voteShares }) {
  return (
    <div className="lg:col-span-2 glass-card rounded-2xl p-6" data-aos="fade-right">
      <div className="flex justify-between items-center flex-wrap mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 theme-text-primary">
          <Flag className="text-red-500 w-5 h-5" /> Party Scoreboard
        </h3>
        <div className="text-xs text-green-500 flex items-center gap-1 font-bold">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Auto-refresh every 3s
        </div>
      </div>
      <div className="space-y-6">
        {PARTIES.map(p => {
          const seats = liveSeats[p] || 0;
          const voteShare = voteShares[p]?.toFixed(1) || 0;
          const progress = (seats / 234) * 100;
          return (
            <div key={p}>
              <div className="flex justify-between text-sm font-semibold mb-2 theme-text-primary">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PARTY_COLORS[p] }} /> {p}
                </span>
                <span>{seats} Seats | Vote {voteShare}%</span>
              </div>
              <div className="w-full bg-gray-500/10 rounded-full h-2.5 overflow-hidden">
                <div className="progress-bar h-full" style={{ width: `${progress}%`, backgroundColor: PARTY_COLORS[p] }} />
              </div>
              <div className="flex justify-between text-[11px] mt-2 font-medium theme-text-muted">
                <span>LEADING: {Math.floor(seats * 0.4)}</span>
                <span>WON: {Math.floor(seats * 0.6)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-sm text-center p-3 rounded-xl border border-red-500/10 bg-red-500/5 theme-text-secondary">
        <span className="text-green-500 font-bold">🟢 Majority mark: 118</span> | Tracking leads across all 234 constituencies
      </div>
    </div>
  );
}

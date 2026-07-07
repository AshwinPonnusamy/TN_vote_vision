import PropTypes from 'prop-types';
import { AlertTriangle, Volume2, VolumeX } from 'lucide-react';

export default function TightContests({ constituencies, soundEnabled, setSoundEnabled }) {
  const tightFights = constituencies.filter(c => c.status === 'Tight Fight').slice(0, 4);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2 theme-text-primary">
          <AlertTriangle className="text-red-400 w-5 h-5" /> Tight Contests
        </h3>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-[10px] flex items-center gap-1.5 theme-btn px-2 py-1 rounded-lg"
        >
          {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          {soundEnabled ? 'Sound On' : 'Sound Muted'}
        </button>
      </div>
      <ul className="space-y-3">
        {tightFights.map((s, i) => (
          <li key={i} className="flex items-center gap-3 text-sm p-3 rounded-xl border border-red-500/10 bg-red-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-medium theme-text-primary">{s.name}</span>
            <span className="theme-text-muted">·</span>
            <span className="theme-text-secondary">{s.candidate} ({s.party})</span>
            <span className="ml-auto font-mono text-red-500 font-bold">{s.margin} v.</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

TightContests.propTypes = {
  constituencies: PropTypes.arrayOf(PropTypes.object).isRequired,
  soundEnabled: PropTypes.bool.isRequired,
  setSoundEnabled: PropTypes.func.isRequired,
};

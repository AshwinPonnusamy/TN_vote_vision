import { Circle } from 'lucide-react';

export default function NewsTicker() {
  return (
    <div className="border-y border-red-500/20 rounded-xl overflow-hidden mb-8 bg-red-500/5 backdrop-blur-sm">
      <div className="whitespace-nowrap animate-ticker py-4 flex gap-12 items-center">
        <span className="flex items-center gap-2 text-red-500 font-bold">
          <Circle className="w-2 h-2 fill-current animate-pulse" /> BREAKING NEWS
        </span>
        {['DMK GAINS EARLY LEAD IN CHENNAI SOUTH', 'TVK SURPRISE LEAD IN COIMBATORE NORTH',
          'AIADMK CLOSE FIGHT IN MADURAI EAST', 'HIGH VOTER TURNOUT 84.7% REPORTED',
          'COUNTING ACROSS 234 CONSTITUENCIES IN PROGRESS', 'DMK CROSSES 60+ SEATS IN EARLY TRENDS'
        ].map((text, i) => (
          <span key={i} className="text-sm font-mono theme-text-secondary">{text}</span>
        ))}
      </div>
    </div>
  );
}

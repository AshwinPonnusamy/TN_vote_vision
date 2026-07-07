import PropTypes from 'prop-types';
import { Circle } from 'lucide-react';
import { useMemo } from 'react';

export default function NewsTicker({ liveSeats }) {
  const topLeads = useMemo(() => {
    return Object.entries(liveSeats)
      .filter(([p, count]) => p !== 'Others' && count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([p, count]) => `${p} LEADING IN ${count} SEATS`);
  }, [liveSeats]);

  const defaultNews = [
    'HIGH VOTER TURNOUT REPORTED ACROSS ALL DISTRICTS',
    'COUNTING IN PROGRESS - STAY TUNED FOR LIVE UPDATES',
    'OFFICIAL ECI TRENDS BEING UPDATED EVERY 30 SECONDS',
    'SECURITY TIGHTENED AT ALL COUNTING CENTERS'
  ];

  const newsItems = topLeads.length > 0 ? [...topLeads, ...defaultNews] : defaultNews;

  return (
    <div className="border-y border-red-500/20 rounded-xl overflow-hidden mb-8 bg-red-500/5 backdrop-blur-sm">
      <div className="whitespace-nowrap animate-ticker py-4 flex gap-12 items-center">
        <span className="flex items-center gap-2 text-red-500 font-bold shrink-0">
          <Circle className="w-2 h-2 fill-current animate-pulse" /> LIVE UPDATES
        </span>
        {newsItems.map((text, i) => (
          <span key={i} className="text-sm font-mono theme-text-secondary uppercase tracking-wider">{text}</span>
        ))}
      </div>
    </div>
  );
}

NewsTicker.propTypes = {
  liveSeats: PropTypes.object.isRequired,
};

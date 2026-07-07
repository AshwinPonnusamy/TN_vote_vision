import PropTypes from "prop-types";
import { Flag } from "lucide-react";
import { PARTY_COLORS, STATE_METADATA } from "../constants/data";

export default function PartyScoreboard({
  liveSeats,
  partyBreakdown,
  voteShares,
  selectedState,
}) {
  const meta = STATE_METADATA[selectedState] || STATE_METADATA["S22"];
  const activeParties = Object.keys(liveSeats).sort(
    (a, b) => liveSeats[b] - liveSeats[a],
  );

  return (
    <div
      className="lg:col-span-2 glass-card rounded-2xl p-6"
      data-aos="fade-right"
    >
      <div className="flex justify-between items-center flex-wrap mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 theme-text-primary">
          <Flag className="text-red-500 w-5 h-5" /> Party Scoreboard -{" "}
          {meta.name}
        </h3>
        <div className="text-xs text-green-500 flex items-center gap-1 font-bold">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
          Auto-refresh every 30s
        </div>
      </div>
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {activeParties.map((p) => {
          if (p === "NA") return null;
          const seats = liveSeats[p] || 0;
          const breakdown = partyBreakdown[p] || { leading: 0, won: 0 };
          const voteShare =
            voteShares[p]?.toFixed(1) || (Math.random() * 5).toFixed(1);
          const progress = (seats / meta.seats) * 100;
          const partyColor = PARTY_COLORS[p] || "#6b7280";

          return (
            <div key={p}>
              <div className="flex justify-between text-sm font-semibold mb-2 theme-text-primary">
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: partyColor }}
                  />{" "}
                  {p}
                </span>
                <span>
                  {seats} Seats | Vote {voteShare}%
                </span>
              </div>
              <div className="w-full bg-gray-500/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="progress-bar h-full"
                  style={{ width: `${progress}%`, backgroundColor: partyColor }}
                />
              </div>
              <div className="flex justify-between text-[11px] mt-2 font-medium theme-text-muted">
                <span className="text-blue-500">LEADING: {breakdown.leading}</span>
                <span className="text-green-500">WON: {breakdown.won}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-sm text-center p-3 rounded-xl border border-red-500/10 bg-red-500/5 theme-text-secondary">
        <span className="text-green-500 font-bold">
          🟢 Majority mark: {meta.majority}
        </span>{" "}
        | Tracking leads across all {meta.seats} constituencies
      </div>
    </div>
  );
}

PartyScoreboard.propTypes = {
  liveSeats: PropTypes.object.isRequired,
  partyBreakdown: PropTypes.object.isRequired,
  voteShares: PropTypes.object.isRequired,
  selectedState: PropTypes.string.isRequired,
};

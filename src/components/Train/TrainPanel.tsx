import useGameStore from '@/store/useGameStore';
import CarriageCard from './CarriageCard';
import { getTrainLoadPercentage, getTotalLoad, getTotalCapacity } from '@/engine/loadingSystem';
import { getSponsorById, getSponsorLiveryGradient } from '@/engine/sponsorshipSystem';
import { Train as TrainIcon, Award } from 'lucide-react';

export default function TrainPanel() {
  const { train, dispatchTrain, gamePhase, isAnimating, moves, currentSponsorId, sponsorshipAccepted } = useGameStore();

  const loadPercent = getTrainLoadPercentage(train);
  const totalLoad = getTotalLoad(train);
  const totalCapacity = getTotalCapacity(train);
  const canDispatch = totalLoad > 0 && gamePhase === 'playing' && !isAnimating;

  const sponsor = sponsorshipAccepted && currentSponsorId ? getSponsorById(currentSponsorId) : null;

  const panelBg = sponsor
    ? { background: getSponsorLiveryGradient(sponsor) + '15', borderColor: sponsor.primaryColor }
    : { background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)', borderColor: '#fcd34d' };

  return (
    <div
      className="rounded-2xl p-4 shadow-lg border-2 transition-all duration-500"
      style={{
        background: panelBg.background,
        borderColor: panelBg.borderColor,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <TrainIcon className="w-6 h-6" style={{ color: sponsor?.primaryColor || '#b45309' }} />
        <h3 className="text-lg font-bold" style={{ color: sponsor?.accentColor || '#78350f' }}>
          {train.name}
        </h3>
        {sponsor && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ background: sponsor.primaryColor }}>
            <Award className="w-3 h-3" />
            <span>{sponsor.logo} {sponsor.name}</span>
          </div>
        )}
        <span className="text-sm ml-auto" style={{ color: sponsor?.accentColor || '#d97706' }}>
          {totalLoad}/{totalCapacity} ({Math.round(loadPercent)}%)
        </span>
      </div>

      <div className="relative overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {train.carriages.map((carriage) => (
            <CarriageCard key={carriage.id} carriage={carriage} sponsor={sponsor} />
          ))}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-2 rounded-full"
          style={{
            background: sponsor
              ? `linear-gradient(to right, ${sponsor.primaryColor}, ${sponsor.accentColor}, ${sponsor.primaryColor})`
              : 'linear-gradient(to right, #d97706, #92400e, #d97706)',
          }}
        />
      </div>

      {sponsor && sponsor.conditions.length > 0 && (
        <div className="mt-3 p-2 rounded-lg bg-white/50">
          <p className="text-xs font-medium mb-1" style={{ color: sponsor.accentColor }}>
            📋 本次赞助条件：
          </p>
          <div className="flex flex-wrap gap-1">
            {sponsor.conditions.map((cond, i) => (
              <span
                key={i}
                className="inline-flex items-center text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: sponsor.primaryColor + '20',
                  color: sponsor.accentColor,
                }}
              >
                {cond.description}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={dispatchTrain}
        disabled={!canDispatch}
        className={`w-full mt-4 py-3 px-6 rounded-xl font-bold text-white text-lg
          transition-all duration-200 transform
          ${canDispatch
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 cursor-not-allowed'
          }`}
      >
        🚂 发车！
      </button>

      {moves <= 0 && gamePhase === 'playing' && (
        <p className="text-center text-red-500 text-sm mt-2 font-medium">
          步数已用完，请发车结束本局
        </p>
      )}
    </div>
  );
}

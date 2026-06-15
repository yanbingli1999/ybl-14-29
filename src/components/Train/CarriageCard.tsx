import { Carriage, Sponsor } from '@/types';
import { CANDY_CONFIG } from '@/data/config';
import { getLoadPercentage } from '@/engine/loadingSystem';
import { getSponsorLiveryGradient } from '@/engine/sponsorshipSystem';

interface CarriageCardProps {
  carriage: Carriage;
  sponsor?: Sponsor | null;
}

export default function CarriageCard({ carriage, sponsor }: CarriageCardProps) {
  const config = CANDY_CONFIG[carriage.candyType];
  const loadPercent = getLoadPercentage(carriage);
  const isFull = loadPercent >= 100;

  const baseBg = sponsor
    ? getSponsorLiveryGradient(sponsor)
    : 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)';

  const borderColor = sponsor
    ? sponsor.accentColor
    : config.color + '40';

  return (
    <div
      className="relative flex flex-col items-center p-2 rounded-xl shadow-md border-2 min-w-[70px] sm:min-w-[80px] transition-all duration-300"
      style={{
        background: baseBg,
        borderColor: borderColor,
        borderWidth: sponsor ? '3px' : '2px',
      }}
    >
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
        style={{ backgroundColor: sponsor ? sponsor.primaryColor : config.color }}
      />
      <div
        className="absolute -top-1 left-1/4 -translate-x-1/2 w-3 h-3 rounded-full"
        style={{ backgroundColor: sponsor ? sponsor.secondaryColor : config.color }}
      />
      <div
        className="absolute -top-1 right-1/4 translate-x-1/2 w-3 h-3 rounded-full"
        style={{ backgroundColor: sponsor ? sponsor.accentColor : config.color }}
      />

      {sponsor && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">
          {sponsor.logo.split('')[1]}
        </div>
      )}

      <div className="text-2xl sm:text-3xl mb-1">{config.emoji}</div>

      <div className={`text-xs font-bold mb-1 ${sponsor ? 'text-white drop-shadow-md' : 'text-gray-700'}`}>
        {carriage.currentLoad}/{carriage.capacity}
      </div>

      <div className="w-full h-2 bg-gray-300/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(loadPercent, 100)}%`,
            backgroundColor: sponsor ? sponsor.primaryColor : config.color,
            boxShadow: isFull ? `0 0 8px ${sponsor ? sponsor.primaryColor : config.color}` : 'none',
          }}
        />
      </div>

      {isFull && (
        <div className="absolute -top-2 -right-2 text-lg animate-bounce">✨</div>
      )}

      {sponsor && (
        <div className="absolute -bottom-1 right-0 text-xs opacity-70">
          {sponsor.logo.split('')[0]}
        </div>
      )}
    </div>
  );
}

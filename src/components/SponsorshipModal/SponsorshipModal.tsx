import { useState } from 'react';
import useGameStore from '@/store/useGameStore';
import { getAvailableSponsors, getSponsorLiveryGradient } from '@/engine/sponsorshipSystem';
import { SPONSORS } from '@/data/config';
import { Sponsor, SponsorId } from '@/types';
import { Coins, Star, AlertTriangle, Check, X, ChevronRight } from 'lucide-react';

export default function SponsorshipModal() {
  const { gamePhase, currentSponsorId, selectSponsor, acceptSponsorship, declineSponsorship } = useGameStore();
  const [selectedForDetail, setSelectedForDetail] = useState<Sponsor | null>(null);

  if (gamePhase !== 'sponsorship') return null;

  const sponsors = getAvailableSponsors();

  const handleSelect = (sponsorId: SponsorId) => {
    selectSponsor(sponsorId === currentSponsorId ? null : sponsorId);
    setSelectedForDetail(null);
  };

  const handleAccept = () => {
    if (currentSponsorId) {
      acceptSponsorship();
    }
  };

  const renderConditionIcon = (type: string) => {
    switch (type) {
      case 'min-load-per-type':
        return '📦';
      case 'max-mismatch-types':
        return '⚠️';
      case 'min-match-rate':
        return '🎯';
      case 'forbidden-candy':
        return '🚫';
      case 'min-total-load':
        return '🚂';
      default:
        return '📋';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden transform animate-fade-in">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-center">
          <div className="text-5xl mb-3">🤝</div>
          <h2 className="text-2xl font-bold text-white">选择品牌赞助商</h2>
          <p className="text-white/80 text-sm mt-1">
            接受赞助可获得预付款和专属涂装，但需满足装载条件
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                onClick={() => handleSelect(sponsor.id)}
                className={`relative cursor-pointer rounded-2xl p-4 border-3 transition-all transform hover:scale-102 ${
                  currentSponsorId === sponsor.id
                    ? 'border-blue-500 shadow-lg scale-102'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  borderWidth: '3px',
                  background: currentSponsorId === sponsor.id
                    ? getSponsorLiveryGradient(sponsor) + '20'
                    : 'white',
                }}
              >
                {currentSponsorId === sponsor.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{sponsor.logo}</div>
                  <h3 className="font-bold text-lg text-gray-800">{sponsor.name}</h3>
                </div>

                <p className="text-xs text-gray-600 text-center mb-3 h-10">
                  {sponsor.description}
                </p>

                <div className="flex justify-center gap-4 mb-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold">
                      <Coins className="w-4 h-4" />
                      +{sponsor.advancePayment}
                    </div>
                    <div className="text-xs text-gray-500">预付款</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-red-500 font-bold">
                      <Star className="w-4 h-4" />
                      -{sponsor.reputationPenalty}
                    </div>
                    <div className="text-xs text-gray-500">违约信誉</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedForDetail(selectedForDetail?.id === sponsor.id ? null : sponsor);
                    }}
                    className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    查看条件
                    <ChevronRight className={`w-3 h-3 transition-transform ${selectedForDetail?.id === sponsor.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {selectedForDetail?.id === sponsor.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">装载条件：</p>
                    <div className="space-y-2">
                      {sponsor.conditions.map((condition, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="mt-0.5">{renderConditionIcon(condition.type)}</span>
                          <span>{condition.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {currentSponsorId && (
            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">赞助协议</p>
                  <p className="text-xs text-blue-600 mt-1">
                    接受赞助后，将立即获得 {SPONSORS.find(s => s.id === currentSponsorId)?.advancePayment} 金币预付款。
                    完成本局后将根据条件履行情况结算，违约需退还预付款并损失信誉。
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={declineSponsorship}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              跳过赞助
            </button>
            <button
              onClick={handleAccept}
              disabled={!currentSponsorId}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 ${
                currentSponsorId
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              接受赞助
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

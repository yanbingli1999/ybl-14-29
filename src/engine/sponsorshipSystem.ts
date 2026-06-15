import {
  Sponsor,
  SponsorId,
  SponsorshipCondition,
  SponsorshipResult,
  Train,
  DispatchResult,
} from '@/types';
import { SPONSORS } from '@/data/config';
import { getCandyLoad, getTotalLoad } from './loadingSystem';

export function getSponsorById(id: SponsorId): Sponsor | undefined {
  return SPONSORS.find(s => s.id === id);
}

export function getAvailableSponsors(): Sponsor[] {
  return [...SPONSORS];
}

function checkMinLoadPerType(
  condition: SponsorshipCondition,
  train: Train
): boolean {
  if (!condition.candyType) return false;
  const loaded = getCandyLoad(train, condition.candyType);
  return loaded >= condition.value;
}

function checkMaxMismatchTypes(
  condition: SponsorshipCondition,
  dispatchResult: DispatchResult
): boolean {
  return dispatchResult.mismatches.length <= condition.value;
}

function checkMinMatchRate(
  condition: SponsorshipCondition,
  dispatchResult: DispatchResult
): boolean {
  return dispatchResult.matchRate >= condition.value;
}

function checkForbiddenCandy(
  condition: SponsorshipCondition,
  train: Train
): boolean {
  if (!condition.candyType) return false;
  const loaded = getCandyLoad(train, condition.candyType);
  return loaded <= condition.value;
}

function checkMinTotalLoad(
  condition: SponsorshipCondition,
  train: Train
): boolean {
  const totalLoad = getTotalLoad(train);
  return totalLoad >= condition.value;
}

export function checkCondition(
  condition: SponsorshipCondition,
  train: Train,
  dispatchResult: DispatchResult
): boolean {
  switch (condition.type) {
    case 'min-load-per-type':
      return checkMinLoadPerType(condition, train);
    case 'max-mismatch-types':
      return checkMaxMismatchTypes(condition, dispatchResult);
    case 'min-match-rate':
      return checkMinMatchRate(condition, dispatchResult);
    case 'forbidden-candy':
      return checkForbiddenCandy(condition, train);
    case 'min-total-load':
      return checkMinTotalLoad(condition, train);
    default:
      return false;
  }
}

export function evaluateSponsorship(
  sponsorId: SponsorId,
  train: Train,
  dispatchResult: DispatchResult
): SponsorshipResult {
  const sponsor = getSponsorById(sponsorId);

  if (!sponsor) {
    return {
      sponsorId,
      conditionsMet: true,
      violatedConditions: [],
      fulfilledConditions: [],
      refundAmount: 0,
      reputationLoss: 0,
    };
  }

  const violatedConditions: SponsorshipCondition[] = [];
  const fulfilledConditions: SponsorshipCondition[] = [];

  for (const condition of sponsor.conditions) {
    if (checkCondition(condition, train, dispatchResult)) {
      fulfilledConditions.push(condition);
    } else {
      violatedConditions.push(condition);
    }
  }

  const conditionsMet = violatedConditions.length === 0;

  return {
    sponsorId,
    conditionsMet,
    violatedConditions,
    fulfilledConditions,
    refundAmount: conditionsMet ? 0 : sponsor.advancePayment,
    reputationLoss: conditionsMet ? 0 : sponsor.reputationPenalty,
  };
}

export function getSponsorLiveryGradient(sponsor: Sponsor): string {
  return `linear-gradient(135deg, ${sponsor.primaryColor}, ${sponsor.secondaryColor})`;
}

export function getSponsorName(sponsorId: SponsorId | null): string {
  if (!sponsorId) return '';
  const sponsor = getSponsorById(sponsorId);
  return sponsor?.name || '';
}

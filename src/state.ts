import type { GameState, Player, Card, ProcessEcho, PlayerId } from './types';
import { BASE_MAX_HIT_POINTS, MAX_ENERGY, STARTING_SUPPLY } from './constants';
import { CARD_LIBRARY } from './data/cardLibrary';

let _unitIdCounter: number = 1;
export function nextUnitId(): string { return 'u' + _unitIdCounter++; }

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createEmptyProcessEcho(): ProcessEcho {
  return {
    X: null,
    1: null,
    2: null,
    3: null
  };
}

export function createStarterDeck(): Card[] {
  const deck: Card[] = [
    { cardId: CARD_LIBRARY.PAWN_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.PAWN_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SUPPORT_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SUPPORT_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.TANK_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.TANK_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.HARVEST_DATA.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SHIELDING.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SYSTEM_SHOCK.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SHIMMERING_CLOAK.id, producedAt: 'Base' },
  ];
  return shuffle(deck);
}

export function createPlayer(playerId: PlayerId): Player {
  return {
    id: playerId,
    baseHitPoints: BASE_MAX_HIT_POINTS,
    baseMaxHitPoints: BASE_MAX_HIT_POINTS,
    baseDestroyed: false,
    maxEnergy: MAX_ENERGY,
    energy: MAX_ENERGY,
    supply: STARTING_SUPPLY,
    deck: createStarterDeck(),
    hand: [],
    discard: [],
    processEcho: createEmptyProcessEcho(),
    processEchoPlayedThisTurn: false,
    buildings: [],
    openingHandDrawn: false,
    buildingsPlayedThisTurn: 0,
    turnCounter: 0
  };
}

export const state: GameState = {
  currentPlayerId: 'A',
  winner: null,
  mode: 'idle',
  hoverSquareKey: null,
  selectedCardHandIndex: null,
  selectedUnitId: null,
  coreMagnetPreviewUnitId: null,
  coreMagnetBulwarkTargetSquareKey: null,
  repairTargetingCasterId: null,
  overloadTargetingBuildingId: null,
  systemShockCasterId: null,
  ghostbladeTeleportCasterId: null,
  specialistEmpCasterId: null,
  pendingSystemShockLevel: null,
  pendingSystemShockSourceSlot: null,
  pendingShieldingLevel: null,
  pendingShieldingSourceSlot: null,
  pendingShimmeringLevel: null,
  pendingShimmeringSourceSlot: null,
  pendingShimmeringSquares: [],
  placingBuildingType: null,
  pendingArmorySquareKey: null,
  pendingArmoryStatusId: null,
  pendingArmoryDraftStatusIds: [],
  pendingReplicatorSquareKey: null,
  pendingReplicatorStatusId: null,
  pendingWorkshopSquareKey: null,
  pendingWorkshopStatusId: null,
  pendingDatacenterSquareKey: null,
  pendingDatacenterStatusId: null,
  pendingGearStationSquareKey: null,
  pendingGearStationStatusId: null,
  pendingAssemblyLineSquareKey: null,
  pendingAssemblyLineStatusId: null,
  pendingUpgradeBuildingId: null,
  pendingUpgradeStatusId: null,
  pendingUpgradeStatusOptions: [],
  pendingFoundationTargetBuildingId: null,
  players: {
    A: createPlayer('A'),
    B: createPlayer('B')
  },
  units: [],
  shimmeringCloaks: []
};

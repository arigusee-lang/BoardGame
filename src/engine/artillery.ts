import type { Unit, StatusId } from '../types';
import { BOARD_WIDTH, BOARD_LENGTH } from '../constants.ts';
import { DRONE_STATUS_LIBRARY } from '../data/statusLibrary.ts';
import {
  toSquareKey,
  fromSquareKey,
  getDistance
} from '../utils.ts';
import {
  unitHasStatus,
  getUnitCurrentAttackDamage
} from './unitStats.ts';

// ---------------------------------------------------------------------------
// Artillery area helpers
// ---------------------------------------------------------------------------

export function getArtilleryAreaSquareKeys(squareKey: string): string[] {
  const origin = fromSquareKey(squareKey);
  const anchorX = Math.max(0, Math.min(BOARD_WIDTH - 2, origin.x));
  const anchorZ = Math.max(0, Math.min(BOARD_LENGTH - 2, origin.z));
  return [
    toSquareKey(anchorX, anchorZ),
    toSquareKey(anchorX + 1, anchorZ),
    toSquareKey(anchorX, anchorZ + 1),
    toSquareKey(anchorX + 1, anchorZ + 1)
  ];
}

// ---------------------------------------------------------------------------
// Gauss cannon helpers
// ---------------------------------------------------------------------------

interface GaussDirection {
  stepX: number;
  stepZ: number;
}

export function getGaussDirectionFromTargetSquare(artillery: Unit | null | undefined, squareKey: string | null | undefined): GaussDirection | null {
  if (!artillery || !squareKey) {
    return null;
  }
  const target = fromSquareKey(squareKey);
  const dx = target.x - artillery.x;
  const dz = target.z - artillery.z;
  if (dx === 0 && dz === 0) {
    return null;
  }
  const absDx = Math.abs(dx);
  const absDz = Math.abs(dz);
  const chebyshev = Math.max(absDx, absDz);
  const maxSquares = getGaussLineMaxSquares(artillery);
  if (chebyshev < 1 || chebyshev > maxSquares) {
    return null;
  }
  const aligned = dx === 0 || dz === 0 || absDx === absDz;
  if (!aligned) {
    return null;
  }
  return {
    stepX: Math.sign(dx),
    stepZ: Math.sign(dz)
  };
}

export function getGaussLineMaxSquares(artillery: Unit | null | undefined): number {
  if (!artillery) {
    return 5;
  }
  return unitHasStatus(artillery, DRONE_STATUS_LIBRARY.DRONES.id) ? 6 : 5;
}

export function getGaussLineSquareKeys(artillery: Unit, stepX: number, stepZ: number): string[] {
  if (!artillery || (stepX === 0 && stepZ === 0)) {
    return [];
  }
  const keys: string[] = [];
  const maxSquares = getGaussLineMaxSquares(artillery);
  for (let i = 1; i <= maxSquares; i += 1) {
    const x = artillery.x + stepX * i;
    const z = artillery.z + stepZ * i;
    if (x < 0 || x >= BOARD_WIDTH || z < 0 || z >= BOARD_LENGTH) {
      break;
    }
    keys.push(toSquareKey(x, z));
  }
  return keys;
}

export function getGaussLineSquareKeysFromTarget(artillery: Unit, squareKey: string): string[] {
  const direction = getGaussDirectionFromTargetSquare(artillery, squareKey);
  if (!direction) {
    return [];
  }
  return getGaussLineSquareKeys(artillery, direction.stepX, direction.stepZ);
}

// ---------------------------------------------------------------------------
// Ballistic status helpers
// ---------------------------------------------------------------------------

export function hasBallisticStatus(unit: Unit | null | undefined): boolean {
  return !!unit && unit.unitTypeId === 'ARTILLERY_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.BALLISTIC.id);
}

export function getArtilleryBallisticDamageAgainstUnit(artillery: Unit): number {
  const bonus = Math.max(0, getUnitCurrentAttackDamage(artillery) - (artillery.baseAttackDamage ?? 0));
  return Math.max(0, 10 + bonus);
}

export function getArtilleryBallisticDamageAgainstBase(artillery: Unit): number {
  const bonus = Math.max(0, getUnitCurrentAttackDamage(artillery) - (artillery.baseAttackDamage ?? 0));
  return Math.max(0, 16 + bonus);
}

// ---------------------------------------------------------------------------
// Distance helpers
// ---------------------------------------------------------------------------

export function getMinDistanceToAreaFromUnit(unitX: number, unitZ: number, areaKeys: string[]): number {
  let minDistance = Number.POSITIVE_INFINITY;
  for (const squareKey of areaKeys) {
    const square = fromSquareKey(squareKey);
    const distance = getDistance(unitX, unitZ, square.x, square.z);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  return minDistance;
}

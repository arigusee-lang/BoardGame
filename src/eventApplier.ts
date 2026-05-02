/**
 * Client-side event applier.
 *
 * The pure engine emits typed GameEvents into a shared buffer (see
 * src/shared/events.ts). This module subscribes to those events and runs the
 * real DOM / Three.js / audio side-effects in the browser.
 *
 * Future: when the multiplayer server is added, the server-side code will
 * apply events differently (no DOM, just broadcast over WebSocket).
 */

import * as THREE from 'three';
import type { GameEvent } from './shared/events.ts';
import { addLog as realAddLog } from './ui/log.ts';
import { renderUI as realRenderUI } from './ui/renderUI.ts';
import { syncBoardVisualState as realSyncBoardVisualState } from './three/boardRenderer.ts';
import {
  playRifleShot as realPlayRifleShot,
  playHitEffect as realPlayHitEffect,
  playExplosionAt as realPlayExplosionAt,
  playRepairCasterAnimation as realPlayRepairCasterAnimation,
  playRepairTargetAnimation as realPlayRepairTargetAnimation,
  playSupplyHarvestCoins as realPlaySupplyHarvestCoins,
  flashSupplyHarvested as realFlashSupplyHarvested,
} from './three/effects.ts';

function toVec3(p: { x: number; y: number; z: number }): THREE.Vector3 {
  return new THREE.Vector3(p.x, p.y, p.z);
}

/**
 * Apply a single event to the browser DOM/Three.js. Order-preserving when
 * called over a buffer drained from `flushEvents()`.
 */
export function applyEvent(event: GameEvent): void {
  switch (event.type) {
    case 'LOG':
      realAddLog(event.message);
      break;
    case 'BOARD_SYNC':
      realSyncBoardVisualState();
      break;
    case 'UI_REFRESH':
      realRenderUI();
      break;
    case 'EFFECT_RIFLE_SHOT':
      realPlayRifleShot(event.attackerId, toVec3(event.targetPos));
      break;
    case 'EFFECT_HIT':
      realPlayHitEffect(event.unitId);
      break;
    case 'EFFECT_EXPLOSION':
      realPlayExplosionAt(toVec3(event.pos), event.options);
      break;
    case 'EFFECT_REPAIR_CASTER':
      realPlayRepairCasterAnimation(event.casterId);
      break;
    case 'EFFECT_REPAIR_TARGET':
      realPlayRepairTargetAnimation(event.targetId);
      break;
    case 'EFFECT_SUPPLY_HARVEST_COINS':
      realPlaySupplyHarvestCoins(event.unitId);
      break;
    case 'EFFECT_SUPPLY_HARVEST_FLASH':
      realFlashSupplyHarvested();
      break;
    case 'BASE_DESTROYED':
      // For now, the visual base teardown still happens directly in
      // engine/combat.ts:destroyBase (which mutates the THREE.js scene).
      // Stage B/C will move that visual cleanup here. This case currently
      // serves as a marker only.
      break;
  }
}

export function applyEvents(events: GameEvent[]): void {
  for (const event of events) {
    applyEvent(event);
  }
}

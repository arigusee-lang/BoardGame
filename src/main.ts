import './style.css';

// --- Bridge: wire render callbacks before anything else ---
import { registerRenderUI, registerSyncBoardVisualState } from './bridge.ts';
import { renderUI, getPlayerMaxEnergy, refreshPlayerMaxEnergy } from './ui/renderUI.ts';
import { syncBoardVisualState, initBoard, initAxisLabels } from './three/boardRenderer.ts';
import type { Unit } from './types';

registerRenderUI(renderUI);
registerSyncBoardVisualState(syncBoardVisualState);

// --- DOM setup ---
import { initDomSetup, boardEl, endTurnBtn } from './ui/domSetup.ts';

initDomSetup();

// --- Three.js init ---
import { initThree, renderer, onResize } from './three/sceneSetup.ts';
import { animate } from './three/animation.ts';
import { preloadModels } from './three/modelLoader.ts';

// --- Dev-only: model export tool (registers window.__exportModels) ---
import './three/modelExporter.ts';

// --- Engine dep wiring ---
import { registerCombatDeps } from './engine/combat.ts';
import { registerTurnManagerDeps } from './engine/turnManager.ts';
import { registerAbilityDeps } from './engine/abilities.ts';
import { registerBuildingDeps } from './engine/buildings.ts';
import { registerInputHandlerDeps } from './input/inputHandler.ts';
import { registerInputTargetingDeps } from './input/inputTargeting.ts';

import { removeUnitShield, applyShieldToUnit, consumeSystemShockFollowUp } from './engine/unitStats.ts';
import { addShimmeringCloak } from './engine/unitStats.ts';
import { getUnitWorldPosition, playRifleShot, playHitEffect, playExplosionAt, playRepairCasterAnimation, playRepairTargetAnimation, playSupplyHarvestCoins, flashSupplyHarvested } from './three/effects.ts';
import { drawCards, startGame, applyProcessEchoPlayResult } from './engine/turnManager.ts';
import { endTurn } from './engine/turnManager.ts';

registerCombatDeps({
  removeUnitShield,
  refreshPlayerMaxEnergy,
  getUnitWorldPosition,
  playRifleShot,
  playHitEffect,
  playExplosionAt
});

registerTurnManagerDeps({
  refreshPlayerMaxEnergy,
  playSupplyHarvestCoins,
  flashSupplyHarvested
});

registerAbilityDeps({
  playRepairCasterAnimation,
  playRepairTargetAnimation,
  applyShieldToUnit,
  addShimmeringCloak,
  applyProcessEchoPlayResult
});

registerBuildingDeps({
  drawCards,
  refreshPlayerMaxEnergy,
  getPlayerMaxEnergy
});

registerInputHandlerDeps({
  consumeSystemShockFollowUp
});

registerInputTargetingDeps({
  getPlayerMaxEnergy
});

// --- Input handlers ---
import { onPointerDown, onPointerMove, onKeyDown, onKeyUp } from './input/inputHandler.ts';

// --- Init & start ---
async function init() {
  initAxisLabels();
  initThree();

  // Preload .glb models (missing files are silently skipped → procedural fallback)
  await preloadModels();

  initBoard();

  // Wire up event listeners (not in initThree to avoid circular deps)
  boardEl.addEventListener('pointerdown', onPointerDown);
  boardEl.addEventListener('pointermove', onPointerMove);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onResize);
  endTurnBtn.addEventListener('click', () => endTurn());
  renderer.setAnimationLoop(animate);

  startGame();
}

init();

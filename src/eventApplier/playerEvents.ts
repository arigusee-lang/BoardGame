/**
 * Player-resource events: base HP, energy, supply.
 */

import type { EventHandler } from '../shared/events.ts';
import { state } from '../state.ts';

export const playerEventHandlers = {
  BASE_DAMAGED: ((e) => {
    const player = state.players[e.player];
    if (player) player.baseHitPoints = e.newHp;
  }) satisfies EventHandler<'BASE_DAMAGED'>,

  ENERGY_CHANGED: ((e) => {
    const player = state.players[e.player];
    if (player) player.energy = e.newEnergy;
  }) satisfies EventHandler<'ENERGY_CHANGED'>,

  MAX_ENERGY_CHANGED: ((e) => {
    const player = state.players[e.player];
    if (player) player.maxEnergy = e.newMaxEnergy;
  }) satisfies EventHandler<'MAX_ENERGY_CHANGED'>,

  SUPPLY_CHANGED: ((e) => {
    const player = state.players[e.player];
    if (player) player.supply = e.newSupply;
  }) satisfies EventHandler<'SUPPLY_CHANGED'>,
};

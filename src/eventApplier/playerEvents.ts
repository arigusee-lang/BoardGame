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
};

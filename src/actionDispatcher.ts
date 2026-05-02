/**
 * Client action dispatcher.
 *
 * Single-player flow:
 *   input handler → dispatch(action) → applyAction(action) → events emitted
 *   → microtask drains buffer → eventApplier runs side-effects (DOM, Three.js)
 *
 * Future multiplayer flow (Stage C):
 *   input handler → dispatch(action) → network.send({ action })
 *   → server validates + applies → broadcasts events → eventApplier runs them
 *
 * This module hides whether dispatch is local-synchronous or remote-async
 * from the input layer.
 */

import type { Action } from './shared/actions.ts';
import { applyAction } from './shared/reducer.ts';
import * as net from './network/index.ts';

/**
 * Dispatch a player action.
 *
 * In Stage A this calls the local reducer synchronously. The events the
 * reducer returns are already drained from the buffer; nothing else needs
 * to consume them because the buffer is also auto-flushed via setEventSink
 * (see src/eventApplier.ts).
 *
 * Returns true if the action was accepted, false on rejection (e.g. action
 * not yet wired through the reducer).
 */
export function dispatch(action: Action): boolean {
  // Multiplayer mode: forward the intent to the server. The server runs the
  // reducer and broadcasts events + a fresh state snapshot; the network
  // module wires those into the eventApplier and a state-replace handler.
  // We do NOT also run the action locally — that would cause double-mutation
  // when the snapshot comes back.
  if (net.getIdentity() !== null && net.isConnected()) {
    return net.sendAction(action);
  }

  // Single-player mode (no room). Run the reducer locally; events emitted
  // during the call are picked up by the microtask sink (eventApplier).
  const result = applyAction(action);
  if (!result.ok) {
    console.warn('[actionDispatcher]', result.error);
    return false;
  }
  return true;
}

export let renderUI: () => void = () => {};
export let syncBoardVisualState: () => void = () => {};

export function registerRenderUI(fn: () => void): void { renderUI = fn; }
export function registerSyncBoardVisualState(fn: () => void): void { syncBoardVisualState = fn; }

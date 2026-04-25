import { logEl } from './domSetup.ts';

export function addLog(message: string): void {
  const row = document.createElement('div');
  row.className = 'log-row';
  row.textContent = message;
  logEl.prepend(row);

  while (logEl.children.length > 8) {
    logEl.removeChild(logEl.lastChild!);
  }
}

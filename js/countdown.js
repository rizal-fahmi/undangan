// ===== COUNTDOWN TIMER =====
import { CONFIG } from './config.js';

const target = CONFIG.targetDate.getTime();

const ids = { days:'days', hours:'hours', minutes:'minutes', seconds:'seconds' };

function _set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(val).padStart(2, '0');
}

export function startCountdown() {
  const tick = () => {
    const dist = target - Date.now();
    if (dist <= 0) {
      Object.values(ids).forEach(id => _set(id, '00'));
      return;
    }
    _set(ids.days,    Math.floor(dist / 86_400_000));
    _set(ids.hours,   Math.floor((dist % 86_400_000) / 3_600_000));
    _set(ids.minutes, Math.floor((dist % 3_600_000)  / 60_000));
    _set(ids.seconds, Math.floor((dist % 60_000)     / 1_000));
  };
  tick();
  setInterval(tick, 1000);
}

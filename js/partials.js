// ===== PARTIALS LOADER =====
// Fetches HTML partial files and injects them into their containers.

const MAIN_PARTIALS = [
  'header',
  'ayat',
  'couple',
  'events',
  'countdown',
  'gift',
  'wishes',
  'footer',
];

/** Fetch a partial HTML file by name from the partials/ directory. */
async function fetchPartial(name) {
  const res = await fetch(`partials/${name}.html`);
  if (!res.ok) throw new Error(`Failed to load partial: ${name} (${res.status})`);
  return res.text();
}

/**
 * Load and inject all partials into the DOM.
 * Cover  → #coverScreen (innerHTML replace)
 * Others → appended as child nodes into #mainContent
 */
export async function loadPartials() {
  // ── Cover partial ──
  const coverHtml = await fetchPartial('cover');
  const coverEl = document.getElementById('coverScreen');
  if (coverEl) {
    coverEl.innerHTML = coverHtml;
  }

  // ── Main content partials ──
  const mainEl = document.getElementById('mainContent');
  if (!mainEl) return;

  // Load all in parallel for speed
  const htmlParts = await Promise.all(MAIN_PARTIALS.map(fetchPartial));

  for (const html of htmlParts) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const node = tpl.content.firstElementChild;
    if (node) {
      mainEl.appendChild(node);
    } else {
      // Fallback: raw wrapper
      const div = document.createElement('div');
      div.innerHTML = html;
      mainEl.appendChild(div);
    }
  }
}

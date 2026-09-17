import { reactive } from 'vue';
import vuetify from '@/plugins/vuetify';

// Keep this key in sync with the tiny inline anti-flash script in
// public/index.html — that script reads the same key directly (before
// Vue/webpack even load) so a returning light-mode visitor doesn't see a
// flash of the dark default on first paint.
const STORAGE_KEY = 'portfolio-theme';

// Dark is the default and matches the site's original (pre-light-mode)
// look exactly. A visitor only ever sees light mode if they explicitly
// pick it — this never follows the OS/browser prefers-color-scheme, so
// existing visitors' experience is unaffected either way.
const state = reactive({
  theme: 'dark',
});

function readStoredTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    // localStorage can throw (private browsing, blocked site data) — fall
    // back to the default rather than letting theme init crash the app.
    return null;
  }
}

function writeStoredTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    // Theme still applies for this session even if it can't persist.
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  vuetify.theme.global.name.value = theme === 'light' ? 'portfolioLight' : 'portfolioDark';

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f9f6f0' : '#1c1d20');
}

function initTheme() {
  state.theme = readStoredTheme() === 'light' ? 'light' : 'dark';
  applyTheme(state.theme);
  return state.theme;
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
  writeStoredTheme(state.theme);
  return state.theme;
}

export { state as themeState, initTheme, toggleTheme };

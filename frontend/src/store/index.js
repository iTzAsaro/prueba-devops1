// ============================================================
// VI CITY — Store global con persistencia LocalStorage
// ============================================================

const LS_KEY = 'vicity_state_v1';

const defaultState = {
  selection: {
    platformId: 'ps5',
    editionId: 'deluxe',
    format: 'digital',
    extras: [],
  },
  orders: [],
  user: { email: null },
};

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(defaultState), ...parsed,
      selection: { ...defaultState.selection, ...(parsed.selection || {}) },
      user: { ...defaultState.user, ...(parsed.user || {}) },
    };
  } catch {
    return structuredClone(defaultState);
  }
}

let state = load();
const listeners = new Set();

export function getState() { return state; }

export function setState(patch) {
  state = { ...state, ...patch };
  persist();
  emit();
}

export function updateSelection(patch) {
  state.selection = { ...state.selection, ...patch };
  persist();
  emit();
}

export function addOrder(order) {
  state.orders = [order, ...state.orders];
  persist();
  emit();
}

export function updateOrder(id, patch) {
  state.orders = state.orders.map(o => o.id === id ? { ...o, ...patch } : o);
  persist();
  emit();
}

export function cancelOrder(id) {
  state.orders = state.orders.map(o => o.id === id ? { ...o, status: 'cancelada', cancelledAt: new Date().toISOString() } : o);
  persist();
  emit();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function persist() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

function emit() {
  listeners.forEach(fn => fn(state));
}

export function resetStore() {
  state = structuredClone(defaultState);
  persist();
  emit();
}

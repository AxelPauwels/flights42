import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

const CALL_STATE_INIT = 'init';
const CALL_STATE_LOADING = 'loading';
const CALL_STATE_LOADED = 'loaded';

export type CallState =
  typeof CALL_STATE_INIT | typeof CALL_STATE_LOADING | typeof CALL_STATE_LOADED | { error: string };
interface CallStateState {
  callState: CallState;
}
const initialCallState: CallStateState = {
  callState: 'init',
};

export function withCallState() {
  return signalStoreFeature(
    withState<CallStateState>(initialCallState),
    withComputed(({ callState }) => ({
      loading: computed(() => callState() === CALL_STATE_LOADING),
      loaded: computed(() => callState() === CALL_STATE_LOADED),
      error: computed(() => {
        const state = callState();
        if (state === CALL_STATE_INIT) {
          return null;
        }

        return typeof state === 'object' ? state.error : null;
      }),
    })),
  );
}

export function setLoading(): { callState: CallState } {
  return { callState: 'loading' };
}

export function setLoaded(): { callState: CallState } {
  return { callState: 'loaded' };
}

export function setError(error: string): { callState: CallState } {
  return { callState: { error } };
}


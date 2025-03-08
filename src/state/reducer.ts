import { AppState } from "./state";
import { Action } from "./actions";

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_APP_VIEW":
      return { ...state, view: action.view };
    case "SET_BEARER_TOKEN":
      return { ...state, bearerToken: action.token, view: "home" };
    case "SHOW_TOAST":
      return { ...state, toasts: [...state.toasts, action.toast] };
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

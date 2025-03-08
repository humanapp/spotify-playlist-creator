import { AppView, ToastWithId, User } from "../types";

/**
 * Action Types
 */

type ActionBase = {
  type: string;
};

type SetAppView = ActionBase & {
  type: "SET_APP_VIEW";
  view: AppView;
};

type SetBearerToken = ActionBase & {
  type: "SET_BEARER_TOKEN";
  token: string | undefined;
};

type ShowToast = ActionBase & {
  type: "SHOW_TOAST";
  toast: ToastWithId;
};

type DismissToast = ActionBase & {
  type: "DISMISS_TOAST";
  toastId: string | undefined;
};

type SetUser = ActionBase & {
  type: "SET_USER";
  user: User;
};

/**
 * All Actions
 */

export type Action =
  | SetAppView
  | SetBearerToken
  | ShowToast
  | DismissToast
  | SetUser;

/**
 * Action Creators
 */

export const setAppView = (view: AppView): SetAppView => ({
  type: "SET_APP_VIEW",
  view,
});

export const setBearerToken = (token: string | undefined): SetBearerToken => ({
  type: "SET_BEARER_TOKEN",
  token,
});

export const showToast = (toast: ToastWithId): ShowToast => ({
  type: "SHOW_TOAST",
  toast,
});

export const dismissToast = (toastId: string | undefined): DismissToast => ({
  type: "DISMISS_TOAST",
  toastId,
});

export const setUser = (user: User): SetUser => ({
  type: "SET_USER",
  user,
});

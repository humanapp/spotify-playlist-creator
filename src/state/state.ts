import { AppView, ToastWithId, User } from "../types";

export type AppState = {
  view: AppView;
  toasts: ToastWithId[];
  bearerToken?: string;
  user?: User;
};

export const initialAppState: AppState = {
  view: "home",
  toasts: [],
};

import * as spotify from "../services/spotify";
import { stateAndDispatch } from "../state";
import { setUser } from "../state/actions";

export async function fetchMeAsync() {
  const { state } = stateAndDispatch();
  const { bearerToken } = state;
  const me = await spotify.fetchMeAsync(bearerToken!);
  const { dispatch } = stateAndDispatch();
  dispatch(setUser(me));
  return me;
}

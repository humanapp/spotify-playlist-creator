import { stateAndDispatch } from "../state";
import { makeToast } from "../utils";
import { showToast } from "./showToast";
import { dismissToast } from "./dismissToast";
import { ToastWithId } from "../types";
import * as spotify from "../services/spotify";

export async function createPlaylistAsync(name: string, tracks: string[]) {
  const { state } = stateAndDispatch();
  const { bearerToken } = state;
  const toast: ToastWithId = {
    ...makeToast("info", `Creating playlist ${name}...`),
    showSpinner: true,
    hideDismissBtn: true,
    timeoutMs: 0,
  };
  try {
    showToast(toast);

    const trackUris: string[] = [];

    for (const track of tracks) {
      const searchingToast = {
        ...makeToast("info", `Searching for ${track}...`),
        showSpinner: true,
        hideDismissBtn: true,
        timeoutMs: 0,
      };
      try {
        showToast(searchingToast);
        const trackUri = await spotify.searchTracksAsync(bearerToken!, track);
        if (trackUri) {
          trackUris.push(trackUri);
        } else {
          showToast(makeToast("error", `Failed to find ${track}`));
        }
      } catch (error) {
        showToast(makeToast("error", `Failed to search for ${track}`));
      } finally {
        dismissToast(searchingToast.id);
      }
    }

    const playlistId = await spotify.createPlaylistAsync(bearerToken!, name);
    if (!playlistId) throw 0;

    const addingToast = {
      ...makeToast("info", `Adding tracks...`),
      timeoutMs: 0,
      showSpinner: true,
    };
    try {
      showToast(addingToast);
      const snapshotId = await spotify.addTracksToPlaylistAsync(
        bearerToken!,
        playlistId,
        trackUris
      );
      if (!snapshotId) throw 0;
    } catch (error) {
      showToast(makeToast("error", "Failed to add tracks to playlist"));
    } finally {
      dismissToast(addingToast.id);
    }

    showToast(makeToast("success", `Playlist ${name} created!`));
  } catch (error) {
    showToast(makeToast("error", "Failed to create playlist"));
  } finally {
    dismissToast(toast.id);
  }
}

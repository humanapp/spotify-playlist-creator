import querystring from "querystring";
import * as storage from "./storage";
import { User } from "../types";
import { fuzzySubstringRank } from "../utils";

export async function authCallbackAsync() {
  // read code from url params
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (code) {
    const authHeader = btoa(
      `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`
    );
    const resp = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
      body: querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:5173/auth/callback",
      }),
    });

    const json = await resp.json();
    if (!resp.ok) {
      console.error(json);
      return;
    }
    const token = json.access_token;

    // save code to local storage
    storage.setBearerToken(token);
  } else {
    console.error("No code in URL");
  }
  // redirect to home
  window.location.href = "/";
}

export function signIn() {
  const scope =
    "user-read-private user-read-email playlist-modify-public playlist-modify-private";
  window.location.href =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      show_dialog: "true",
      scope: scope,
      redirect_uri: "http://localhost:5173/auth/callback",
      state: "1234",
    });
}

export function signOut() {
  storage.delBearerToken();
  window.location.href = "/";
}

export async function fetchMeAsync(bearerToken: string): Promise<User> {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  if (!response.ok) {
    console.error(response.status, response.statusText, await response.text());
    signOut();
  }
  const json = await response.json();

  return {
    id: json.id,
    name: json.display_name,
  };
}

export async function createPlaylistAsync(
  bearerToken: string,
  title: string,
  isPublic: boolean = true
): Promise<string> {
  const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: title,
      public: isPublic,
      description: "",
    }),
  });
  if (!response.ok) {
    console.error(response.status, response.statusText, await response.text());
    signOut();
  }
  const createJson = await response.json();
  return createJson.id;
}

type RankedTrack = {
  track: any;
  rank: number;
};

export async function searchTracksAsync(
  bearerToken: string,
  origQuery: string
): Promise<string | undefined> {
  // split the query into parts, according to the format "artist - title" or "artist - title - album"
  let query = origQuery;
  const parts = query
    .split(/[-–]/)
    .map((p) => p.trim())
    .filter(Boolean);
  let queryTrackName = query;
  let album: string | undefined;
  if (parts.length >= 2) {
    let filters: string[] = [];
    // assign the first element to artist, and remove it
    filters.push(`artist:${parts.shift()!}`);
    if (parts.length >= 2) {
      // if there are still 2 or more parts, the last one is the album
      //filters.push(`album:${parts.pop()!}`);
      // ignore the album for now
      album = parts.pop();
    }
    // the rest is the title
    filters.push(`track:${parts.join("-")}`);
    queryTrackName = parts.join(" - ");
    // rebuild the spotify query with this info
    query = filters.join(" ");
  }
  const queryAlbumName = (album || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  queryTrackName = queryTrackName.toLowerCase().replace(/[^a-z0-9]/g, "");
  let response = await fetch(
    `https://api.spotify.com/v1/search?type=track&limit=20&q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );
  if (!response.ok) {
    console.error(response.status, response.statusText, await response.text());
    return undefined;
  }
  let json = await response.json();
  let tracks = json.tracks.items;
  if (!tracks.length) {
    // retry with the original query
    response = await fetch(
      `https://api.spotify.com/v1/search?type=track&limit=20&q=${encodeURIComponent(origQuery)}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    if (!response.ok) {
      console.error(
        response.status,
        response.statusText,
        await response.text()
      );
      return undefined;
    }
    json = await response.json();
    tracks = json.tracks.items;
  }
  const rankedTracks: RankedTrack[] = tracks
    .map((track: any) => {
      const trackName = track.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      let rank = fuzzySubstringRank(queryTrackName, trackName);
      if (rank > 3) {
        rank = Infinity;
      } else {
        if (queryAlbumName) {
          const albumName = track.album.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
          const albumRank = fuzzySubstringRank(queryAlbumName, albumName);
          rank += albumRank;
        }
      }
      return { track, rank };
    })
    // filter out tracks with rank 2 or higher
    //.filter((t: RankedTrack) => t.rank < 5);
    // filter out ranks of Infinity
    .filter((t: RankedTrack) => Number.isFinite(t.rank));
  // sort by rank, ascending
  rankedTracks.sort((a, b) => a.rank - b.rank);
  // return the uri of the top-ranked track
  return rankedTracks.map((t) => t.track.uri).shift();
}

export async function addTracksToPlaylistAsync(
  bearerToken: string,
  playlistId: string,
  trackUris: string[]
) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    }
  );
  if (!response.ok) {
    console.error(response.status, response.statusText, await response.text());
    return undefined;
  }
  const json = await response.json();
  return json.snapshot_id;
}

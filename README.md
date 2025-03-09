# Spotify Playlist Creator

Paste a bunch of songs and it will make you a playlist! Ideally, each line would be formatted like "artist - title - album" or even just "artist - title". This format provides the most information about what you're looking for, and therefore most likely to find the best match. Otherwise, you might get Lil' Wayne when you're looking for Tangerine Dream. Seriously. This happened. It may still happen. The system isn't perfect.

I made this app so I could import playlists of my favorite radio show, Dead Electric on KSER, hosted by David Haldeman. Playlists of every show can be found here: https://deadelectricfm.com/playlists/

## HOW TO RUN

0. Ensure you have GIT and NodeJS installed on your local machine.
1. Go to Spotify Developer Portal and create an app.
  - For callback URL, use `http://localhost:5173/auth/callback`
  - Make note of the app's client id and client secret.
2. Sync this repo to your local machine.
3. Run `npm i` to install dependencies.
4. Create a file at the root of this project called `.env`.
5. In `.env`, add the following:
  ```
  VITE_SPOTIFY_CLIENT_ID=<your app's client id>
  VITE_SPOTIFY_CLIENT_SECRET=<your app's client secret>
  ```
6. Run the app: `npm run dev`
7. Open a web browser to http://localhost:5173

## TIPS AND TRICKS

* Before actually creating a playlist, do a dry run with the browser's dev console open. In the console you'll see the found songs it thinks most closely matched your inputs. Verify them and tweak the text until you're happy with the results.

* If it fails to find your track, search in Spotify itself. Sometimes small differences in spelling can trip it up, for example:
  * Fails to find "Chris and Cosey", but will find "Chris & Cosey"
  * Fails to find "Brian Eno, Mobius, and Roedelius", but will find "Brian Eno, Moebius, Roedelius"
  * Fails to find "Tangerine Dream – Barbekane – Poland", but will find "Tangerine Dream – Barbakane – Poland"
* Remove inline notes like "(single)" and "(excerpt)"
* Sometimes excluding the album name can help widen the search


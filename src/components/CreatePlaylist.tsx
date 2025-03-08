import { useState } from "react";
import { createPlaylistAsync } from "../transforms/createPlaylistAsync";
import {
  Sheet,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Typography,
  Checkbox,
} from "@mui/joy";
import { Check } from "@mui/icons-material";

export function CreatePlaylist() {
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [songList, setSongList] = useState("");
  const [dryRun, setDryRun] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const songs = songList
      .split("\n")
      .filter((song) => song.trim() !== "")
      .filter((song) => song.toLowerCase() !== "[mic break]");
    console.log("Playlist Title:", playlistTitle);
    console.log("Songs:", songs);
    if (playlistTitle && songs.length > 0) {
      await createPlaylistAsync(playlistTitle, songs, dryRun);
    }
    if (!dryRun) {
      setPlaylistTitle("");
      setSongList("");
    }
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        width: 700,
        mx: "auto", // margin left & right
        my: 4, // margin top & bottom
        py: 3, // padding top & bottom
        px: 2, // padding left & right
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "md",
        boxShadow: "md",
      }}
    >
      <Typography level="h4" component="h1">
        Create a New Playlist
      </Typography>
      <FormControl>
        <FormLabel>Playlist Title</FormLabel>
        <Input
          value={playlistTitle}
          onChange={(e) => setPlaylistTitle(e.target.value)}
          placeholder="Enter playlist title"
          required
        />
      </FormControl>
      <FormControl sx={{ mt: 2 }}>
        <FormLabel>Songs (one per line)</FormLabel>
        <Textarea
          value={songList}
          onChange={(e) => setSongList(e.target.value)}
          minRows={15}
          placeholder="Add one song per line"
          required
        />
      </FormControl>
      <Button sx={{ mt: 2 }} onClick={handleSubmit}>
        CREATE PLAYLIST
      </Button>
      <Checkbox
        checked={dryRun}
        checkedIcon={<Check />}
        label="Dry run. Don't actually create the playlist."
        onChange={(e) => setDryRun(e.target.checked)}
      />
    </Sheet>
  );
}

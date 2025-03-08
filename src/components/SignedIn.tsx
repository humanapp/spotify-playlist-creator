import { Button } from "@mui/joy";
import { CreatePlaylist } from "./CreatePlaylist";
import { signOut } from "../transforms/signOut";

export function SignedIn() {
  return (
    <>
      <CreatePlaylist />
      <Button
        variant="solid"
        color="neutral"
        size="md"
        sx={{
          borderRadius: "md",
          boxShadow: "sm",
          textTransform: "uppercase",
        }}
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    </>
  );
}

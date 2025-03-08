import Button from "@mui/joy/Button";
import { signIn } from "../transforms/signIn";

export function SignedOut() {
  return (
    <Button
      variant="solid"
      color="primary"
      size="md"
      sx={{
        borderRadius: "md",
        boxShadow: "sm",
        textTransform: "uppercase",
      }}
      onClick={() => signIn()}
    >
      Sign Into Spotify
    </Button>
  );
}

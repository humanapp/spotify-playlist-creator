import { useContext } from "react";
import { AppStateContext } from "../state/Context";
import { SignedIn } from "./SignedIn";
import { SignedOut } from "./SignedOut";

export function Page() {
  const { state } = useContext(AppStateContext);
  const { bearerToken } = state;

  return <>{bearerToken ? <SignedIn /> : <SignedOut />}</>;
}

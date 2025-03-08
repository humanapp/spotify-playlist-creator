import "./App.scss";
import { AppStateReady } from "./state/Context";
import { usePromise } from "./hooks/usePromise";
import { Loading } from "./components/Loading";
import { Page } from "./components/Page";
import { Toasts } from "./components/Toast";
import { makeToast } from "./utils";
import { showToast } from "./transforms/showToast";
import { fetchMeAsync } from "./transforms/fetchMeAsync";
import * as storage from "./services/storage";
import { useState, useEffect } from "react";

function App() {
  const [inited, setInited] = useState(false);
  const [ready, setReady] = useState(false);

  usePromise(AppStateReady, setReady);

  useEffect(() => {
    if (ready && !inited) {
      Promise.resolve().then(async () => {
        const bearerToken = storage.getBearerToken();
        if (bearerToken) {
          const user = await fetchMeAsync();
          if (user) {
            showToast(makeToast("info", `Welcome ${user.name}!`));
          }
        }
        setInited(true);
      });
    }
  }, [ready, inited]);

  return (
    <>
      {inited ? <Page /> : <Loading />}
      <Toasts />
    </>
  );
}

export default App;

import { Component, Show } from "solid-js";
import { useAppState } from "../../state/StateProvider";
import { combineClasses } from "../../util/helpers";
import NotFound from "../NotFound";
import Grid from "../util/layout/Grid";
import Loading from "../util/loading/Loading";
import Actions from "./Actions";
import { ActionStateProvider } from "./ActionStateProvider";
import Header from "./Header";
import ServerTabs from "./tabs/Tabs";
import Updates from "./Updates";

const Server: Component<{}> = (p) => {
	const { servers, selected } = useAppState();
  const server = () => servers.get(selected.id())!;
	return (
    <Show when={server()} fallback={<NotFound type="server" />}>
      <ActionStateProvider>
        <Grid class="content">
          {/* left / actions */}
          <Grid class="left-content">
            <Header />
            <Actions />
            <Updates />
          </Grid>
          {/* right / tabs */}
          <ServerTabs />
        </Grid>
      </ActionStateProvider>
    </Show>
  );
}

export default Server;
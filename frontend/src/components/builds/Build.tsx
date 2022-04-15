import { Component, Show } from "solid-js";
import { useAppState } from "../../state/StateProvider";
import Grid from "../util/layout/Grid";
import Actions from "./Actions";
import { ActionStateProvider } from "./ActionStateProvider";
import Header from "./Header";
import BuildTabs from "./tabs/Tabs";
import Updates from "./Updates";

const Build: Component<{}> = (p) => {
  const { builds, selected } = useAppState();
  const build = () => builds.get(selected.id())!;
  return (
    <Show when={build()}>
      <ActionStateProvider>
        <Grid class="content">
          {/* left / actions */}
          <Grid class="left-content">
            <Header />
            <Actions />
            <Updates />
          </Grid>
          {/* right / tabs */}
          <BuildTabs />
        </Grid>
      </ActionStateProvider>
    </Show>
  );
};

export default Build;

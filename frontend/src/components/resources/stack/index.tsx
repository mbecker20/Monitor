import { useInvalidate, useLocalStorage, useRead, useWrite } from "@lib/hooks";
import { RequiredResourceComponents } from "@types";
import { Card } from "@ui/card";
import {
  FolderGit,
  Layers,
  Loader2,
  NotepadText,
  RefreshCcw,
  Server,
} from "lucide-react";
import { StackConfig } from "./config";
import { DeleteResource, NewResource, ResourceLink } from "../common";
import { StackTable } from "./table";
import {
  stack_state_intention,
  stroke_color_class_by_intention,
} from "@lib/color";
import { cn } from "@lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
import { useServer } from "../server";
import { Types } from "@komodo/client";
import {
  DeployStack,
  DestroyStack,
  PauseUnpauseStack,
  RenameStack,
  RestartStack,
  StartStopStack,
} from "./actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { StackInfo } from "./info";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { useToast } from "@ui/use-toast";
import { StackServices } from "./services";
import { DashboardPieChart } from "@pages/home/dashboard";
import { StatusBadge } from "@components/util";

export const useStack = (id?: string) =>
  useRead("ListStacks", {}, { refetchInterval: 5000 }).data?.find(
    (d) => d.id === id
  );

export const useFullStack = (id: string) =>
  useRead("GetStack", { stack: id }, { refetchInterval: 5000 }).data;

const StackIcon = ({ id, size }: { id?: string; size: number }) => {
  const state = useStack(id)?.info.state;
  const color = stroke_color_class_by_intention(stack_state_intention(state));
  return <Layers className={cn(`w-${size} h-${size}`, state && color)} />;
};

const ConfigInfoServices = ({ id }: { id: string }) => {
  const [view, setView] = useLocalStorage("stack-tabs-v1", "Config");
  const info = useStack(id)?.info;
  const state = info?.state;
  const stackDown =
    state === undefined ||
    state === Types.StackState.Unknown ||
    state === Types.StackState.Down;
  const title = (
    <TabsList className="justify-start w-fit">
      <TabsTrigger value="Config" className="w-[110px]">
        Config
      </TabsTrigger>
      <TabsTrigger value="Info" className="w-[110px]">
        Info
      </TabsTrigger>
      <TabsTrigger value="Services" className="w-[110px]" disabled={stackDown}>
        Services
      </TabsTrigger>
    </TabsList>
  );
  return (
    <Tabs
      value={stackDown && view === "Services" ? "Config" : view}
      onValueChange={setView}
      className="grid gap-4"
    >
      <TabsContent value="Config">
        <StackConfig id={id} titleOther={title} />
      </TabsContent>
      <TabsContent value="Info">
        <StackInfo id={id} titleOther={title} />
      </TabsContent>
      <TabsContent value="Services">
        <StackServices id={id} titleOther={title} />
      </TabsContent>
    </Tabs>
  );
};

export const StackComponents: RequiredResourceComponents = {
  list_item: (id) => useStack(id),

  Description: () => <>Deploy docker compose files.</>,

  Dashboard: () => {
    const summary = useRead("GetStacksSummary", {}).data;
    return (
      <DashboardPieChart
        data={[
          { intention: "Good", value: summary?.running ?? 0, title: "Running" },
          {
            intention: "Critical",
            value: summary?.unhealthy ?? 0,
            title: "Unhealthy",
          },
          {
            intention: "Neutral",
            value: summary?.down ?? 0,
            title: "Down",
          },
          {
            intention: "Unknown",
            value: summary?.unknown ?? 0,
            title: "Unknown",
          },
        ]}
      />
    );
  },

  New: ({ server_id }) => <NewResource type="Stack" server_id={server_id} />,

  Table: ({ resources }) => (
    <StackTable stacks={resources as Types.StackListItem[]} />
  ),

  Icon: ({ id }) => <StackIcon id={id} size={4} />,
  BigIcon: ({ id }) => <StackIcon id={id} size={8} />,

  Status: {
    State: ({ id }) => {
      const state = useStack(id)?.info.state ?? Types.StackState.Unknown;
      const config = useFullStack(id)?.config;
      if (!config?.files_on_host && !config?.file_contents && !config?.repo) {
        return null;
      }
      return <StatusBadge text={state} intent={stack_state_intention(state)} />;
    },
    Status: ({ id }) => {
      const info = useStack(id)?.info;
      if (info?.state !== Types.StackState.Unhealthy) return null;
      return (
        info?.status && (
          <p className="text-sm text-muted-foreground">{info.status}</p>
        )
      );
    },
    NoConfig: ({ id }) => {
      const config = useFullStack(id)?.config;
      if (
        !config ||
        config?.files_on_host ||
        config?.file_contents ||
        config?.repo
      ) {
        return null;
      }
      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card className="px-3 py-2 bg-destructive/75 hover:bg-destructive transition-colors cursor-pointer">
              <div className="text-sm text-nowrap overflow-hidden overflow-ellipsis">
                Config Missing
              </div>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <div className="grid gap-2">
              No configuration provided for stack. Cannot get stack state.
              Either paste the compose file contents into the UI, or configure a
              git repo containing your files.
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    ProjectMissing: ({ id }) => {
      const info = useStack(id)?.info;
      const state = info?.state ?? Types.StackState.Unknown;
      if (
        !info ||
        !info?.project_missing ||
        ![Types.StackState.Down, Types.StackState.Unknown].includes(state)
      ) {
        return null;
      }
      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card className="px-3 py-2 bg-destructive/75 hover:bg-destructive transition-colors cursor-pointer">
              <div className="text-sm text-nowrap overflow-hidden overflow-ellipsis">
                Project Missing
              </div>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <div className="grid gap-2">
              The compose project is not on the host. If the compose stack is
              running, the 'Project Name' needs to be set. This can be found
              with 'docker compose ls'.
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    RemoteErrors: ({ id }) => {
      const info = useFullStack(id)?.info;
      const errors = info?.remote_errors;
      if (!info || !errors || errors.length === 0) {
        return null;
      }
      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card className="px-3 py-2 bg-destructive/75 hover:bg-destructive transition-colors cursor-pointer">
              <div className="text-sm text-nowrap overflow-hidden overflow-ellipsis">
                Remote Error
              </div>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <div>
              There are errors reading the remote file contents. See{" "}
              <span className="font-bold">Info</span> tab for details.
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    Deployed: ({ id }) => {
      const info = useStack(id)?.info;
      const fullInfo = useFullStack(id)?.info;
      const state = info?.state;
      const stackDown =
        state === undefined ||
        state === Types.StackState.Unknown ||
        state === Types.StackState.Down;
      if (
        stackDown ||
        info?.project_missing ||
        !fullInfo?.deployed_hash ||
        !fullInfo?.deployed_message
      ) {
        return null;
      }
      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card className="px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="text-muted-foreground text-sm text-nowrap overflow-hidden overflow-ellipsis">
                deployed: {fullInfo.deployed_hash}
              </div>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <div className="grid gap-2">
              <Badge
                variant="secondary"
                className="w-fit text-muted-foreground"
              >
                commit message
              </Badge>
              {fullInfo.deployed_message}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    Latest: ({ id }) => {
      const info = useStack(id)?.info;
      const fullInfo = useFullStack(id)?.info;
      if (
        info?.project_missing ||
        !info?.latest_hash ||
        !fullInfo?.latest_message ||
        info?.latest_hash === info?.deployed_hash
      ) {
        return null;
      }
      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card className="px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="text-muted-foreground text-sm text-nowrap overflow-hidden overflow-ellipsis">
                latest: {info.latest_hash}
              </div>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <div className="grid gap-2">
              <Badge
                variant="secondary"
                className="w-fit text-muted-foreground"
              >
                commit message
              </Badge>
              {fullInfo.latest_message}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    Refresh: ({ id }) => {
      const { toast } = useToast();
      const inv = useInvalidate();
      const { mutate, isPending } = useWrite("RefreshStackCache", {
        onSuccess: () => {
          inv(["ListStacks"], ["GetStack", { stack: id }]);
          toast({ title: "Refreshed stack status cache" });
        },
      });
      return (
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            mutate({ stack: id });
            toast({ title: "Triggered refresh of stack status cache" });
          }}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4" />
          )}
        </Button>
      );
    },
  },

  Info: {
    Contents: ({ id }) => {
      const config = useFullStack(id)?.config;
      const file_contents = config?.file_contents;
      if (file_contents) {
        return (
          <div className="flex items-center gap-2">
            <NotepadText className="w-4 h-4" />
            Local
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <FolderGit className="w-4 h-4" />
          {config?.repo}
        </div>
      );
    },
    // Branch: ({ id }) => {
    //   const config = useFullStack(id)?.config;
    //   const file_contents = config?.file_contents;
    //   if (file_contents || !config?.branch) return null
    //   return (
    //     <div className="flex items-center gap-2">
    //       <GitBranch className="w-4 h-4" />
    //       {config.branch}
    //     </div>
    //   );
    // },
    Server: ({ id }) => {
      const info = useStack(id)?.info;
      const server = useServer(info?.server_id);
      return server?.id ? (
        <ResourceLink type="Server" id={server?.id} />
      ) : (
        <div className="flex gap-2 items-center">
          <Server className="w-4 h-4" />
          <div>Unknown Server</div>
        </div>
      );
    },
  },

  Actions: {
    DeployStack,
    RestartStack,
    PauseUnpauseStack,
    StartStopStack,
    DestroyStack,
  },

  Page: {},

  Config: ConfigInfoServices,

  DangerZone: ({ id }) => (
    <>
      <RenameStack id={id} />
      <DeleteResource type="Stack" id={id} />
    </>
  ),
};

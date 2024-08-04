import { useInvalidate, useRead, useWrite } from "@lib/hooks";
import { RequiredResourceComponents } from "@types";
import { Card, CardHeader } from "@ui/card";
import { FolderGit, Layers, Loader2, RefreshCcw, Server } from "lucide-react";
import { StackConfig } from "./config";
import { DeleteResource, NewResource, ResourceLink } from "../common";
import { StackTable } from "./table";
import {
  bg_color_class_by_intention,
  stack_state_intention,
  stroke_color_class_by_intention,
} from "@lib/color";
import { cn } from "@lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
import { StackDashboard } from "./dashboard";
import { useServer } from "../server";
import { Types } from "@monitor/client";
import {
  DeployStack,
  DestroyStack,
  PauseUnpauseStack,
  StartStopStack,
} from "./actions";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { StackInfo } from "./info";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { useToast } from "@ui/use-toast";
import { Services } from "./services";

export const useStack = (id?: string) =>
  useRead("ListStacks", {}, { refetchInterval: 5000 }).data?.find(
    (d) => d.id === id
  );

const StackIcon = ({ id, size }: { id?: string; size: number }) => {
  const state = useStack(id)?.info.state;
  const color = stroke_color_class_by_intention(stack_state_intention(state));
  return <Layers className={cn(`w-${size} h-${size}`, state && color)} />;
};

const ConfigOrInfo = ({ id }: { id: string }) => {
  const [view, setView] = useState("Info");
  const state = useStack(id)?.info.state;
  const infoDisabled =
    state === undefined ||
    state === Types.StackState.Unknown ||
    state === Types.StackState.Down;
  const title = (
    <TabsList className="justify-start w-fit">
      <TabsTrigger value="Config" className="w-[110px]">
        Config
      </TabsTrigger>
      <TabsTrigger value="Info" className="w-[110px]" disabled={infoDisabled}>
        Info
      </TabsTrigger>
    </TabsList>
  );
  return (
    <Tabs
      value={infoDisabled ? "Config" : view}
      onValueChange={setView}
      className="grid gap-4"
    >
      <TabsContent value="Config">
        <StackConfig id={id} titleOther={title} />
      </TabsContent>
      <TabsContent value="Info">
        <StackInfo id={id} titleOther={title} />
      </TabsContent>
    </Tabs>
  );
};

export const StackComponents: RequiredResourceComponents = {
  list_item: (id) => useStack(id),

  Dashboard: StackDashboard,

  New: ({ server_id }) => <NewResource type="Stack" server_id={server_id} />,

  Table: ({ resources }) => (
    <StackTable stacks={resources as Types.StackListItem[]} />
  ),

  Icon: ({ id }) => <StackIcon id={id} size={4} />,
  BigIcon: ({ id }) => <StackIcon id={id} size={8} />,

  Status: {
    State: ({ id }) => {
      const state = useStack(id)?.info.state;
      const color = bg_color_class_by_intention(stack_state_intention(state));
      return (
        <Card className={cn("w-fit", color)}>
          <CardHeader className="py-0 px-2">{state}</CardHeader>
        </Card>
      );
    },
    FileMissing: ({ id }) => {
      const info = useStack(id)?.info;
      if (!info?.file_missing || info?.state === Types.StackState.Down) {
        return null;
      }
      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card className="px-3 py-2 bg-destructive/75 hover:bg-destructive transition-colors cursor-pointer">
              <div className="text-sm text-nowrap overflow-hidden overflow-ellipsis">
                File Missing
              </div>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <div className="grid gap-2">
              The compose file is not on the host. Redeploy the Stack to access
              other actions.
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    Deployed: ({ id }) => {
      const info = useStack(id)?.info;
      if (
        info?.file_missing ||
        !info?.deployed_hash ||
        !info?.deployed_message
      ) {
        return null;
      }
      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card className="px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="text-muted-foreground text-sm text-nowrap overflow-hidden overflow-ellipsis">
                deployed: {info.deployed_hash}
              </div>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <div className="grid">
              <Badge
                variant="secondary"
                className="w-fit text-muted-foreground"
              >
                commit message
              </Badge>
              {info.deployed_message}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    Latest: ({ id }) => {
      const info = useStack(id)?.info;
      if (
        info?.file_missing ||
        !info?.latest_hash ||
        !info?.latest_message ||
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
            <div className="grid">
              <Badge
                variant="secondary"
                className="w-fit text-muted-foreground"
              >
                commit message
              </Badge>
              {info.latest_message}
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
    Repo: ({ id }) => {
      const repo = useStack(id)?.info.repo;
      return (
        <div className="flex items-center gap-2">
          <FolderGit className="w-4 h-4" />
          {repo}
        </div>
      );
    },
    // Branch: ({ id }) => {
    //   const branch = useStack(id)?.info.branch;
    //   return (
    //     <div className="flex items-center gap-2">
    //       <FolderGit className="w-4 h-4" />
    //       {branch}
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
    PauseUnpauseStack,
    StartStopStack,
    DestroyStack,
  },

  Page: {
    Services,
  },

  Config: ConfigOrInfo,

  DangerZone: ({ id }) => <DeleteResource type="Stack" id={id} />,
};

import { Section } from "@components/layouts";
import { useInvalidate, useRead, useUser, useWrite } from "@lib/hooks";
import { RequiredResourceComponents } from "@types";
import { Factory, FolderGit, Hammer, Loader2, RefreshCcw } from "lucide-react";
import { BuildConfig } from "./config";
import { BuildTable } from "./table";
import { DeleteResource, NewResource, ResourceLink } from "../common";
import { DeploymentTable } from "../deployment/table";
import { RunBuild } from "./actions";
import {
  border_color_class_by_intention,
  build_state_intention,
  stroke_color_class_by_intention,
} from "@lib/color";
import { cn } from "@lib/utils";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { ResourceComponents } from "..";
import { Types } from "komodo_client";
import { DashboardPieChart } from "@pages/home/dashboard";
import { ResourcePageHeader, StatusBadge } from "@components/util";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
import { Card } from "@ui/card";
import { Badge } from "@ui/badge";
import { useToast } from "@ui/use-toast";
import { Button } from "@ui/button";
import { useBuilder } from "../builder";
import { RenameResource } from "@components/config/util";

export const useBuild = (id?: string) =>
  useRead("ListBuilds", {}, { refetchInterval: 10_000 }).data?.find(
    (d) => d.id === id
  );

export const useFullBuild = (id: string) =>
  useRead("GetBuild", { build: id }, { refetchInterval: 10_000 }).data;

const BuildIcon = ({ id, size }: { id?: string; size: number }) => {
  const state = useBuild(id)?.info.state;
  const color = stroke_color_class_by_intention(build_state_intention(state));
  return <Hammer className={cn(`w-${size} h-${size}`, state && color)} />;
};

const ConfigOrDeployments = ({ id }: { id: string }) => {
  const [view, setView] = useState("Config");
  const deployments = useRead("ListDeployments", {}).data?.filter(
    (deployment) => deployment.info.build_id === id
  );
  const deploymentsDisabled = (deployments?.length || 0) === 0;
  const titleOther = (
    <TabsList className="justify-start w-fit">
      <TabsTrigger value="Config" className="w-[110px]">
        Config
      </TabsTrigger>
      <TabsTrigger
        value="Deployments"
        className="w-[110px]"
        disabled={deploymentsDisabled}
      >
        Deployments
      </TabsTrigger>
    </TabsList>
  );
  return (
    <Tabs
      value={deploymentsDisabled ? "Config" : view}
      onValueChange={setView}
      className="grid gap-4"
    >
      <TabsContent value="Config">
        <BuildConfig id={id} titleOther={titleOther} />
      </TabsContent>
      <TabsContent value="Deployments">
        <Section
          titleOther={titleOther}
          actions={<ResourceComponents.Deployment.New build_id={id} />}
        >
          <DeploymentTable deployments={deployments ?? []} />
        </Section>
      </TabsContent>
    </Tabs>
  );
};

export const BuildComponents: RequiredResourceComponents = {
  list_item: (id) => useBuild(id),
  resource_links: (resource) => (resource.config as Types.BuildConfig).links,

  Description: () => <>Build docker images.</>,

  Dashboard: () => {
    const summary = useRead("GetBuildsSummary", {}).data;
    return (
      <DashboardPieChart
        data={[
          { title: "Ok", intention: "Good", value: summary?.ok ?? 0 },
          {
            title: "Building",
            intention: "Warning",
            value: summary?.building ?? 0,
          },
          {
            title: "Failed",
            intention: "Critical",
            value: summary?.failed ?? 0,
          },
          {
            title: "Unknown",
            intention: "Unknown",
            value: summary?.unknown ?? 0,
          },
        ]}
      />
    );
  },

  GroupActions: () => <></>,

  New: () => {
    const user = useUser().data;
    const builders = useRead("ListBuilders", {}).data;
    if (!user) return null;
    if (!user.admin && !user.create_build_permissions) return null;
    return (
      <NewResource
        type="Build"
        builder_id={
          builders && builders.length === 1 ? builders[0].id : undefined
        }
      />
    );
  },

  Table: ({ resources }) => (
    <BuildTable builds={resources as Types.BuildListItem[]} />
  ),

  Icon: ({ id }) => <BuildIcon id={id} size={4} />,
  BigIcon: ({ id }) => <BuildIcon id={id} size={8} />,

  State: ({ id }) => {
    let state = useBuild(id)?.info.state;
    return <StatusBadge text={state} intent={build_state_intention(state)} />;
  },

  Status: {
    Hash: ({ id }) => {
      const info = useFullBuild(id)?.info;
      if (!info?.latest_hash) {
        return null;
      }
      const out_of_date =
        info.built_hash && info.built_hash !== info.latest_hash;
      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card
              className={cn(
                "px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer",
                out_of_date && border_color_class_by_intention("Warning")
              )}
            >
              <div className="text-muted-foreground text-sm text-nowrap overflow-hidden overflow-ellipsis">
                {info.built_hash ? "built" : "latest"}:{" "}
                {info.built_hash || info.latest_hash}
              </div>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <div className="grid gap-2">
              <Badge
                variant="secondary"
                className="w-fit text-muted-foreground"
              >
                message
              </Badge>
              {info.built_message || info.latest_message}
              {out_of_date && (
                <>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "w-fit text-muted-foreground border-[1px]",
                      border_color_class_by_intention("Warning")
                    )}
                  >
                    latest
                  </Badge>
                  <div>
                    <span className="text-muted-foreground">
                      {info.latest_hash}
                    </span>
                    : {info.latest_message}
                  </div>
                </>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
    Refresh: ({ id }) => {
      const { toast } = useToast();
      const inv = useInvalidate();
      const { mutate, isPending } = useWrite("RefreshBuildCache", {
        onSuccess: () => {
          inv(["ListBuilds"], ["GetBuild", { build: id }]);
          toast({ title: "Refreshed build status cache" });
        },
      });
      return (
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            mutate({ build: id });
            toast({ title: "Triggered refresh of build status cache" });
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
    Builder: ({ id }) => {
      const info = useBuild(id)?.info;
      const builder = useBuilder(info?.builder_id);
      return builder?.id ? (
        <ResourceLink type="Builder" id={builder?.id} />
      ) : (
        <div className="flex gap-2 items-center text-sm">
          <Factory className="w-4 h-4" />
          <div>Unknown Builder</div>
        </div>
      );
    },
    Repo: ({ id }) => {
      const repo = useBuild(id)?.info.repo;
      return (
        <div className="flex items-center gap-2">
          <FolderGit className="w-4 h-4" />
          {repo}
        </div>
      );
    },
    Branch: ({ id }) => {
      const branch = useBuild(id)?.info.branch;
      return (
        <div className="flex items-center gap-2">
          <FolderGit className="w-4 h-4" />
          {branch}
        </div>
      );
    },
  },

  Actions: { RunBuild },

  Page: {},

  Config: ConfigOrDeployments,

  DangerZone: ({ id }) => (
    <>
      <RenameResource type="Build" id={id} />
      <DeleteResource type="Build" id={id} />
    </>
  ),

  ResourcePageHeader: ({ id }) => {
    const build = useBuild(id);

    return (
      <ResourcePageHeader
        intent={build_state_intention(build?.info.state)}
        icon={<BuildIcon id={id} size={8} />}
        name={build?.name}
        state={build?.info.state}
        status=""
      />
    );
  },
};

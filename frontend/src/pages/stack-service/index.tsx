import { Section } from "@components/layouts";
import {
  ResourceDescription,
  ResourceLink,
} from "@components/resources/common";
import { useStack } from "@components/resources/stack";
import {
  PauseUnpauseStack,
  RestartStack,
  StartStopStack,
} from "@components/resources/stack/actions";
import {
  container_state_intention,
  stroke_color_class_by_intention,
} from "@lib/color";
import { useRead, useSetTitle } from "@lib/hooks";
import { cn } from "@lib/utils";
import { Types } from "komodo_client";
import { ChevronLeft, Clapperboard, Layers2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { StackServiceLogs } from "./log";
import { Button } from "@ui/button";
import { ExportButton } from "@components/export";
import { DockerResourceLink, ResourcePageHeader } from "@components/util";
import { useEditPermissions } from "@pages/resource";
import { ResourceNotifications } from "@pages/resource-notifications";
import { Fragment } from "react/jsx-runtime";

type IdServiceComponent = React.FC<{ id: string; service?: string }>;

const Actions: { [action: string]: IdServiceComponent } = {
  RestartStack,
  PauseUnpauseStack,
  StartStopStack,
};

export const StackServicePage = () => {
  const { type, id, service } = useParams() as {
    type: string;
    id: string;
    service: string;
  };
  if (type !== "stacks") {
    return <div>This resource type does not have any services.</div>;
  }
  return <StackServicePageInner stack_id={id} service={service} />;
};

const StackServicePageInner = ({
  stack_id,
  service,
}: {
  stack_id: string;
  service: string;
}) => {
  const stack = useStack(stack_id);
  useSetTitle(`${stack?.name} | ${service}`);
  const { canExecute, canWrite } = useEditPermissions({
    type: "Stack",
    id: stack_id,
  });
  const services = useRead("ListStackServices", { stack: stack_id }).data;
  const container = services?.find((s) => s.service === service)?.container;
  const state = container?.state ?? Types.ContainerStateStatusEnum.Empty;
  const intention = container_state_intention(state);
  const stroke_color = stroke_color_class_by_intention(intention);

  return (
    <div>
      <div className="w-full flex items-center justify-between mb-12">
        <Link to={"/stacks/" + stack_id}>
          <Button className="gap-2" variant="secondary">
            <ChevronLeft className="w-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <ExportButton targets={[{ type: "Stack", id: stack_id }]} />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-4">
        {/** HEADER */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 border rounded-md">
            {/* <Components.ResourcePageHeader id={id} /> */}
            <ResourcePageHeader
              intent={intention}
              icon={<Layers2 className={cn("w-8 h-8", stroke_color)} />}
              name={service}
              state={state}
              status={container?.status}
            />
            <div className="flex flex-col pb-2 px-4">
              <div className="flex items-center gap-x-4 gap-y-0 flex-wrap text-muted-foreground">
                <ResourceLink type="Stack" id={stack_id} />
                {stack?.info.server_id && (
                  <>
                    |
                    <ResourceLink type="Server" id={stack.info.server_id} />
                  </>
                )}
                {stack?.info.server_id && container?.name && (
                  <>
                    |
                    <DockerResourceLink
                      type="container"
                      server_id={stack.info.server_id}
                      name={container.name}
                      muted
                    />
                  </>
                )}
                {stack?.info.server_id && container?.image && (
                  <>
                    |
                    <DockerResourceLink
                      type="image"
                      server_id={stack.info.server_id}
                      name={container.image}
                      id={container.image_id}
                      muted
                    />
                  </>
                )}
                {stack?.info.server_id &&
                  container?.networks.map((network) => (
                    <Fragment key={network}>
                      |
                      <DockerResourceLink
                        type="network"
                        server_id={stack.info.server_id}
                        name={network}
                        muted
                      />
                    </Fragment>
                  ))}
                {stack?.info.server_id &&
                  container &&
                  container.volumes.map((volume) => (
                    <Fragment key={volume}>
                      |
                      <DockerResourceLink
                        type="volume"
                        server_id={stack.info.server_id}
                        name={volume}
                        muted
                      />
                    </Fragment>
                  ))}
              </div>
            </div>
          </div>
          <ResourceDescription
            type="Stack"
            id={stack_id}
            disabled={!canWrite}
          />
        </div>
        {/** NOTIFICATIONS */}
        <ResourceNotifications type="Stack" id={stack_id} />
      </div>

      <div className="mt-8 flex flex-col gap-12">
        {/* Actions */}
        {canExecute && (
          <Section
            title="Actions (Service)"
            icon={<Clapperboard className="w-4 h-4" />}
          >
            <div className="flex gap-4 items-center flex-wrap">
              {Object.entries(Actions).map(([key, Action]) => (
                <Action key={key} id={stack_id} service={service} />
              ))}
            </div>
          </Section>
        )}

        {/* Logs */}
        <div className="pt-4">
          <StackServiceLogs id={stack_id} service={service} />
        </div>
      </div>
    </div>
  );
};

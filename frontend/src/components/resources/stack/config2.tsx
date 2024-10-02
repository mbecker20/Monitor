import { Config, ConfigComponent } from "@components/config";
import {
  AccountSelectorConfig,
  AddExtraArgMenu,
  ConfigItem,
  ConfigList,
  InputList,
  ProviderSelectorConfig,
} from "@components/config/util";
import { Types } from "@komodo/client";
import { useLocalStorage, useRead, useWrite } from "@lib/hooks";
import { ReactNode, useState } from "react";
import { ResourceSelector } from "../common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { SecretsSearch } from "@components/config/env_vars";
import { ShowHideButton } from "@components/util";
import { MonacoEditor } from "@components/monaco";

type StackMode = "UI Defined" | "Files On Server" | "Git Repo" | undefined;
const STACK_MODES: StackMode[] = ["UI Defined", "Files On Server", "Git Repo"];

function getStackMode(
  update: Partial<Types.StackConfig>,
  config: Types.StackConfig
): StackMode {
  if (update.files_on_host ?? config.files_on_host) return "Files On Server";
  if (update.repo ?? config.repo) return "Git Repo";
  if (update.file_contents ?? config.file_contents) return "UI Defined";
  return undefined;
}

export const StackConfig = ({
  id,
  titleOther,
}: {
  id: string;
  titleOther: ReactNode;
}) => {
  const [show, setShow] = useLocalStorage(`stack-${id}-show`, {
    file: true,
    env: true,
  });
  const perms = useRead("GetPermissionLevel", {
    target: { type: "Stack", id },
  }).data;
  const config = useRead("GetStack", { stack: id }).data?.config;
  const webhooks = useRead("GetStackWebhooksEnabled", { stack: id }).data;
  const global_disabled =
    useRead("GetCoreInfo", {}).data?.ui_write_disabled ?? false;
  const [update, set] = useState<Partial<Types.StackConfig>>({});
  const { mutateAsync } = useWrite("UpdateStack");

  if (!config) return null;

  const disabled = global_disabled || perms !== Types.PermissionLevel.Write;
  const run_build = update.run_build ?? config.run_build;
  const mode = getStackMode(update, config);

  const setMode = (mode: StackMode) => {
    if (mode === "Files On Server") {
      set({ ...update, files_on_host: true });
    } else if (mode === "Git Repo") {
      set({
        ...update,
        files_on_host: false,
        repo: update.repo || config.repo || "namespace/repo",
      });
    } else if (mode === "UI Defined") {
      set({
        ...update,
        files_on_host: false,
        repo: "",
        file_contents:
          update.file_contents ||
          config.file_contents ||
          DEFAULT_STACK_FILE_CONTENTS,
      });
    } else if (mode === undefined) {
      set({
        ...update,
        files_on_host: false,
        repo: "",
        file_contents: "",
      });
    }
  };

  let components: Record<
    string,
    false | ConfigComponent<Types.StackConfig>[] | undefined
  > = {};

  const server_component: ConfigComponent<Types.StackConfig> = {
    label: "Server",
    labelHidden: true,
    components: {
      server_id: (server_id, set) => {
        return (
          <ConfigItem
            label={"Select Server"}
            description="Choose the Server to deploy the Stack on."
          >
            <ResourceSelector
              type="Server"
              selected={server_id}
              onSelect={(server_id) => set({ server_id })}
              disabled={disabled}
              align="start"
            />
          </ConfigItem>
        );
      },
    },
  };

  const choose_mode: ConfigComponent<Types.StackConfig> = {
    label: "Choose Mode",
    labelHidden: true,
    components: {
      server_id: () => {
        return (
          <ConfigItem
            label="Choose Mode"
            description="Will the file contents be defined in UI, stored on the server, or pulled from a git repo?"
          >
            <Select
              value={mode}
              onValueChange={(mode) => setMode(mode as StackMode)}
              disabled={disabled}
            >
              <SelectTrigger
                className="w-[200px] capitalize"
                disabled={disabled}
              >
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                {STACK_MODES.map((mode) => (
                  <SelectItem
                    key={mode}
                    value={mode!}
                    className="capitalize cursor-pointer"
                  >
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigItem>
        );
      },
    },
  };

  const general_common: ConfigComponent<Types.StackConfig>[] = [
    {
      label: "Environment",
      boldLabel: false,
      description: "Pass these variables to the compose command",
      actions: (
        <ShowHideButton
          show={show.env}
          setShow={(env) => setShow({ ...show, env })}
        />
      ),
      contentHidden: !show.env,
      components: {
        environment: (env, set) => (
          <>
            <SecretsSearch server={update.server_id ?? config.server_id} />
            <MonacoEditor
              value={env || "  # VARIABLE = value\n"}
              onValueChange={(environment) => set({ environment })}
              language="key_value"
              readOnly={disabled}
            />
          </>
        ),
        env_file_path: {
          description:
            "The path to write the file to, relative to the root of the repo.",
          placeholder: ".env",
        },
        // skip_secret_interp: true,
      },
    },
    {
      label: "Extra Args",
      labelHidden: true,
      components: {
        extra_args: (value, set) => (
          <ConfigItem
            label="Extra Args"
            description="Add extra args inserted after 'docker compose up -d'"
          >
            {!disabled && (
              <AddExtraArgMenu
                type="Stack"
                onSelect={(suggestion) =>
                  set({
                    extra_args: [
                      ...(update.extra_args ?? config.extra_args ?? []),
                      suggestion,
                    ],
                  })
                }
                disabled={disabled}
              />
            )}
            <InputList
              field="extra_args"
              values={value ?? []}
              set={set}
              disabled={disabled}
              placeholder="--extra-arg=value"
            />
          </ConfigItem>
        ),
      },
    },
    {
      label: "Links",
      labelHidden: true,
      components: {
        links: (values, set) => (
          <ConfigList
            label="Links"
            addLabel="Add Link"
            description="Add quick links in the resource header"
            field="links"
            values={values ?? []}
            set={set}
            disabled={disabled}
            placeholder="Input link"
          />
        ),
      },
    },
  ];

  const advanced: ConfigComponent<Types.StackConfig>[] = [
    {
      label: "Project Name",
      labelHidden: true,
      components: {
        project_name: {
          placeholder: "Compose project name",
          description:
            "Optionally set a different compose project name. It should match the compose project name on your host.",
        },
      },
    },
    {
      label: "Ignore Services",
      labelHidden: true,
      components: {
        ignore_services: (values, set) => (
          <ConfigList
            label="Ignore Services"
            description="If your compose file has init services that exit early, ignore them here so your stack will report the correct health."
            field="ignore_services"
            values={values ?? []}
            set={set}
            disabled={disabled}
            placeholder="Input service name"
          />
        ),
      },
    },
    {
      label: "Pull Images",
      labelHidden: true,
      components: {
        registry_provider: (provider, set) => {
          return (
            <ProviderSelectorConfig
              account_type="docker"
              selected={provider}
              disabled={disabled}
              onSelect={(registry_provider) => set({ registry_provider })}
            />
          );
        },
        registry_account: (value, set) => {
          const server_id = update.server_id || config.server_id;
          const provider = update.registry_provider ?? config.registry_provider;
          if (!provider) {
            return null;
          }
          return (
            <AccountSelectorConfig
              id={server_id}
              type={server_id ? "Server" : "None"}
              account_type="docker"
              provider={provider}
              selected={value}
              onSelect={(registry_account) => set({ registry_account })}
              disabled={disabled}
              placeholder="None"
            />
          );
        },
        auto_pull: {
          label: "Pre Pull Images",
          description:
            "Ensure 'docker compose pull' is run before redeploying the Stack. Otherwise, use 'pull_policy' in docker compose file.",
        },
      },
    },
    {
      label: "Build Images",
      labelHidden: true,
      components: {
        run_build: {
          label: "Pre Build Images",
          description:
            "Ensure 'docker compose build' is run before redeploying the Stack. Otherwise, can use '--build' as an Extra Arg.",
        },
        build_extra_args: (value, set) =>
          run_build && (
            <ConfigItem
              label="Build Extra Args"
              description="Add extra args inserted after 'docker compose build'"
            >
              {!disabled && (
                <AddExtraArgMenu
                  type="StackBuild"
                  onSelect={(suggestion) =>
                    set({
                      build_extra_args: [
                        ...(update.build_extra_args ??
                          config.build_extra_args ??
                          []),
                        suggestion,
                      ],
                    })
                  }
                  disabled={disabled}
                />
              )}
              <InputList
                field="build_extra_args"
                values={value ?? []}
                set={set}
                disabled={disabled}
                placeholder="--extra-arg=value"
              />
            </ConfigItem>
          ),
      },
    },
  ];

  if (mode === undefined) {
    components = {
      general: [server_component, choose_mode],
    };
  } else if (mode === "Files On Server") {
    components = {
      general: [
        server_component,
        {
          label: "Files",
          labelHidden: true,
          components: {
            run_directory: {
              label: "Run Directory",
              description:
                "Set the working directory when running the compose up command. Usually is the parent folder of the compose files.",
              placeholder: "/path/to/folder",
            },
            file_paths: (value, set) => (
              <ConfigList
                label="File Paths"
                description="Add files to include using 'docker compose -f'. If empty, uses 'compose.yaml'. Relative to 'Run Directory'."
                field="file_paths"
                values={value ?? []}
                set={set}
                disabled={disabled}
                placeholder="compose.yaml"
              />
            ),
          },
        },
        ...general_common,
      ],
      advanced,
    };
  } else if (mode === "Git Repo") {
    components = {
      general: [server_component, ...general_common],
    };
  } else if (mode === "UI Defined") {
    components = {
      general: [
        server_component,
        {
          label: "Compose File",
          description:
            "Manage the file contents here, or use a git repo / files on host option.",
          actions: (
            <ShowHideButton
              show={show.file}
              setShow={(file) => setShow({ ...show, file })}
            />
          ),
          contentHidden: !show.file,
          components: {
            file_contents: (file_contents, set) => {
              const show_default =
                !file_contents &&
                update.file_contents === undefined &&
                !(update.repo ?? config.repo);
              return (
                <MonacoEditor
                  value={
                    show_default ? DEFAULT_STACK_FILE_CONTENTS : file_contents
                  }
                  onValueChange={(file_contents) => set({ file_contents })}
                  language="yaml"
                />
              );
            },
          },
        },
        ...general_common,
      ],
    };
  }

  return (
    <Config
      resource_id={id}
      resource_type="Stack"
      titleOther={titleOther}
      disabled={disabled}
      config={config}
      update={update}
      set={set}
      onSave={async () => {
        await mutateAsync({ id, config: update });
      }}
      components={components}
    />
  );
};

const DEFAULT_STACK_FILE_CONTENTS = `## 🦎 Hello Komodo 🦎
services:
  hello_world:
    image: hello-world
    # networks:
    #   - default
    # ports:
    #   - 3000:3000
    # volumes:
    #   - data:/data

# networks:
#   default: {}

# volumes:
#   data:
`;

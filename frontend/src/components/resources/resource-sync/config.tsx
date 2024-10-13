import { Config, ConfigComponent } from "@components/config";
import {
  AccountSelectorConfig,
  ConfigItem,
  ConfigList,
  ProviderSelectorConfig,
} from "@components/config/util";
import { useInvalidate, useLocalStorage, useRead, useWrite } from "@lib/hooks";
import { Types } from "@komodo/client";
import { ReactNode, useState } from "react";
import { CopyGithubWebhook } from "../common";
import { useToast } from "@ui/use-toast";
import { text_color_class_by_intention } from "@lib/color";
import { ConfirmButton, ShowHideButton } from "@components/util";
import { Ban, CirclePlus } from "lucide-react";
import { MonacoEditor } from "@components/monaco";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

type SyncMode = "UI Defined" | "Files On Server" | "Git Repo" | undefined;
const SYNC_MODES: SyncMode[] = ["UI Defined", "Files On Server", "Git Repo"];

function getSyncMode(
  update: Partial<Types.ResourceSyncConfig>,
  config: Types.ResourceSyncConfig
): SyncMode {
  if (update.files_on_host ?? config.files_on_host) return "Files On Server";
  if (update.repo ?? config.repo) return "Git Repo";
  if (update.file_contents ?? config.file_contents) return "UI Defined";
  return undefined;
}

export const ResourceSyncConfig = ({
  id,
  titleOther,
}: {
  id: string;
  titleOther: ReactNode;
}) => {
  const [show, setShow] = useLocalStorage(`sync-${id}-show`, {
    file: true,
    git: true,
    webhooks: true,
  });
  const perms = useRead("GetPermissionLevel", {
    target: { type: "ResourceSync", id },
  }).data;
  const config = useRead("GetResourceSync", { sync: id }).data?.config;
  const webhooks = useRead("GetSyncWebhooksEnabled", { sync: id }).data;
  const global_disabled =
    useRead("GetCoreInfo", {}).data?.ui_write_disabled ?? false;
  const [update, set] = useState<Partial<Types.ResourceSyncConfig>>({});
  const { mutateAsync } = useWrite("UpdateResourceSync");

  if (!config) return null;

  const disabled = global_disabled || perms !== Types.PermissionLevel.Write;

  const mode = getSyncMode(update, config);
  const managed = update.managed ?? config.managed;

  const setMode = (mode: SyncMode) => {
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
          "# Initialize the sync to import your current resources.\n",
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
    false | ConfigComponent<Types.ResourceSyncConfig>[] | undefined
  > = {};

  const choose_mode: ConfigComponent<Types.ResourceSyncConfig> = {
    label: "Choose Mode",
    labelHidden: true,
    components: {
      file_contents: () => {
        return (
          <ConfigItem
            label="Choose Mode"
            description="Will the file contents be defined in UI, stored on the server, or pulled from a git repo?"
          >
            <Select
              value={mode}
              onValueChange={(mode) => setMode(mode as SyncMode)}
              disabled={disabled}
            >
              <SelectTrigger
                className="w-[200px] capitalize"
                disabled={disabled}
              >
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                {SYNC_MODES.map((mode) => (
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

  const match_tags: ConfigComponent<Types.ResourceSyncConfig> = {
    label: "Match Tags",
    components: {
      match_tags: (values, set) => (
        <ConfigList
          label="Match Tags"
          addLabel="Add Tag"
          description="Only sync resources matching these tags."
          field="match_tags"
          values={values ?? []}
          set={set}
          disabled={disabled}
          placeholder="Input tag name"
        />
      ),
    },
  };

  if (mode === undefined) {
    components = {
      "": [choose_mode],
    };
  } else if (mode === "Files On Server") {
    components = {
      "": [
        {
          label: "General",
          components: {
            resource_path: (values, set) => (
              <ConfigList
                label="Resource Paths"
                addLabel="Add Path"
                description="Add '.toml' files or folders to the sync. Relative to '/syncs/{sync_name}'."
                field="resource_path"
                values={values ?? []}
                set={set}
                disabled={disabled}
                placeholder="Input resource path"
              />
            ),
            delete: !managed && {
              label: "Delete Unmatched Resources",
              description:
                "Executions will delete any resources not found in the resource files. Only use this when using one sync for everything.",
            },
            managed: {
              label: "Managed",
              description:
                "Enabled managed mode / the 'Commit' button. Commit is the 'reverse' of Execute, and will update the sync file with your configs updated in the UI.",
            },
          },
        },
        match_tags,
      ],
    };
  } else if (mode === "Git Repo") {
    components = {
      "": [
        {
          label: "Source",
          contentHidden: !show.git,
          actions: (
            <ShowHideButton
              show={show.git}
              setShow={(git) => setShow({ ...show, git })}
            />
          ),
          components: {
            git_provider: (provider: string | undefined, set) => {
              const https = update.git_https ?? config.git_https;
              return (
                <ProviderSelectorConfig
                  account_type="git"
                  selected={provider}
                  disabled={disabled}
                  onSelect={(git_provider) => set({ git_provider })}
                  https={https}
                  onHttpsSwitch={() => set({ git_https: !https })}
                />
              );
            },
            git_account: (value: string | undefined, set) => {
              return (
                <AccountSelectorConfig
                  account_type="git"
                  type="None"
                  provider={update.git_provider ?? config.git_provider}
                  selected={value}
                  onSelect={(git_account) => set({ git_account })}
                  disabled={disabled}
                  placeholder="None"
                />
              );
            },
            repo: {
              placeholder: "Enter repo",
              description:
                "The repo path on the provider. {namespace}/{repo_name}",
            },
            branch: {
              placeholder: "Enter branch",
              description: "Select a custom branch, or default to 'main'.",
            },
            commit: {
              label: "Commit Hash",
              placeholder: "Input commit hash",
              description:
                "Optional. Switch to a specific commit hash after cloning the branch.",
            },
          },
        },
        {
          label: "General",
          components: {
            resource_path: (values, set) => (
              <ConfigList
                label="Resource Paths"
                addLabel="Add Path"
                description="Add '.toml' files or folders to the sync. Relative to the root of the repo."
                field="resource_path"
                values={values ?? []}
                set={set}
                disabled={disabled}
                placeholder="Input resource path"
              />
            ),
            delete: !managed && {
              label: "Delete Unmatched Resources",
              description:
                "Executions will delete any resources not found in the resource files. Only use this when using one sync for everything.",
            },
            managed: {
              label: "Managed",
              description:
                "Enabled managed mode / the 'Commit' button. Commit is the 'reverse' of Execute, and will update the sync file with your configs updated in the UI.",
            },
          },
        },
        match_tags,
        {
          label: "Git Webhooks",
          description:
            "Configure your repo provider to send webhooks to Komodo",
          contentHidden: !show.webhooks,
          actions: (
            <ShowHideButton
              show={show.webhooks}
              setShow={(webhooks) => setShow({ ...show, webhooks })}
            />
          ),
          components: {
            ["Guard" as any]: () => {
              if (update.branch ?? config.branch) {
                return null;
              }
              return (
                <ConfigItem label="Configure Branch">
                  <div>Must configure Branch before webhooks will work.</div>
                </ConfigItem>
              );
            },
            ["refresh" as any]: () => (
              <ConfigItem
                label="Refresh Pending"
                description="Trigger an update of the pending sync cache, to display the changes in the UI on push."
              >
                <CopyGithubWebhook path={`/sync/${id}/refresh`} />
              </ConfigItem>
            ),
            ["sync" as any]: () => (
              <ConfigItem
                label="Execute Sync"
                description="Trigger an execution of the sync on push."
              >
                <CopyGithubWebhook path={`/sync/${id}/sync`} />
              </ConfigItem>
            ),
            webhook_enabled: webhooks !== undefined && !webhooks.managed,
            webhook_secret: {
              description:
                "Provide a custom webhook secret for this resource, or use the global default.",
              placeholder: "Input custom secret",
            },
            ["managed" as any]: () => {
              const inv = useInvalidate();
              const { toast } = useToast();
              const { mutate: createWebhook, isPending: createPending } =
                useWrite("CreateSyncWebhook", {
                  onSuccess: () => {
                    toast({ title: "Webhook Created" });
                    inv(["GetSyncWebhooksEnabled", { sync: id }]);
                  },
                });
              const { mutate: deleteWebhook, isPending: deletePending } =
                useWrite("DeleteSyncWebhook", {
                  onSuccess: () => {
                    toast({ title: "Webhook Deleted" });
                    inv(["GetSyncWebhooksEnabled", { sync: id }]);
                  },
                });
              if (!webhooks || !webhooks.managed) return;
              return (
                <ConfigItem label="Manage Webhook">
                  {webhooks.sync_enabled && (
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        Incoming webhook is{" "}
                        <div className={text_color_class_by_intention("Good")}>
                          ENABLED
                        </div>
                        and will trigger
                        <div
                          className={text_color_class_by_intention("Neutral")}
                        >
                          SYNC EXECUTION
                        </div>
                      </div>
                      <ConfirmButton
                        title="Disable"
                        icon={<Ban className="w-4 h-4" />}
                        variant="destructive"
                        onClick={() =>
                          deleteWebhook({
                            sync: id,
                            action: Types.SyncWebhookAction.Sync,
                          })
                        }
                        loading={deletePending}
                        disabled={disabled || deletePending}
                      />
                    </div>
                  )}
                  {!webhooks.sync_enabled && webhooks.refresh_enabled && (
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        Incoming webhook is{" "}
                        <div className={text_color_class_by_intention("Good")}>
                          ENABLED
                        </div>
                        and will trigger
                        <div
                          className={text_color_class_by_intention("Neutral")}
                        >
                          PENDING REFRESH
                        </div>
                      </div>
                      <ConfirmButton
                        title="Disable"
                        icon={<Ban className="w-4 h-4" />}
                        variant="destructive"
                        onClick={() =>
                          deleteWebhook({
                            sync: id,
                            action: Types.SyncWebhookAction.Refresh,
                          })
                        }
                        loading={deletePending}
                        disabled={disabled || deletePending}
                      />
                    </div>
                  )}
                  {!webhooks.sync_enabled && !webhooks.refresh_enabled && (
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        Incoming webhook is{" "}
                        <div
                          className={text_color_class_by_intention("Critical")}
                        >
                          DISABLED
                        </div>
                      </div>
                      <ConfirmButton
                        title="Enable Refresh"
                        icon={<CirclePlus className="w-4 h-4" />}
                        onClick={() =>
                          createWebhook({
                            sync: id,
                            action: Types.SyncWebhookAction.Refresh,
                          })
                        }
                        loading={createPending}
                        disabled={disabled || createPending}
                      />
                      <ConfirmButton
                        title="Enable Sync"
                        icon={<CirclePlus className="w-4 h-4" />}
                        onClick={() =>
                          createWebhook({
                            sync: id,
                            action: Types.SyncWebhookAction.Sync,
                          })
                        }
                        loading={createPending}
                        disabled={disabled || createPending}
                      />
                    </div>
                  )}
                </ConfigItem>
              );
            },
          },
        },
      ],
    };
  } else if (mode === "UI Defined") {
    components = {
      "": [
        {
          label: "Resource File",
          description:
            "Manage the resource file contents here, or use a git repo / the files on host option.",
          actions: (
            <ShowHideButton
              show={show.file}
              setShow={(file) => setShow((show) => ({ ...show, file }))}
            />
          ),
          contentHidden: !show.file,
          components: {
            file_contents: (file_contents, set) => {
              return (
                <MonacoEditor
                  value={
                    file_contents ||
                    "# Initialize the sync to import your current resources.\n"
                  }
                  onValueChange={(file_contents) => set({ file_contents })}
                  language="toml"
                />
              );
            },
          },
        },
        {
          label: "General",
          components: {
            delete: !managed && {
              label: "Delete Unmatched Resources",
              description:
                "Executions will delete any resources not found in the resource files. Only use this when using one sync for everything.",
            },
            managed: {
              label: "Managed",
              description:
                "Enabled managed mode / the 'Commit' button. Commit is the 'reverse' of Execute, and will update the sync file with your configs updated in the UI.",
            },
          },
        },
        match_tags,
      ],
    };
  }

  return (
    <Config
      resource_id={id}
      resource_type="ResourceSync"
      titleOther={titleOther}
      disabled={disabled}
      config={config}
      update={update}
      set={set}
      onSave={async () => {
        await mutateAsync({ id, config: update });
      }}
      components={components}
      file_contents_language="toml"
    />
  );
};

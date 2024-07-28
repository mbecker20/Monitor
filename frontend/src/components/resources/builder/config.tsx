import { Config } from "@components/config";
import { DoubleInput, InputList } from "@components/config/util";
import { useRead, useWrite } from "@lib/hooks";
import { Types } from "@monitor/client";
import { useState } from "react";
import { ResourceSelector } from "../common";
import { Button } from "@ui/button";
import { PlusCircle } from "lucide-react";

export const BuilderConfig = ({ id }: { id: string }) => {
  const config = useRead("GetBuilder", { builder: id }).data?.config;
  if (config?.type === "Aws") return <AwsBuilderConfig id={id} />;
  if (config?.type === "Server") return <ServerBuilderConfig id={id} />;
};

const AwsBuilderConfig = ({ id }: { id: string }) => {
  const perms = useRead("GetPermissionLevel", {
    target: { type: "Builder", id },
  }).data;
  const config = useRead("GetBuilder", { builder: id }).data?.config
    ?.params as Types.AwsBuilderConfig;
  const global_disabled =
    useRead("GetCoreInfo", {}).data?.ui_write_disabled ?? false;
  const [update, set] = useState<Partial<Types.AwsBuilderConfig>>({});
  const { mutateAsync } = useWrite("UpdateBuilder");
  if (!config) return null;

  const disabled = global_disabled || perms !== Types.PermissionLevel.Write;

  return (
    <Config
      disabled={disabled}
      config={config}
      update={update}
      set={set}
      onSave={async () => {
        await mutateAsync({ id, config: { type: "Aws", params: update } });
      }}
      components={{
        general: [
          {
            label: "General",
            components: {
              region: true,
              instance_type: true,
              volume_gb: true,
              ami_id: true,
              subnet_id: true,
              key_pair_name: true,
              assign_public_ip: true,
              use_public_ip: true,
              port: true,
            },
          },
          {
            label: "Security Group Ids",
            contentHidden:
              (update.security_group_ids ?? config.security_group_ids)
                ?.length === 0,
            actions: !disabled && (
              <Button
                variant="secondary"
                onClick={() =>
                  set((update) => ({
                    ...update,
                    security_group_ids: [
                      ...(update.security_group_ids ??
                        config.security_group_ids ??
                        []),
                      "",
                    ],
                  }))
                }
                className="flex items-center gap-2 w-[200px]"
              >
                <PlusCircle className="w-4 h-4" />
                Add Security Group Id
              </Button>
            ),
            components: {
              security_group_ids: (values, set) => (
                <InputList
                  field="security_group_ids"
                  values={values}
                  set={set}
                  disabled={disabled}
                  placeholder="Security Group Id"
                />
              ),
            },
          },
          {
            label: "Github Accounts",
            contentHidden:
              (update.git_accounts ?? config.git_accounts)?.length === 0,
            actions: !disabled && (
              <Button
                variant="secondary"
                onClick={() =>
                  set((update) => ({
                    ...update,
                    git_accounts: [
                      ...(update.git_accounts ?? config.git_accounts ?? []),
                      { provider: "github.com", username: "" },
                    ],
                  }))
                }
                className="flex items-center gap-2 w-[200px]"
              >
                <PlusCircle className="w-4 h-4" />
                Add Git Account
              </Button>
            ),
            components: {
              git_accounts: (accounts, set) =>
                accounts && (
                  <AccountsConfig
                    type="git"
                    accounts={accounts}
                    set={set}
                    disabled={disabled}
                  />
                ),
            },
          },
          {
            label: "Docker Accounts",
            contentHidden:
              (update.docker_accounts ?? config.docker_accounts)?.length === 0,
            actions: !disabled && (
              <Button
                variant="secondary"
                onClick={() =>
                  set((update) => ({
                    ...update,
                    docker_accounts: [
                      ...(update.docker_accounts ??
                        config.docker_accounts ??
                        []),
                      { provider: "docker.io", username: "" },
                    ],
                  }))
                }
                className="flex items-center gap-2 w-[200px]"
              >
                <PlusCircle className="w-4 h-4" />
                Add Docker Account
              </Button>
            ),
            components: {
              docker_accounts: (accounts, set) =>
                accounts && (
                  <AccountsConfig
                    type="docker"
                    accounts={accounts}
                    set={set}
                    disabled={disabled}
                  />
                ),
            },
          },
        ],
      }}
    />
  );
};

const ServerBuilderConfig = ({ id }: { id: string }) => {
  const perms = useRead("GetPermissionLevel", {
    target: { type: "Builder", id },
  }).data;
  const config = useRead("GetBuilder", { builder: id }).data?.config;
  const [update, set] = useState<Partial<Types.ServerBuilderConfig>>({});
  const { mutateAsync } = useWrite("UpdateBuilder");
  if (!config) return null;

  const disabled = perms !== Types.PermissionLevel.Write;

  return (
    <Config
      disabled={disabled}
      config={config.params as Types.ServerBuilderConfig}
      update={update}
      set={set}
      onSave={async () => {
        await mutateAsync({ id, config: { type: "Server", params: update } });
      }}
      components={{
        general: [
          {
            label: "General",
            components: {
              server_id: (id, set) => (
                <div className="flex justify-between items-center border-b pb-4">
                  Select Server
                  <ResourceSelector
                    type="Server"
                    selected={id}
                    onSelect={(server_id) => set({ server_id })}
                    disabled={disabled}
                  />
                </div>
              ),
            },
          },
        ],
      }}
    />
  );
};

export const AccountsConfig = ({
  accounts,
  type,
  set,
  disabled,
}: {
  accounts: Types.GitAccount[] | Types.DockerAccount[];
  type: "git" | "docker";
  set: (input: Partial<Types.AwsBuilderConfig>) => void;
  disabled: boolean;
}) => {
  const field = `${type}_accounts`;
  const example_domain = type === "git" ? "github.com" : "docker.io";
  return (
    <div className="py-2 w-full flex justify-end">
      <DoubleInput
        disabled={disabled}
        inputClassName="w-[300px] 2xl:w-[400px] max-w-full"
        containerClassName="w-fit"
        values={accounts}
        leftval="provider"
        leftpl={`Provider Domain (ex. ${example_domain})`}
        rightval="username"
        rightpl="Account Username"
        onLeftChange={(provider, i) => {
          accounts[i].provider = provider;
          set({ [field]: [...accounts] });
        }}
        onRightChange={(username, i) => {
          accounts[i].username = username;
          set({ [field]: [...accounts] });
        }}
        onRemove={(idx) =>
          set({ [field]: [...accounts.filter((_, i) => i !== idx)] })
        }
      />
    </div>
  );
};

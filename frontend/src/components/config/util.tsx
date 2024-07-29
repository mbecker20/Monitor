/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRead } from "@lib/hooks";
import { Types } from "@monitor/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@ui/select";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Switch } from "@ui/switch";
import {
  CheckCircle,
  MinusCircle,
  PlusCircle,
  Save,
  SearchX,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { cn, filterBySplit } from "@lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { snake_case_to_upper_space_case } from "@lib/formatting";
import { ConfirmButton, TextUpdateMenu } from "@components/util";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";

export const ConfigItem = ({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) => (
  <>
    <div
      className={cn(
        "flex justify-between items-center min-h-[60px]",
        className
      )}
    >
      {label && <div>{snake_case_to_upper_space_case(label)}</div>}
      {children}
    </div>
    <div className="w-full h-0 border-b last:hidden" />
  </>
);

export const ConfigInput = ({
  label,
  value,
  disabled,
  placeholder,
  onChange,
  onBlur,
}: {
  label: string;
  value: string | number | undefined;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}) => (
  <ConfigItem label={label}>
    <Input
      className="max-w-[75%] lg:max-w-[400px]"
      type={typeof value === "number" ? "number" : undefined}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      onBlur={(e) => onBlur && onBlur(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  </ConfigItem>
);

export const ConfigSwitch = ({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: boolean | undefined;
  disabled: boolean;
  onChange: (value: boolean) => void;
}) => (
  <ConfigItem label={label}>
    <Switch checked={value} onCheckedChange={onChange} disabled={disabled} />
  </ConfigItem>
);

export const DoubleInput = <
  T extends object,
  K extends keyof T,
  L extends T[K] extends string | number | undefined ? K : never,
  R extends T[K] extends string | number | undefined ? K : never
>({
  disabled,
  values,
  leftval,
  leftpl,
  rightval,
  rightpl,
  // addName,
  onLeftChange,
  onRightChange,
  // onAdd,
  onRemove,
  containerClassName,
  inputClassName,
}: {
  disabled: boolean;
  values: T[] | undefined;
  leftval: L;
  leftpl: string;
  rightval: R;
  rightpl: string;
  // addName: string;
  onLeftChange: (value: T[L], i: number) => void;
  onRightChange: (value: T[R], i: number) => void;
  // onAdd: () => void;
  onRemove: (i: number) => void;
  containerClassName?: string;
  inputClassName?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-4", containerClassName)}>
      {values?.map((value, i) => (
        <div
          className="flex items-center justify-between gap-4 flex-wrap"
          key={i}
        >
          <Input
            className={inputClassName}
            value={value[leftval] as any}
            placeholder={leftpl}
            onChange={(e) => onLeftChange(e.target.value as T[L], i)}
            disabled={disabled}
          />
          :
          <Input
            className={inputClassName}
            value={value[rightval] as any}
            placeholder={rightpl}
            onChange={(e) => onRightChange(e.target.value as T[R], i)}
            disabled={disabled}
          />
          {!disabled && (
            <Button variant="secondary" onClick={() => onRemove(i)}>
              <MinusCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      {/* {!disabled && (
        <Button
          variant="secondary"
          className="flex items-center gap-2 w-[200px] place-self-end"
          onClick={onAdd}
        >
          <PlusCircle className="w-4 h-4" />
          Add {addName}
        </Button>
      )} */}
    </div>
  );
};

export const ProviderSelector = ({
  disabled,
  account_type,
  selected,
  onSelect,
  showCustom = true,
}: {
  disabled: boolean;
  account_type: "git" | "docker";
  selected: string | undefined;
  onSelect: (provider: string) => void;
  showCustom?: boolean;
}) => {
  const request =
    account_type === "git" ? "ListGitProviders" : "ListDockerRegistries";
  const providers = useRead(request, {}).data;
  const [customMode, setCustomMode] = useState(false);

  if (customMode) {
    return (
      <Input
        placeholder="Input custom provider domain"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="max-w-[75%] lg:max-w-[400px]"
        onBlur={() => setCustomMode(false)}
        autoFocus
      />
    );
  }

  return (
    <Select
      value={selected}
      onValueChange={(value) => {
        if (value === "Custom") {
          onSelect("");
          setCustomMode(true);
        } else {
          onSelect(value);
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className="w-full lg:w-[200px] max-w-[50%]"
        disabled={disabled}
      >
        <SelectValue placeholder="Select Provider" />
      </SelectTrigger>
      <SelectContent>
        {providers?.map(
          (provider: Types.GitProvider | Types.DockerRegistry) => (
            <SelectItem key={provider.domain} value={provider.domain}>
              {provider.domain}
            </SelectItem>
          )
        )}
        {providers !== undefined &&
          selected &&
          !providers
            .map(
              (provider: Types.GitProvider | Types.DockerRegistry) =>
                provider.domain
            )
            .includes(selected) && (
            <SelectItem value={selected}>{selected}</SelectItem>
          )}
        {showCustom && <SelectItem value={"Custom"}>Custom</SelectItem>}
      </SelectContent>
    </Select>
  );
};

export const ProviderSelectorConfig = (params: {
  disabled: boolean;
  account_type: "git" | "docker";
  selected: string | undefined;
  onSelect: (id: string) => void;
}) => {
  return (
    <ConfigItem label={`${params.account_type} Provider`}>
      <ProviderSelector {...params} />
    </ConfigItem>
  );
};

export const AccountSelector = ({
  disabled,
  id,
  type,
  account_type,
  provider,
  selected,
  onSelect,
}: {
  disabled: boolean;
  type: "Server" | "Builder" | "None";
  id?: string;
  account_type: "git" | "docker";
  provider: string;
  selected: string | undefined;
  onSelect: (id: string) => void;
}) => {
  const request =
    account_type === "git" ? "ListGitProviders" : "ListDockerRegistries";
  const params =
    type === "None" ? {} : { target: id ? { type, id } : undefined };
  const providers = useRead(request, params).data?.filter(
    (_provider) => _provider.domain === provider
  );

  const _accounts = new Set<string>();
  for (const provider of providers ?? []) {
    for (const account of provider.accounts ?? []) {
      _accounts.add(account.username);
    }
  }
  const accounts = [..._accounts];
  accounts.sort();
  return (
    <Select
      value={selected}
      onValueChange={(value) => {
        onSelect(value === "Empty" ? "" : value);
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className="w-full lg:w-[200px] max-w-[50%]"
        disabled={disabled}
      >
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"Empty"}>None</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account} value={account}>
            {account}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const AccountSelectorConfig = (params: {
  disabled: boolean;
  id?: string;
  type: "Server" | "Builder" | "None";
  account_type: "git" | "docker";
  provider: string;
  selected: string | undefined;
  onSelect: (id: string) => void;
  placeholder: string;
}) => {
  return (
    <ConfigItem label="Account">
      <AccountSelector {...params} />
    </ConfigItem>
  );
};

export const AwsEcrLabelSelector = ({
  disabled,
  selected,
  onSelect,
}: {
  disabled: boolean;
  selected: string | undefined;
  onSelect: (id: string) => void;
}) => {
  const labels = useRead("ListAwsEcrLabels", {}).data;
  return (
    <Select
      value={selected}
      onValueChange={(value) => {
        onSelect(value === "Empty" ? "" : value);
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className="w-full lg:w-[200px] max-w-[50%]"
        disabled={disabled}
      >
        <SelectValue placeholder="Select Ecr Config" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"Empty"}>None</SelectItem>
        {labels?.map((label: string) => (
          <SelectItem key={label} value={label}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const InputList = <T extends { [key: string]: unknown }>({
  field,
  values,
  disabled,
  set,
  placeholder,
  className,
}: {
  field: keyof T;
  values: string[];
  disabled: boolean;
  set: (update: Partial<T>) => void;
  placeholder?: string;
  className?: string;
}) => (
  <div className="flex justify-end w-full">
    <div className="flex flex-col gap-4 w-fit">
      {values.map((arg, i) => (
        <div className="w-full flex gap-4" key={i}>
          <Input
            placeholder={placeholder}
            value={arg}
            onChange={(e) => {
              values[i] = e.target.value;
              set({ [field]: [...values] } as Partial<T>);
            }}
            disabled={disabled}
            className={cn("w-[400px] max-w-full", className)}
          />
          {!disabled && (
            <Button
              variant="secondary"
              onClick={() =>
                set({
                  [field]: [...values.filter((_, idx) => idx !== i)],
                } as Partial<T>)
              }
            >
              <MinusCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  </div>
);

interface ConfirmUpdateProps {
  content: string;
  onConfirm: () => void;
  disabled: boolean;
}

export const ConfirmUpdate = ({
  content,
  onConfirm,
  disabled,
}: ConfirmUpdateProps) => {
  const [open, set] = useState(false);
  return (
    <Dialog open={open} onOpenChange={set}>
      <DialogTrigger asChild>
        <Button
          onClick={() => set(true)}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Update</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 my-4">
          New configuration to be applied:
          <pre className="h-[300px] overflow-auto">{content}</pre>
        </div>
        <DialogFooter>
          <ConfirmButton
            title="Update"
            icon={<CheckCircle className="w-4 h-4" />}
            onClick={() => {
              onConfirm();
              set(false);
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const SystemCommand = ({
  value,
  disabled,
  set,
}: {
  value?: Types.SystemCommand;
  disabled: boolean;
  set: (value: Types.SystemCommand) => void;
}) => {
  return (
    <div className="w-full flex justify-end flex-wrap">
      <div className="flex items-center gap-4">
        <div className="grid gap-2">
          <div className="text-muted-foreground">Path:</div>
          <Input
            placeholder="Command working directory"
            value={value?.path}
            className="w-[200px] lg:w-[300px]"
            onChange={(e) => set({ ...(value || {}), path: e.target.value })}
            disabled={disabled}
          />
        </div>
        <div className="grid gap-2">
          <div className="text-muted-foreground">Command:</div>
          <TextUpdateMenu
            title="Update Command"
            placeholder="Set shell command"
            value={value?.command}
            onUpdate={(command) => set({ ...(value || {}), command })}
            triggerClassName="w-[200px] lg:w-[300px] xl:w-[400px]"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export const AddExtraArgMenu = ({
  onSelect,
  type,
  disabled,
}: {
  onSelect: (suggestion: string) => void;
  type: "Deployment" | "Build";
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const suggestions = useRead(`ListCommon${type}ExtraArgs`, {}).data ?? [];

  const filtered = filterBySplit(suggestions, search, (item) => item);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2 w-[200px]"
          disabled={disabled}
        >
          <PlusCircle className="w-4 h-4" /> Add Extra Arg
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-h-[400px] p-0" align="end">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search suggestions"
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty className="flex justify-evenly items-center">
              No Suggestions Found
              <SearchX className="w-3 h-3" />
            </CommandEmpty>

            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onSelect("");
                  setOpen(false);
                }}
                className="w-full cursor-pointer"
              >
                Empty Extra Arg
              </CommandItem>

              {filtered?.map((suggestion) => (
                <CommandItem
                  key={suggestion}
                  onSelect={() => {
                    onSelect(suggestion);
                    setOpen(false);
                  }}
                  className="w-full overflow-hidden overflow-ellipsis cursor-pointer"
                >
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const ImageRegistryConfig = ({
  registry: _registry,
  setRegistry,
  disabled,
  resource_id,
  registry_types,
}: {
  registry: Types.ImageRegistry | undefined;
  setRegistry: (registry: Types.ImageRegistry) => void;
  disabled: boolean;
  // For builds, its builder id. For servers, its server id.
  resource_id?: string;
  registry_types?: Types.ImageRegistry["type"][];
}) => {
  const registry = _registry ?? default_registry_config("None");

  const provider = useRead("ListDockerRegistries", {
    target: resource_id ? { type: "Builder", id: resource_id } : undefined,
  }).data?.find((provider) => {
    if (registry.type === "Standard") {
      return provider.domain === registry.params.domain;
    } else {
      return false;
    }
  });

  if (registry.type === "None") {
    return (
      <ConfigItem label="Image Registry">
        <RegistryTypeSelector
          registry={registry}
          setRegistry={setRegistry}
          disabled={disabled}
          registry_types={registry_types}
        />
      </ConfigItem>
    );
  }
  if (registry.type === "AwsEcr") {
    return (
      <ConfigItem label="Image Registry">
        <div className="flex items-center justify-stretch gap-4">
          <AwsEcrLabelSelector
            selected={registry.params}
            onSelect={(label) =>
              setRegistry({
                type: "AwsEcr",
                params: label,
              })
            }
            disabled={disabled}
          />
          <RegistryTypeSelector
            registry={registry}
            setRegistry={setRegistry}
            disabled={disabled}
            registry_types={registry_types}
          />
        </div>
      </ConfigItem>
    );
  }

  const organizations = provider?.organizations ?? [];

  return (
    <>
      <ConfigItem label="Image Registry">
        <div className="flex items-center justify-stretch gap-4">
          <ProviderSelector
            disabled={disabled}
            account_type="docker"
            selected={registry.params?.domain}
            onSelect={(domain) =>
              setRegistry({
                ...registry,
                params: { ...registry.params, domain },
              })
            }
            showCustom={false}
          />
          <RegistryTypeSelector
            registry={registry}
            setRegistry={setRegistry}
            disabled={disabled}
            registry_types={registry_types}
          />
        </div>
      </ConfigItem>
      {organizations.length > 0 && (
        <ConfigItem label="Organization">
          <OrganizationSelector
            organizations={organizations}
            selected={registry.params?.organization}
            set={(organization) =>
              setRegistry({
                ...registry,
                params: { ...registry.params, organization },
              })
            }
            disabled={disabled}
          />
        </ConfigItem>
      )}
      <ConfigItem label="Account">
        <AccountSelector
          id={resource_id}
          type="Builder"
          account_type="docker"
          provider={registry.params.domain!}
          selected={registry.params.account}
          onSelect={(account) =>
            setRegistry({
              ...registry,
              params: { ...registry.params, account },
            })
          }
          disabled={disabled}
        />
      </ConfigItem>
    </>
  );
};

const REGISTRY_TYPES: Types.ImageRegistry["type"][] = [
  "None",
  "Standard",
  "AwsEcr",
];

const RegistryTypeSelector = ({
  registry,
  setRegistry,
  registry_types = REGISTRY_TYPES,
  disabled,
}: {
  registry: Types.ImageRegistry;
  setRegistry: (registry: Types.ImageRegistry) => void;
  registry_types?: Types.ImageRegistry["type"][];
  disabled: boolean;
}) => {
  return (
    <Select
      value={registry.type}
      onValueChange={(type: Types.ImageRegistry["type"]) => {
        setRegistry(default_registry_config(type));
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className="w-full lg:w-[200px] max-w-[50%]"
        disabled={disabled}
      >
        <SelectValue placeholder="Select Registry" />
      </SelectTrigger>
      <SelectContent align="end">
        {registry_types.map((type) => {
          return (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

const OrganizationSelector = ({
  organizations,
  selected,
  set,
  disabled,
}: {
  organizations: string[];
  selected?: string;
  set: (org: string) => void;
  disabled: boolean;
}) => {
  if (organizations.length === 0) return null;
  return (
    <Select
      value={selected}
      onValueChange={(v) => set(v === "Empty" ? "" : v)}
      disabled={disabled}
    >
      <SelectTrigger
        className="w-full lg:w-[200px] max-w-[50%]"
        disabled={disabled}
      >
        <SelectValue placeholder="Select Organization" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"Empty"}>None</SelectItem>
        {organizations?.map((org) => (
          <SelectItem key={org} value={org}>
            {org}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const default_registry_config = (
  type: Types.ImageRegistry["type"]
): Types.ImageRegistry => {
  switch (type) {
    case "None":
      return { type, params: {} };
    case "AwsEcr":
      return { type, params: "" };
    case "Standard":
      return {
        type,
        params: { domain: "docker.io", account: "", organization: "" },
      };
  }
};

export const SecretSelector = ({
  keys,
  onSelect,
  type,
  disabled,
}: {
  keys: string[];
  onSelect: (key: string) => void;
  type: "Variable" | "Secret";
  disabled: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = filterBySplit(keys, search, (item) => item).sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="flex gap-2" disabled={disabled}>
          <PlusCircle className="w-4 h-4" />
          <div>Add {type}</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-h-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${type}s`}
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty className="flex justify-evenly items-center pt-2">
              {`No ${type}s Found`}
              <SearchX className="w-3 h-3" />
            </CommandEmpty>

            <CommandGroup>
              {filtered.map((key) => (
                <CommandItem
                  key={key}
                  onSelect={() => {
                    onSelect(key);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="p-1">{key}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const PermissionLevelSelector = ({
  level,
  onSelect,
}: {
  level: Types.PermissionLevel;
  onSelect: (level: Types.PermissionLevel) => void;
}) => {
  return (
    <Select
      value={level}
      onValueChange={(value) => onSelect(value as Types.PermissionLevel)}
    >
      <SelectTrigger className="w-32 capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-32">
        {Object.keys(Types.PermissionLevel).map((permission) => (
          <SelectItem
            value={permission}
            key={permission}
            className="capitalize"
          >
            {permission}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

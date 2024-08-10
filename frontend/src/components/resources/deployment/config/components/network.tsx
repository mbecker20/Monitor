import { ConfigItem } from "@components/config/util";
import { useRead } from "@lib/hooks";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useState } from "react";

export const NetworkModeSelector = ({
  server_id,
  selected,
  onSelect,
  disabled,
}: {
  server_id: string | undefined;
  selected: string | undefined;
  onSelect: (type: string) => void;
  disabled: boolean;
}) => {
  const _networks =
    useRead(
      "ListDockerNetworks",
      { server: server_id! },
      { enabled: !!server_id }
    )
      .data?.filter((n) => n.Name)
      .map((network) => network.Name) ?? [];
  const [customMode, setCustomMode] = useState(false);

  const networks =
    !selected || _networks.includes(selected)
      ? _networks
      : [..._networks, selected];

  return (
    <ConfigItem
      label="Network Mode"
      description="Choose the --network attached to container"
    >
      {customMode ? (
        <Input
          placeholder="Input custom network name"
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="max-w-[75%] lg:max-w-[400px]"
          onBlur={() => setCustomMode(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setCustomMode(false);
            }
          }}
          autoFocus
        />
      ) : (
        <Select
          value={selected || undefined}
          onValueChange={(value) => {
            if (value === "Custom") {
              setCustomMode(true);
              onSelect("");
            } else {
              onSelect(value);
            }
          }}
          disabled={disabled}
        >
          <SelectTrigger className="w-[200px]" disabled={disabled}>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {networks?.map((network) => (
              <SelectItem
                key={network}
                value={network!}
                className="cursor-pointer"
              >
                {network!}
              </SelectItem>
            ))}
            <SelectItem value="Custom" className="cursor-pointer">
              Custom
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </ConfigItem>
  );
};

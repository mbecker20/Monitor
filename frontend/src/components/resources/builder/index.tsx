import { NewLayout } from "@components/layouts";
import { useRead, useWrite } from "@lib/hooks";
import { Types } from "@komodo/client";
import { RequiredResourceComponents } from "@types";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Cloud, Bot, Factory } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BuilderConfig } from "./config";
import { DeleteResource, ResourceLink } from "../common";
import { BuilderTable } from "./table";

export const useBuilder = (id?: string) =>
  useRead("ListBuilders", {}, { refetchInterval: 5000 }).data?.find(
    (d) => d.id === id
  );

export const BuilderInstanceType = ({ id }: { id: string }) => {
  let info = useBuilder(id)?.info;
  if (info?.builder_type === "Server") {
    return (
      info.instance_type && (
        <ResourceLink type="Server" id={info.instance_type} />
      )
    );
  } else {
    return <>{info?.instance_type}</>;
  }
};

export const BuilderComponents: RequiredResourceComponents = {
  list_item: (id) => useBuilder(id),

  Description: () => <>Build on your servers, or single-use AWS instances.</>,

  Dashboard: () => {
    const builders_count = useRead("ListBuilders", {}).data?.length;
    return (
      <Link to="/builders/" className="w-full">
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Builders</CardTitle>
                <CardDescription>{builders_count} Total</CardDescription>
              </div>
              <Factory className="w-4 h-4" />
            </div>
          </CardHeader>
        </Card>
      </Link>
    );
  },

  New: () => {
    const nav = useNavigate();
    const { mutateAsync } = useWrite("CreateBuilder");
    const [name, setName] = useState("");
    const [type, setType] = useState<Types.BuilderConfig["type"]>();

    return (
      <NewLayout
        entityType="Builder"
        onSuccess={async () => {
          if (!type) return;
          const id = (await mutateAsync({ name, config: { type, params: {} } }))
            ._id?.$oid!;
          nav(`/builders/${id}`);
        }}
        enabled={!!name && !!type}
      >
        <div className="grid md:grid-cols-2 items-center">
          Name
          <Input
            placeholder="builder-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid md:grid-cols-2 items-center">
          Builder Type
          <Select
            value={type}
            onValueChange={(value) => setType(value as typeof type)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Aws">Aws</SelectItem>
                <SelectItem value="Server">Server</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </NewLayout>
    );
  },

  Table: ({ resources }) => (
    <BuilderTable builders={resources as Types.BuilderListItem[]} />
  ),

  Icon: () => <Factory className="w-4 h-4" />,
  BigIcon: () => <Factory className="w-8 h-8" />,

  Status: {},

  Info: {
    Provider: ({ id }) => (
      <div className="flex items-center gap-2">
        <Cloud className="w-4 h-4" />
        {useBuilder(id)?.info.builder_type}
      </div>
    ),
    InstanceType: ({ id }) => (
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4" />
        <BuilderInstanceType id={id} />
      </div>
    ),
  },

  Actions: {},

  Page: {},

  Config: BuilderConfig,

  DangerZone: ({ id }) => <DeleteResource type="Builder" id={id} />,
};

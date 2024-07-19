import { UserTargetPermissionsOnResourceTypes } from "@components/users/resource-type-permissions";
import { KeysTable } from "@components/keys/table";
import { Page, Section } from "@components/layouts";
import { PermissionsTable } from "@components/users/permissions-table";
import {
  CreateKeyForServiceUser,
  DeleteKeyForServiceUser,
} from "@components/users/service-api-key";
import { ConfirmButton } from "@components/util";
import { useInvalidate, useRead, useWrite } from "@lib/hooks";
import { Label } from "@ui/label";
import { Switch } from "@ui/switch";
import { useToast } from "@ui/use-toast";
import { Key, UserCheck, UserMinus, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@ui/button";

export const UserPage = () => {
  const { toast } = useToast();
  const inv = useInvalidate();
  const user_id = useParams().id as string;
  const user = useRead("ListUsers", {}).data?.find(
    (user) => user._id?.$oid === user_id
  );
  const { mutate } = useWrite("UpdateUserBasePermissions", {
    onSuccess: () => {
      inv(["FindUser", { user: user_id }]);
      inv(["ListUsers"]);
      toast({ title: "Modify user base permissions" });
    },
  });
  const enabledClass = user?.enabled ? "text-green-500" : "text-red-500";
  const avatar = (user?.config.data as any)?.avatar as string | undefined;
  if (!user) return null;
  return (
    <Page
      title={user?.username}
      icon={avatar && <img src={avatar} alt="" className="w-7 h-7" />}
      subtitle={
        <div className="text-sm text-muted-foreground flex gap-2">
          <div className={enabledClass}>
            {user?.enabled ? "Enabled" : "Disabled"}
          </div>
          |<div className="">Level: {user?.admin ? "Admin" : "User"}</div>|
          <div className="">Type: {user?.config.type}</div>
        </div>
      }
      actions={
        !user.admin && (
          <div className="flex gap-4 items-center">
            {(["Server", "Build"] as Array<"Server" | "Build">).map((item) => {
              const key = `create_${item.toLowerCase()}_permissions` as
                | "create_server_permissions"
                | "create_build_permissions";
              const req_key = `create_${item.toLowerCase()}s`;
              return (
                <div key={key} className="flex gap-2 items-center">
                  <Label htmlFor={key}>Create {item}</Label>
                  <Switch
                    id={key}
                    className="flex gap-4"
                    checked={user[key]}
                    onClick={() => mutate({ user_id, [req_key]: !user[key] })}
                  />
                </div>
              );
            })}
            <ConfirmButton
              title={user.enabled ? "Disable User" : "Enable User"}
              icon={
                user.enabled ? (
                  <UserMinus className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )
              }
              variant={user.enabled ? "destructive" : "outline"}
              onClick={() => mutate({ user_id, enabled: !user.enabled })}
            />
          </div>
        )
      }
    >
      {user.config.type === "Service" && <ApiKeysTable user_id={user_id} />}
      {user.enabled && !user.admin && (
        <>
          <Groups user_id={user_id} />
          <UserTargetPermissionsOnResourceTypes
            user_target={{ type: "User", id: user._id?.$oid! }}
          />
          <PermissionsTable user_target={{ type: "User", id: user_id }} />
        </>
      )}
    </Page>
  );
};

const ApiKeysTable = ({ user_id }: { user_id: string }) => {
  const keys = useRead("ListApiKeysForServiceUser", { user: user_id }).data;
  return (
    <Section
      title="Api Keys"
      icon={<Key className="w-4 h-4" />}
      actions={<CreateKeyForServiceUser user_id={user_id} />}
    >
      <KeysTable keys={keys ?? []} DeleteKey={DeleteKeyForServiceUser} />
    </Section>
  );
};

const Groups = ({ user_id }: { user_id: string }) => {
  const groups = useRead("ListUserGroups", {}).data?.filter((group) =>
    group.users.includes(user_id)
  );
  if (!groups || groups.length === 0) {
    return null;
  }
  return (
    <Section title="Groups">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {groups.map((group) => (
          <Link to={`/user-groups/${group._id?.$oid}`}>
            <Button variant="link" className="flex gap-2 items-center p-0">
              <Users className="w-4 h-4" />
              {group.name}
            </Button>
          </Link>
        ))}
      </div>
    </Section>
  );
};

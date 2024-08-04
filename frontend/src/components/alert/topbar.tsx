import { useRead } from "@lib/hooks";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { AlertTriangle, Clock } from "lucide-react";
import { AlertLevel } from ".";
import { ResourceLink } from "@components/resources/common";
import { UsableResource } from "@types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Types } from "@monitor/client";
import { useState } from "react";

export const TopbarAlerts = () => {
  const { data } = useRead("ListAlerts", { query: { resolved: false } });
  const [alert, setAlert] = useState<Types.Alert>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={!data?.alerts.length}>
          <Button variant="ghost" size="icon" className="relative">
            <AlertTriangle className="w-4 h-4" />
            {!!data?.alerts.length && (
              <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 flex items-center justify-center text-[10px] text-white rounded-full">
                {data.alerts.length}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {data?.alerts.map((alert) => (
            <DropdownMenuItem
              className="flex items-center gap-8 border-b last:border-none cursor-pointer"
              onClick={() => setAlert(alert)}
            >
              <div className="w-24">
                <AlertLevel level={alert.level} />
              </div>
              <div className="w-64">
                <div className="w-fit">
                  <ResourceLink
                    type={alert.target.type as UsableResource}
                    id={alert.target.id}
                  />
                </div>
              </div>
              <p className="w-64">{alert.data.type}</p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDetails alert={alert} onClose={() => setAlert(undefined)} />
    </>
  );
};

const AlertDetails = ({
  alert,
  onClose,
}: {
  alert: Types.Alert | undefined;
  onClose: () => void;
}) => (
  <>
    {alert && (
      <Dialog open={!!alert} onOpenChange={(o) => !o && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alert - {alert?.data.type}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Clock className="w-4" />
              {new Date(alert?.ts!).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground">{alert?.target.type}:</p>
                <ResourceLink
                  type={alert?.target.type as UsableResource}
                  id={alert?.target.id ?? ""}
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground">Alert Level:</p>
                <AlertLevel level={alert?.level} />
              </div>
            </div>
            <div>
              <pre>{JSON.stringify(alert.data.data, undefined, 2)}</pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}
  </>
);

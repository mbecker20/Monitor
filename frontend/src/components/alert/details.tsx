import { ResourceLink } from "@components/resources/common";
import { useRead } from "@lib/hooks";
import { UsableResource } from "@types";
import { Button } from "@ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@ui/dialog";
import { useState } from "react";
import { AlertLevel } from ".";
import { fmt_date_with_minutes } from "@lib/formatting";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  alert_level_intention,
  text_color_class_by_intention,
} from "@lib/color";

export const AlertDetailsDialog = ({ id }: { id: string }) => {
  const [open, set] = useState(false);
  const alert = useRead("GetAlert", { id }).data;
  return (
    <Dialog open={open} onOpenChange={set}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="items-center gap-2">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit min-w-[30vw] max-w-[90vw]">
        {alert && (
          <>
            <DialogHeader className="flex-row justify-between w-full">
              {alert && (
                <>
                  <ResourceLink
                    type={alert.target.type as UsableResource}
                    id={alert.target.id}
                    onClick={() => set(false)}
                  />
                  <div className="text-muted-foreground">
                    {fmt_date_with_minutes(new Date(alert.ts))}
                  </div>
                </>
              )}
            </DialogHeader>
            <DialogDescription>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  {/** Alert type */}
                  <div className="flex gap-2">
                    <div className="text-muted-foreground">type:</div>{" "}
                    {alert.data.type}
                  </div>

                  {/** Resolved */}
                  <div className="flex gap-2">
                    <div className="text-muted-foreground">status:</div>{" "}
                    <div
                      className={text_color_class_by_intention(
                        alert.resolved
                          ? "Good"
                          : alert_level_intention(alert.level)
                      )}
                    >
                      {alert.resolved ? "RESOLVED" : "OPEN"}
                    </div>
                  </div>

                  {/** Level */}
                  <div className="flex gap-2 text-muted-foreground">
                    level: <AlertLevel level={alert.level} />
                  </div>
                </div>

                {/** Alert data */}
                <pre>{JSON.stringify(alert.data.data, undefined, 2)}</pre>
              </div>
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

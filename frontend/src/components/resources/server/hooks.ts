import { atomWithStorage } from "@lib/hooks";
import { Types } from "@komodo/client";
import { useAtom } from "jotai";

const statsGranularityAtom = atomWithStorage(
  "stats-granularity-v0",
  Types.Timelength.FiveMinutes
);

export const useStatsGranularity = () => useAtom(statsGranularityAtom);

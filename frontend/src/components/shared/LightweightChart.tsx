import {
  AreaSeriesPartialOptions,
  ColorType,
  createChart,
  IChartApi,
  ISeriesApi,
  LineSeriesPartialOptions,
} from "lightweight-charts";
import {
  Component,
  createEffect,
  createSignal,
  JSX,
  onCleanup,
  onMount,
} from "solid-js";

export type LightweightValue = {
  time: number | string;
  value: number;
};

export type LightweightLine = {
  line: LightweightValue[];
} & LineSeriesPartialOptions;

export type LightweightArea = {
  line: LightweightValue[];
} & AreaSeriesPartialOptions;

const LightweightChart: Component<{
  lines?: LightweightLine[];
  areas?: LightweightArea[];
  class?: string;
  style?: JSX.CSSProperties;
  width?: string;
  height?: string;
  disableScroll?: boolean;
  onCreateLineSeries?: (series: ISeriesApi<"Line">) => void;
  onCreateAreaSeries?: (series: ISeriesApi<"Area">) => void;
}> = (p) => {
  let el: HTMLDivElement;
  const [chart, setChart] = createSignal<IChartApi>();
  let lineSeries: ISeriesApi<"Line">[] = [];
  let areaSeries: ISeriesApi<"Area">[] = [];
  const [loaded, setLoaded] = createSignal(false);
  onMount(() => {
    if (loaded()) return;
    setLoaded(true);
    const chart = createChart(el!, {
      width: el!.clientWidth,
      height: el!.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "white",
      },
      grid: {
        horzLines: { color: "#3f454d" },
        vertLines: { color: "#3f454d" },
      },
      timeScale: { timeVisible: true },
      handleScroll: p.disableScroll ? false : true,
      handleScale: p.disableScroll ? false : true,
    });
    chart.timeScale().fitContent();
    setChart(chart);
  });
  createEffect(() => {
    if (chart()) {
      for (const series of lineSeries) {
        chart()!.removeSeries(series);
      }
      if (p.lines) {
        const series = p.lines.map((line) => {
          const series = chart()!.addLineSeries(line);
          series.setData(line.line as any);
          if (p.onCreateLineSeries) {
            p.onCreateLineSeries(series);
          }
          return series;
        });
        lineSeries = series;
      }
      for (const series of areaSeries) {
        chart()!.removeSeries(series);
      }
      if (p.areas) {
        const series = p.areas.map((line) => {
          const series = chart()!.addAreaSeries(line);
          series.setData(line.line as any);
          if (p.onCreateAreaSeries) {
            p.onCreateAreaSeries(series);
          }
          return series;
        });
        areaSeries = series;
      }
      chart()!.timeScale().fitContent();
    }
  });
  const handleResize = () => {
    if (el && chart()) {
      chart()!.applyOptions({ width: el.clientWidth });
    }
  };
  addEventListener("resize", handleResize);
  onCleanup(() => {
    chart()?.remove();
    removeEventListener("resize", handleResize);
  });
  return (
    <div
      ref={el!}
      class={p.class}
      style={{
        width: p.width || "100%",
        height: p.height || "100%",
        ...p.style,
      }}
    />
  );
};

export default LightweightChart;

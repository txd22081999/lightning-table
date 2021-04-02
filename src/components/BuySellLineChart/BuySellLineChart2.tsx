
import * as React from "react";
import { Chart, ChartCanvas } from "@react-financial-charts/core";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import { discontinuousTimeScaleProviderBuilder } from "@react-financial-charts/scales";
import { LineSeries, LineSeriesProps } from "@react-financial-charts/series";
import { withDeviceRatio, withSize } from "react-financial-charts";
import { timeFormat, timeParse } from "d3-time-format";
import {
  BarSeries,
  CrossHairCursor, EdgeIndicator, Label,
  lastVisibleItemBasedZoomAnchor,
  MouseCoordinateX,
  MouseCoordinateY,
} from "react-financial-charts";
import { format } from "d3-format";
import { tsvParse } from "d3-dsv";
// import { parseBuySell } from "../data/dataUtils";


const minHeight = 323;

const margin = { left: 10, right: 33, top: 10, bottom: 20 };

const maxWidth = 630;



interface IBuySellData {
  readonly nnBuy: number;
  readonly date: Date;
  readonly nnSell: number;
  readonly nnNet: number;
  readonly buyPressure: number;
  readonly sellPressure: number;
}

interface WithBuySellDataProps {
  readonly data: IBuySellData[];
}

interface WithBuySellState {
  data?: IBuySellData[];
  message: string;
}

interface ChartProps extends Partial<LineSeriesProps> {
  readonly data: IBuySellData[];
  readonly dateTimeFormat?: string;
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
}

//===================================================================================================================
const fontSize = 8;

class NNLineSeries extends React.Component<ChartProps> {
  private readonly pricesDisplayFormat = format(".1f");
  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
      (d: IBuySellData) => d.date,
  );
  private readonly yEdgeIndicator = (data: IBuySellData) => {
    return data.nnNet;
  };

  private readonly nnSellSeries = (data: IBuySellData) => {
    return data.nnSell;
  };
  private readonly nnNetSeries = (data: IBuySellData) => {
    return data.nnNet;
  };
  private readonly buyPressureSeries = (data: IBuySellData) => {
    return data.buyPressure;
  };
  private readonly ySeries = (data: IBuySellData) => {
    return {"buyPressure": data.buyPressure, "sellPressure": data.sellPressure}
  };

  private readonly sellPressureSeries = (data: IBuySellData) => {
    return data.sellPressure;
  };

  public render() {

    const { data: initialData, height, dateTimeFormat = "%H:%M:%S", ratio, width, ...rest } = this.props;
    const timeDisplayFormat = timeFormat(dateTimeFormat);
    const { xScaleProvider } = this;
    // console.log("initialData", initialData)

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData)

    const max = xAccessor(data[0]);
    const min = xAccessor(data[data.length - 1]);
    const xExtents = [min, max + 5];
    const yExtents = this.buyPressureSeries
    const gridHeight = height - margin.top - margin.bottom;


    return (
        <>
        <ChartCanvas
        height={height}
        ratio={ratio}
        width={width}
        margin={margin}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName="Data"
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={xExtents}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
    >
      <Chart id={1} height={gridHeight}  yExtents={x => [0, 400]} >
        <Label
            text="Buy/Sell"
            fontSize={17}
            {...rest}
            x={30}
            y={30}
        />
        <XAxis showGridLines ticks={5} showTickLabel={true} fontSize={fontSize} />
        <YAxis showGridLines ticks={10} tickFormat={this.pricesDisplayFormat} fontSize={fontSize} />
        <MouseCoordinateX displayFormat={timeDisplayFormat} />
        <MouseCoordinateY rectWidth={margin.right} displayFormat={this.pricesDisplayFormat} />
        <EdgeIndicator
            itemType="last"
            rectWidth={margin.right}
            fill={"green"}
            lineStroke={"black"}
            displayFormat={this.pricesDisplayFormat}
            yAccessor={this.yEdgeIndicator}
            fontSize={fontSize}
        />
        <EdgeIndicator
            itemType="last"
            rectWidth={margin.right}
            fill={"#26a69a"}
            lineStroke={"#black"}
            displayFormat={this.pricesDisplayFormat}
            yAccessor={yExtents}
            fontSize={fontSize}
        />
        <EdgeIndicator
            itemType="last"
            rectWidth={margin.right}
            fill={"#ef5350"}
            lineStroke={"#black"}
            displayFormat={this.pricesDisplayFormat}
            yAccessor={this.sellPressureSeries}
            fontSize={fontSize}
        />
        <LineSeries strokeStyle={"#26a69a"}  yAccessor={yExtents} />
        <LineSeries strokeStyle={"#ef5350"}  yAccessor={this.sellPressureSeries} />
      </Chart>
      <CrossHairCursor />

    </ChartCanvas>
        </>
    )
  }
}


//===================================================================================================================

const parseData = () => {
  const parseDate = timeParse("%Y-%m-%d");

  return (d: any) => {
    const date = parseDate(d.date);
    if (date === null) {
      d.date = new Date(Number(d.date ) - 7 * 3600 * 1000);
    } else {
      d.date = new Date(date);
    }

    for (const key in d) {
      if (key !== "date" && Object.prototype.hasOwnProperty.call(d, key)) {
        d[key] = +d[key];
      }
    }

    return d as IBuySellData;
  };
};

 function withBuySellData(dataSet = "DAILY") {

  let interval: number | NodeJS.Timeout | null | undefined = null
  return <TProps extends WithBuySellDataProps>(OriginalComponent: React.ComponentClass<TProps>) => {
    return class WithBuySellData extends React.Component<Omit<TProps, "data">, WithBuySellState> {
      public constructor(props: Omit<TProps, "data">) {
        super(props);
        this.state = {
          message: `Loading ${dataSet} data...`,
        };
      }

      public componentDidMount() {
        const updateData = () => fetch(`http://113.161.34.115:5025/end-point/bs-nn-outbound`)
            .then((response) => response.text())
            .then((data) => tsvParse(data, parseData()))
            .then((data) => {

              this.setState({
                data,
              });

            })
            .catch(() => {
              this.setState({
                message: `Failed to fetch data.`,
              });
            });
        updateData().then()
        interval = setInterval(updateData, 300)
      }

      public componentWillUnmount() {
        // @ts-ignore
        window.clearInterval(interval);
      }

      public render() { 
        const { data, message } = this.state;
        if (data === undefined) {
          return <div className="center">{message}</div>;
        }

        return <OriginalComponent {...(this.props as TProps)} data={data} />;
      }
    };
  };
}

const BuySellLineChart =
    withBuySellData()(
        withSize({ style: { minHeight: minHeight } })(
            withDeviceRatio()(NNLineSeries)),);

export default BuySellLineChart;


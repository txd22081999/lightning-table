import React, { useState, useEffect } from 'react'

import {
  ChartCanvas,
  Chart,
  BarSeries,
  Label,
  XAxis,
  YAxis,
  CandlestickSeries,
  LineSeries,
  CurrentCoordinate,
  MouseCoordinateY,
  EdgeIndicator,
  OHLCTooltip,
  MouseCoordinateX,
  CrossHairCursor,
  lastVisibleItemBasedZoomAnchor,
  ema,
  elderRay,
  withDeviceRatio,
  withSize,
} from 'react-financial-charts'

import { timeFormat } from 'd3-time-format'
import { timeParse } from 'd3-time-format'
import { tsvParse } from 'd3-dsv'
import { format } from 'd3-format'

import { discontinuousTimeScaleProviderBuilder } from '@react-financial-charts/scales'

import './PSChart.scss'

const margin = { left: 10, right: 33, top: 10, bottom: 20 }
const MARGIN = margin
const fontSize = 8
const URL_PS = `http://113.161.34.115:5025/end-point/ps-outbound`

const parseDate = timeParse('%Y-%m-%d')

const parseData = () => {
  return (d) => {
    const date = parseDate(d.date)
    if (date === null) {
      d.date = new Date(Number(d.date) - 7 * 3600 * 1000)
    } else {
      d.date = new Date(date)
    }

    for (const key in d) {
      if (key !== 'date' && Object.prototype.hasOwnProperty.call(d, key)) {
        d[key] = +d[key]
      }
    }

    return d
  }
}

let interval = undefined

const PSChart = (props) => {
  const {
    data: initialData = [],
    dateTimeFormat = '%H:%M:%S',
    height = 312,
    width = 559,
    ratio = 1.8,
    ...rest
  } = props

  const [chartData, setChartData] = useState([])

  const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d) => d.date
  )

  const gridHeight = height - MARGIN.top - MARGIN.bottom

  const openCloseColor = (data) => {
    return data.close > data.open ? '#26a69a' : '#ef5350'
  }

  const yEdgeIndicator = (data) => {
    return data.close
  }

  const barChartExtents = (data) => {
    return data.volume
  }

  const volumeColor = (data) => {
    return data.close > data.open
      ? 'rgba(38, 166, 154, 0.3)'
      : 'rgba(239, 83, 80, 0.3)'
  }

  const volumeSeries = (data) => {
    return data.volume
  }

  const candleChartExtents = (data) => {
    return [data.high + 0.2, data.low - 0.1]
  }

  const elderRayHeight = -20
  const elderRayOrigin = (_, h) => [0, h - elderRayHeight - 1]
  const barChartHeight = gridHeight / 5
  const barChartOrigin = (_, h) => [0, h - barChartHeight - elderRayHeight]
  const chartHeight = gridHeight - elderRayHeight

  const timeDisplayFormat = timeFormat(dateTimeFormat)
  const pricesDisplayFormat = format('.1f')

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 26 })
    .merge((d, c) => {
      d.ema26 = c
    })
    .accessor((d) => d.ema26)

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d, c) => {
      d.ema12 = c
    })
    .accessor((d) => d.ema12)

  const elder = elderRay()

  //   const calculatedData = elder(ema26(ema12(initialData)))
  const calculatedData = elder(ema26(ema12(chartData)))

  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
    calculatedData
  )

  const max = xAccessor(data[data.length - 1])
  const min = xAccessor(data[Math.max(0, data.length - 120)])
  const xExtents = [min - 1, max + 3]

  useEffect(() => {
    const updateData = () => {
      fetch(URL_PS)
        .then((response) => response.text())
        .then((data) => {
          return tsvParse(data, parseData())
        })
        .then((data) => {
          setChartData(data)
          // console.log(data)
        })
        .catch(() => {
          console.log('Fail to fetch PS Chart data')
          console.error(`Failed to fetch data.`)
        })
    }

    updateData()
    // interval = setInterval(updateData, 500)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className='ps-chart'>
      <ChartCanvas
        height={height - 8}
        width={width}
        ratio={ratio}
        margin={{ left: 10, right: 40, top: 10, bottom: 22 }}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName='Data'
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={xExtents}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
        className='ps-canvas'
      >
        <Chart
          id={2}
          height={barChartHeight}
          origin={barChartOrigin}
          yExtents={barChartExtents}
        >
          <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
        </Chart>
        <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
          <Label
            text='PS'
            fontSize={20}
            {...rest}
            x={(width - margin.left - margin.right) / 20}
            y={(height - margin.top - margin.bottom) / 6}
          />
          <XAxis showGridLines showTickLabel={true} fontSize={fontSize} />
          <YAxis
            showGridLines
            tickFormat={pricesDisplayFormat}
            fontSize={fontSize}
          />
          <CandlestickSeries />
          <LineSeries
            yAccessor={ema26.accessor()}
            strokeStyle={ema26.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema26.accessor()}
            fillStyle={ema26.stroke()}
          />
          <LineSeries
            yAccessor={ema12.accessor()}
            strokeStyle={ema12.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema12.accessor()}
            fillStyle={ema12.stroke()}
          />
          <MouseCoordinateY
            rectWidth={MARGIN.right}
            displayFormat={pricesDisplayFormat}
            fontSize={fontSize}
          />
          <EdgeIndicator
            itemType='last'
            fontSize={10}
            rectWidth={MARGIN.right}
            fill={openCloseColor}
            lineStroke={openCloseColor}
            displayFormat={pricesDisplayFormat}
            yAccessor={yEdgeIndicator}
          />

          <OHLCTooltip origin={[4, 14]} />
        </Chart>
        <Chart
          id={4}
          height={elderRayHeight}
          yExtents={[0, elder.accessor()]}
          origin={elderRayOrigin}
          padding={{ top: 1, bottom: 1 }}
        >
          <XAxis
            ticks={10}
            showGridLines
            gridLinesStrokeStyle='#e0e3eb'
            fontSize={fontSize}
          />
          <YAxis
            ticks={10}
            tickFormat={pricesDisplayFormat}
            fontSize={fontSize}
          />

          <MouseCoordinateX displayFormat={timeDisplayFormat} />
          <MouseCoordinateY
            rectWidth={MARGIN.right}
            displayFormat={pricesDisplayFormat}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    </div>
  )
}

const containerStyle = { minHeight: '300px' }
// export default PSChart
export default withSize({ style: containerStyle })(withDeviceRatio()(PSChart))

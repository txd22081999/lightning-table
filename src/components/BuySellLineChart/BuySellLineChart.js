import React, { useState, useEffect } from 'react'
import {
  ChartCanvas,
  Chart,
  Label,
  XAxis,
  YAxis,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  LineSeries,
  CrossHairCursor,
  lastVisibleItemBasedZoomAnchor,
} from 'react-financial-charts/'
import { timeFormat, timeParse } from 'd3-time-format'
import { format } from 'd3-format'
import { tsvParse } from 'd3-dsv'

import { discontinuousTimeScaleProviderBuilder } from '@react-financial-charts/scales'

const fontSize = 8
const pricesDisplayFormat = format('.1f')

let interval = undefined

const parseData = () => {
  const parseDate = timeParse('%Y-%m-%d')

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

const BuySellLineChart = (props) => {
  const {
    data: initialData,
    height = 322,
    dateTimeFormat = '%H:%M:%S',
    ratio = 1.8,
    width = 559,
    ...rest
  } = props

  const [chartData, setChartData] = useState([])

  const margin = { bottom: 20, left: 10, right: 33, top: 10 }

  const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d) => d.date
  )
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider([])

  const max = xAccessor(data[0])
  const min = xAccessor(data[data.length - 1])
  const buyPressureSeries = (data) => {
    return data.buyPressure
  }
  const xExtents = [min, max + 5]
  const yExtents = buyPressureSeries
  const gridHeight = height - margin.top - margin.bottom

  const timeDisplayFormat = timeFormat(dateTimeFormat)

  const yEdgeIndicator = (data) => {
    return data.nnNet
  }

  const sellPressureSeries = (data) => {
    return data.sellPressure
  }

  // Fetch chart data
  useEffect(() => {
    const updateData = async () => {
      return await fetch(`http://113.161.34.115:5025/end-point/bs-nn-outbound`)
        .then((response) => {
          // const res = await response.text()
          // console.log(res)
          // return res
          return response.text()
        })
        .then((data) => {
          console.log(data)
          return tsvParse(data, parseData())
        })
        .then((data) => {
          // console.log(data)
          setChartData(data)
        })
        .catch(() => {
          console.log('Error when fetch chart data')
          console.error('Failed to fetch data')
        })
    }
    updateData()
    // interval = setInterval(updateData, 300)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      <ChartCanvas
        height={height}
        ratio={ratio}
        width={width}
        margin={margin}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName='Data'
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={xExtents}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
      >
        <Chart id={1} height={gridHeight} yExtents={(x) => [0, 400]}>
          <Label text='Buy/Sell' fontSize={17} {...rest} x={30} y={30} />
          <XAxis
            showGridLines
            ticks={5}
            showTickLabel={true}
            fontSize={fontSize}
          />
          <YAxis
            showGridLines
            ticks={10}
            tickFormat={pricesDisplayFormat}
            fontSize={fontSize}
          />
          <MouseCoordinateX displayFormat={timeDisplayFormat} />
          <MouseCoordinateY
            rectWidth={margin.right}
            displayFormat={pricesDisplayFormat}
          />
          <EdgeIndicator
            itemType='last'
            rectWidth={margin.right}
            fill={'green'}
            lineStroke={'black'}
            displayFormat={pricesDisplayFormat}
            yAccessor={yEdgeIndicator}
            fontSize={fontSize}
          />
          <EdgeIndicator
            itemType='last'
            rectWidth={margin.right}
            fill={'#26a69a'}
            lineStroke={'#black'}
            displayFormat={pricesDisplayFormat}
            yAccessor={yExtents}
            fontSize={fontSize}
          />
          <EdgeIndicator
            itemType='last'
            rectWidth={margin.right}
            fill={'#ef5350'}
            lineStroke={'#black'}
            displayFormat={pricesDisplayFormat}
            yAccessor={sellPressureSeries}
            fontSize={fontSize}
          />
          <LineSeries strokeStyle={'#26a69a'} yAccessor={yExtents} />
          <LineSeries strokeStyle={'#ef5350'} yAccessor={sellPressureSeries} />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    </div>
  )
}

export default BuySellLineChart

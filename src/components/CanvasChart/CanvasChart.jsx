import axios from 'axios'
import React, { useRef, useState, useEffect } from 'react'
// import CanvasJSReact from '../../CanvasJS/CanvasJSChart/canvasjs.react'
import CanvasJSReact from '../../CanvasJS/CanvasJSStock/canvasjs.stock.react'

import { isEmpty } from '../../utils'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart
const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart

const CanvasChart = () => {
  let chartRef = useRef(null)
  const [chartDataPoint, setChartDataPoints] = useState({
    dataPoint1: [],
    dataPoint2: [],
  })

  const [chartData, setChartData] = useState({})

  const initData = async () => {
    const dps1 = []
    const dps2 = []

    const response = await axios.get(
      'https://canvasjs.com/data/docs/btcusd2018.json'
    )
    console.log(response)
    const { data } = response
    for (var i = 0; i < data.length; i++) {
      dps1.push({
        x: new Date(data[i].date),
        y: [
          Number(data[i].open),
          Number(data[i].high),
          Number(data[i].low),
          Number(data[i].close),
        ],
      })
      dps2.push({
        x: new Date(data[i].date),
        // y: Number(data[i].close),
        // y: [Number(data[i].open), Number(data[i].close)],
        // y: [
        //   Number(data[i].open),
        //   Number(data[i].high),
        //   Number(data[i].low),
        //   Number(data[i].close),
        // ],
      })
    }
    return { dps1, dps2 }
  }

  const options = {
    theme: 'light2',
    exportEnabled: true,
    title: {
      text: 'StockChart with Date-Time Axis',
    },
    subtitles: [
      {
        text: 'Bitcoin Price (in USD)',
      },
    ],
    charts: [
      {
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
          },
        },
        axisY: {
          prefix: '$',
        },
        data: [
          {
            type: 'candlestick',
            yValueFormatString: '$#,###.##',
            dataPoints: chartDataPoint.dataPoint1,
          },
        ],
      },
    ],
    navigator: {
      data: [
        {
          dataPoints: chartDataPoint.dataPoint2,
        },
      ],
      slider: {
        minimum: new Date(2018, 4, 1),
        maximum: new Date(2018, 6, 1),
      },
    },
  }

  useEffect(() => {
    const prepareChart = async () => {
      const result = await initData()
      console.log(result)
      const { dps1, dps2 } = result
      setChartDataPoints({
        dataPoint1: dps1,
        dataPoint2: dps2,
      })
    }
    prepareChart()
    // initData()
    // console.log(chartRef)
    // console.log(chartData)
  }, [])

  return (
    <div>
      {chartDataPoint && chartDataPoint.dataPoint1.length > 0 && (
        <CanvasJSStockChart
          options={options}
          onRef={(ref) => (chartRef = ref)}
        />
      )}
    </div>
  )

  //   return <div></div>
}

export default CanvasChart

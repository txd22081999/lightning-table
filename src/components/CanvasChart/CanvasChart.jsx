import React, { useRef, useState, useEffect } from 'react'
// import CanvasJSReact from '../../CanvasJS/CanvasJSChart/canvasjs.react'
import CanvasJSReact from '../../CanvasJS/CanvasJSStock/canvasjs.stock.react'

import { isEmpty } from '../../utils'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart
const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart

const CanvasChart = () => {
  let chartRef = useRef(null)

  const [chartData, setChartData] = useState({})

  //   const options = {
  //     title: {
  //       text: 'Basic Column Chart in React',
  //     },
  //     data: [
  //       {
  //         type: 'column',
  //         dataPoints: [
  //           { label: 'Apple', y: 10 },
  //           { label: 'Orange', y: 15 },
  //           { label: 'Banana', y: 25 },
  //           { label: 'Mango', y: 30 },
  //           { label: 'Grape', y: 28 },
  //         ],
  //       },
  //     ],
  //   }

  const initData = () => {
    const limit = 10000 //increase number of dataPoints by increasing this
    let y = 1000
    const data = []
    const dataSeries = { type: 'spline' }
    const dataPoints = []
    for (let i = 0; i < limit; i += 1) {
      y += Math.round(Math.random() * 10 - 5)
      dataPoints.push({ x: i, y: y })
    }
    dataSeries.dataPoints = dataPoints
    data.push(dataSeries)
    setChartData(data)
    console.log(data)
  }

  const options = {
    title: {
      text: 'StockChart with Numeric Axis',
    },
    animationEnabled: true,
    exportEnabled: true,
    charts: [
      {
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
          },
        },
        axisY: {
          crosshair: {
            enabled: true,
            //snapToDataPoint: true
          },
        },
        data: chartData,
      },
    ],
    rangeSelector: {
      inputFields: {
        startValue: 4000,
        endValue: 6000,
        valueFormatString: '###0',
      },

      buttons: [
        {
          label: '1000',
          range: 1000,
          rangeType: 'number',
        },
        {
          label: '2000',
          range: 2000,
          rangeType: 'number',
        },
        {
          label: '5000',
          range: 5000,
          rangeType: 'number',
        },
        {
          label: 'All',
          rangeType: 'all',
        },
      ],
    },
  }

  useEffect(() => {
    initData()
    // console.log(chartRef)
    console.log(chartData)
  }, [])

  return (
    <div>
      {chartData && chartData.length > 0 && (
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

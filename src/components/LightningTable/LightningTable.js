import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as momentjs from 'moment'
import lodash from 'lodash'

import Player from '../Player'
import Table from '../common/Table'
import ReactSlider from '../Slider'
// import Input from "../common/Input"

import { Input, Slider, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { getData as getDataAction } from '../../actions/lightningTable'
import { getReplayerData } from '../../api'

import {
  getData,
  addSeconds,
  isEmpty,
  unixTime,
  originalTime,
  DATE_FORMAT,
  MOCK_DATA,
  colorMapping,
} from '../../utils'

import 'boxicons' // Icons
import './LightningTable.scss'
import TimeSlider from '../TimeSlider'

const formatRow = (rows, columns) => {
  if (columns.length === 0) return {}

  const formattedRow = {}
  rows.forEach((item, index) => {
    const col = { ...columns[index] }
    formattedRow[col['Header']] = item
  })
  return formattedRow
}

const formatColor = (rows, columns) => {
  if (columns.length === 0) return {}
  const formattedColor = {}
  rows.forEach((item, index) => {
    formattedColor[columns[index].Header] = item
  })
  return formattedColor
}

const DELAY_TIME = 1000 // millisecond
const STEP_TIME = 1 // second
const MIN_INDEX = 0 // index in table data returned
const MAX_INDEX = 99 // index in table data returned

const tableStyle = {
  maxWidth: '90%',
  overflowX: 'scroll',
  boxShadow: '0px 0px 4px rgba(0,0,0,0.4)',
  margin: '0 auto',
}

const inputStyle = { width: 200, textAlign: 'center' }

let updateInterval = undefined
const initialStartTime = {
  time: '',
  index: 29,
}

const LightningTable = (props) => {
  const tableStore = useSelector((state) => state.lightningTable)
  const dispatch = useDispatch()

  const [startTime, setStartTime] = useState(initialStartTime)
  const [tableData, setTableData] = useState({ raw: {}, data: [], color: [] })
  const [times, setTimes] = useState([])
  const [exactTime, setExactTime] = useState({
    start: unixTime('09:00:00'),
    end: unixTime('14:45:00'),
  })
  // const [exactTime, setExactTime] = useState({ start: '', end: '' })
  const [timeRange, setTimeRange] = useState({ start: '', end: '' })
  const [sliderVal, setSliderVal] = useState([25, 30])
  // const [timeRangeUnix, setTimeRangeUnix] = useState({ start: '', end: '' })
  const [stepValue, setStepValue] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tick, setTick] = useState(startTime.index)
  const [moment, setMoment] = useState('')
  const momentRef = useRef(null)

  const update = () => {
    if (startTime.index >= MAX_INDEX) {
      setStartTime(initialStartTime)
      clearUpdateInterval()
      return
    }
    forward()
  }

  // Update table every 1 second
  useEffect(() => {
    const fetchData = async () => {
      // console.log('FETCH HERE')
      // // const myData = await JSON.parse(MOCK_DATA)
      // const myData = MOCK_DATA
      // console.log(myData)
      // const response = await getReplayerData()
      // const { status, data = {} } = response
      // if (status !== 200) return
      // setTableData({
      //   ...tableData,
      //   raw: data,
      // })
      // const { times } = data
      // setStartTime({
      //   ...startTime,
      //   time: times[0],
      // })
    }
    // fetchData()

    dispatch(
      getDataAction({
        rangeTime: ['10:00:00', '10:02:00'],
      })
    )

    return () => {
      clearUpdateInterval()
    }
  }, [])

  const SpeedSlider = () => (
    <div
      style={{
        maxWidth: '250px',
        margin: '1em auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>Speed</span>

      <Slider
        style={{ width: '100%', margin: '0 20px' }}
        min={1}
        max={5}
        onChange={onStepChange}
        value={typeof stepValue === 'number' ? stepValue : 0}
      />

      <span style={{ fontWeight: '600' }}>{stepValue}</span>
    </div>
  )

  const onTimeChange = (values) => {
    console.log('CALL HERE')
    const [start, end] = values
    // console.log('VALUE', value)
    console.log('NEW', values)
    console.log(originalTime(start), originalTime(end))
    setTimeRange({
      start: parseInt(start),
      end: parseInt(end),
    })
    const DEBOUNCE_TIME = 500

    // Fetch data in specific time range
    const fetchDataByRange = lodash.debounce(() => {
      dispatch(
        getDataAction({
          rangeTime: [originalTime(start), originalTime(end)],
        })
      )
    }, DEBOUNCE_TIME)

    fetchDataByRange()
  }

  // const onAfterChange = (value) => {
  //   const [start, end] = value
  //   console.log(value)
  //   setTimeRange({
  //     start: start,
  //     end: end,
  //   })
  // }

  const onTimeFinish = (value) => {
    console.log('FNISH', value)
  }

  // const TimeSlider = useCallback(() => {
  //   console.log('TIME SLIDER HERE')
  //   if (timeRange.start === undefined || timeRange.start === '') return null
  //   const { start, end } = exactTime
  //   const min = parseInt(start),
  //     max = parseInt(end)

  //   const formatter = (value) => {
  //     return originalTime(value).toString()
  //   }

  //   const timeSliderValue = [timeRange.start, timeRange.end]

  //   console.log(timeSliderValue)
  //   return (
  //     <>
  //       <div
  //         style={{
  //           width: '180px',
  //           margin: '0 auto',
  //           display: 'flex',
  //           justifyContent: 'space-between',
  //           fontWeight: '600',
  //           fontSize: '1.2em',
  //         }}
  //       >
  //         <span>
  //           {/* {momentjs(timeRange.start).format('HH:mm:ss')} */}
  //           {originalTime(timeRange.start)}
  //         </span>
  //         <span>
  //           {/* {momentjs(timeRange.start).format('HH:mm:ss')} */}
  //           {originalTime(timeRange.end)}
  //         </span>
  //       </div>
  //       <div
  //         style={{
  //           maxWidth: '650px',
  //           margin: '0.5em auto',
  //           display: 'flex',
  //           justifyContent: 'space-between',
  //           alignItems: 'center',
  //           padding: '0 10px',
  //         }}
  //       >
  //         <div style={{ display: 'flex', alignItems: 'center' }}>
  //           <span>{originalTime(exactTime.start)}</span>
  //           <box-icon type='solid' name='sun' class='time-icon day'></box-icon>
  //         </div>

  //         <ReactSlider
  //           min={min}
  //           max={max}
  //           values={timeSliderValue}
  //           // onChange={onTimeChange}
  //           onSliderFinish={onTimeChange}
  //         />

  //         <div style={{ display: 'flex' }}>
  //           <box-icon
  //             class='time-icon night'
  //             name='moon'
  //             type='solid'
  //             styles={{ color: 'gray', fill: 'gray' }}
  //           ></box-icon>
  //           <span>{originalTime(exactTime.end)}</span>
  //         </div>
  //       </div>
  //     </>
  //   )
  // }, [])

  useEffect(() => {
    console.log('RERENDER BY TIMERANGE')
    console.log(timeRange)
  }, [timeRange])

  // Process time data from store
  useEffect(() => {
    const { data, loading, error } = tableStore
    if (isEmpty(data)) return
    setTableData({
      ...tableData,
      raw: data,
    })
    const { times } = data
    setStartTime({
      ...startTime,
      time: times[0],
    })
    const { times: timesProp = [] } = data
    const unixTimes = timesProp.map((item) => {
      return unixTime(item)
    })

    setTimes(unixTimes)
    const start = unixTimes[0]
    const end = unixTimes[unixTimes.length - 1]

    const offset = end - start
    setTimeRange({
      start: parseInt(start + offset / 3),
      end: parseInt(start + offset / 2),
    })
    // setExactTime({ start, end })
    // setTimeRange({ start: 0, value: 100 })
  }, [tableStore])

  const updateEverySecond = () => {
    setIsPlaying((prevState) => !prevState)
    updateInterval = setInterval(update, DELAY_TIME / stepValue)
  }

  // Update 1 second
  useEffect(() => {
    updateTableData({ useTick: false })
  }, [startTime])

  const columns = useMemo(() => {
    if (!tableData.raw || tableData.raw.length === 0 || !tableData.raw.columns)
      return []

    const columnNames = Object.keys(tableData.raw.columns)
    const cols = columnNames.map((col) => ({
      Header: col,
      accessor: col,
      width: 500,
      order: tableData.raw.columns[col],
    }))

    return cols
  }, [tableData])

  const formattedRows = useMemo(() => {
    if (
      !tableData.raw ||
      tableData.raw.length === 0 ||
      !tableData.raw.snapshots
    )
      return []
    const tickIndex = startTime.index
    const result = tableData.raw.snapshots[tickIndex].map((item, index) => {
      // return null
      const rows = [...tableData.raw.snapshots[tickIndex][index]]
      return formatRow(rows, columns)
    })
    setTableData({
      ...tableData,
      data: result,
    })
  }, [tableData.raw])

  const updateTableData = () => {
    // if (tableData.data.length === 0 || !tableData.data.snapshots) return
    if (Object.keys(tableData.raw).length === 0) return

    const updateIndex = startTime.index
    if (updateIndex >= MAX_INDEX || updateIndex <= MIN_INDEX) return

    const snapshots = [...tableData.raw.snapshots[updateIndex]]
    const rowResult = snapshots.map((item, index) => {
      return formatRow(snapshots[index], columns)
    })
    const colors = [...tableData.raw.colors[updateIndex]]
    const colorResult = colors.map((item, index) => {
      return formatColor(colors[index], columns)
    })

    setTableData({ ...tableData, color: colorResult, data: rowResult })
  }

  useEffect(() => {
    if (tableData.raw && Object.keys(tableData.raw).length !== 0) {
      updateTableData()
    }
  }, [tableData.raw])

  useEffect(() => {
    updateTableData({})
  }, [formattedRows])

  const MemoizedTable = useMemo(
    () => (
      <Table
        columns={columns}
        data={tableData.data}
        getCellProps={(cellInfo) => {
          // console.log(cellInfo)
          const {
            column: { id: colId, order },
            row: { id: rowIndex, value },
          } = cellInfo
          const { color = [] } = tableData
          const colNames = Object.keys(color[rowIndex])
          const colorStyle = color[rowIndex][colId]
          const isHighlighted = colorStyle === '#000000'

          return {
            style: {
              backgroundColor:
                colorStyle === '#000000' ? '#ffffff' : colorStyle,
            },
          }
        }}
        styles={tableStyle}
      />
    ),
    [tableData.data]
  )

  const onMomentFinish = (e) => {
    const value = e.target.value
  }

  const onMomentChange = (e) => {
    const value = e.target.value
    setStartTime({
      ...startTime,
      time: value,
    })
  }

  const clearUpdateInterval = () => {
    clearInterval(updateInterval)
    if (updateInterval) {
      setIsPlaying((prevState) => !prevState)
      clearInterval(updateInterval)
    }
  }

  const play = () => {
    updateEverySecond()
  }

  const pause = () => {
    clearUpdateInterval()
  }

  const step = (seconds) => {
    const { time, index } = startTime
    const isBackward = seconds < 0
    setStartTime((prevTime) => {
      const updatedIndex = isBackward
        ? prevTime.index - Math.abs(seconds)
        : prevTime.index + Math.abs(seconds)
      return {
        time: addSeconds({ time: prevTime.time, seconds }),
        index: updatedIndex,
      }
    })
  }

  const forward = () => {
    const { index } = startTime
    if (index <= MIN_INDEX || index >= MAX_INDEX) {
      return
    }
    // if (isPlaying) {
    // }
    step(stepValue)
  }

  const backward = () => {
    step(-stepValue)
  }

  const onStepChange = (val) => {
    setStepValue(val)
  }

  const handleApply = () => {
    dispatch(
      getDataAction({
        rangeTime: ['10:00:00', '10:02:00'],
      })
    ) // Fetch table data
  }

  return (
    <div className='lightning-table'>
      <h4>Lightning Table</h4>

      {/* <MemoizedTable /> */}

      <span
        style={{
          fontSize: '24px',
          display: 'block',
          fontWeight: '600',
          minHeight: '25px',
        }}
      >
        {startTime.time}
      </span>
      {/* )} */}

      {/* <Input
        style={inputStyle}
        onChange={onMomentChange}
        onPressEnter={onMomentFinish}
        value={startTime.time}
      /> */}

      <Player play={play} pause={pause} forward={forward} backward={backward} />

      <SpeedSlider />

      <TimeSlider
        timeRange={timeRange}
        exactTime={exactTime}
        onTimeChange={onTimeChange}
      />

      {/* {timeRange.start && console.log('OVER HERE') && (
        <>
          <p>WHAT UP</p>
          <TimeSlider
            timeRange={timeRange}
            exactTime={exactTime}
            onTimeChange={onTimeChange}
          />
        </>
      )} */}

      {tableData.data.length !== 0 && tableData.color.length > 0}
      {tableData.data.length !== 0 && tableData.color.length > 0 ? (
        <Table
          columns={columns}
          data={tableData.data}
          getCellProps={(cellInfo) => {
            const {
              column: { id: colId, order },
              row: { id: rowIndex, value },
            } = cellInfo
            const { color = [] } = tableData
            const colNames = Object.keys(color[rowIndex])
            const colorStyle = color[rowIndex][colId]
            const isHighlighted = colorStyle === '#000000'
            const colorValue = colorMapping(colorStyle)

            return {
              style: {
                backgroundColor: colorValue,
              },
            }
          }}
          styles={tableStyle}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <LoadingOutlined />
          <span>Loading...</span>
        </div>
      )}
    </div>
  )
}

export default LightningTable

import React, { useState, useEffect, useMemo, useRef } from 'react'
import * as momentjs from 'moment'
import { getData, addSeconds } from '../../utils'
import Player from '../Player'
import Table from '../common/Table'
// import Input from "../common/Input"

import { Input, Slider } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { getReplayerData } from '../../api'
import { MOCK_DATA, colorMapping } from '../../utils'

import './LightningTable.scss'

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
  maxWidth: '80%',
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

const LightningTable = () => {
  const [startTime, setStartTime] = useState(initialStartTime)
  const [tableData, setTableData] = useState({ raw: {}, data: [], color: [] })
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
    // setStartTime((prevStartTime) => ({
    //   ...prevStartTime,
    //   index: prevStartTime.index + 1,
    // }))
    // setTick((prev) => prev + 1)
  }

  // Update table every 1 second

  console.log(tableData.data)

  useEffect(() => {
    const fetchData = async () => {
      console.log('FETCH HERE')
      // const myData = await JSON.parse(MOCK_DATA)
      const myData = MOCK_DATA
      console.log(myData)
      const response = await getReplayerData()
      const { status, data = {} } = response
      if (status !== 200) return
      setTableData({
        ...tableData,
        raw: data,
      })
      const { times } = data
      setStartTime({
        ...startTime,
        time: times[0],
      })
      console.log('RESPONSE', response)
    }
    fetchData()
    return () => {
      clearUpdateInterval()
    }
  }, [])

  useEffect(() => {}, [])

  const updateEverySecond = () => {
    setIsPlaying((prevState) => !prevState)
    updateInterval = setInterval(update, DELAY_TIME / stepValue)
  }

  // // Update on interval
  // useEffect(() => {
  //   updateTableData({})
  // }, [tick])

  // Update 1 second
  useEffect(() => {
    updateTableData({ useTick: false })
    // setTick(startTime.index)
  }, [startTime])

  const columns = useMemo(() => {
    if (!tableData.raw || tableData.raw.length === 0 || !tableData.raw.columns)
      return []
    console.log('RUN COLUMNS')
    console.log('Here', tableData.raw.columns)
    const columnNames = Object.keys(tableData.raw.columns)
    const cols = columnNames.map((col) => ({
      Header: col,
      accessor: col,
      width: 500,
      order: tableData.raw.columns[col],
    }))

    console.log(cols)

    return cols
  }, [tableData])

  // const formattedRow = useMemo(() => {
  //   const tickIndex = tick
  //   return formatRow(tableData.data.snapshots[tickIndex][0], columns)
  // }, [])

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
    console.log(result)
  }, [tableData.raw])

  const updateTableData = () => {
    console.log('update table')
    console.log(tableData)
    // if (tableData.data.length === 0 || !tableData.data.snapshots) return
    if (Object.keys(tableData.raw).length === 0) return

    const updateIndex = startTime.index
    if (updateIndex >= MAX_INDEX || updateIndex <= MIN_INDEX) return
    console.log(updateIndex)
    const snapshots = [...tableData.raw.snapshots[updateIndex]]
    const rowResult = snapshots.map((item, index) => {
      return formatRow(snapshots[index], columns)
    })
    const colors = [...tableData.raw.colors[updateIndex]]
    console.log('RUN 123')
    const colorResult = colors.map((item, index) => {
      return formatColor(colors[index], columns)
    })
    console.log(rowResult)
    console.log(colorResult)
    // console.log("DATA HERE", rowResult)
    // console.log("COLORS HERE", colorResult)
    setTableData({ ...tableData, color: colorResult, data: rowResult })
  }

  useEffect(() => {
    if (tableData.raw && Object.keys(tableData.raw).length !== 0) {
      updateTableData()
    }
  }, [tableData.raw])

  useEffect(() => {
    const fetchData = async () => {
      const { data = [] } = await getData()
      // setTableData(data)
      // console.log("Original", data)
    }
    fetchData()
    updateTableData({})
  }, [])
  // }, [formattedRows])

  const columns2 = useMemo(
    () => [
      {
        Header: '_________NET__________',
        columns: [
          {
            Header: 'NET',
            accessor: 'NET',
            width: 110,
          },
          {
            Header: 'Mã',
            accessor: 'MA',
            width: 50,
          },
        ],
      },
      {
        Header:
          '_______________________________________________MUA__________________________________________',
        columns: [
          {
            Header: 'TOTAL_B',
            accessor: 'TOTAL_B',
            width: 120,
          },
          {
            Header: 'GT_3',
            accessor: 'GT_MUA_3',
            width: 90,
          },
          {
            Header: 'KL_3',
            accessor: 'KL_MUA_3',
            width: 80,
          },
          {
            Header: 'GT_2',
            accessor: 'GT_MUA_2',
            width: 90,
          },
          {
            Header: 'KL_2',
            accessor: 'KL_MUA_2',
            width: 80,
          },
          {
            Header: 'GT_1',
            accessor: 'GT_MUA_1',
            width: 90,
          },
          {
            Header: 'KL_1',
            accessor: 'KL_MUA_1',
            width: 80,
          },
        ],
      },
      {
        Header: '_________TOTAL__________',
        columns: [
          {
            Header: 'Tổng_vol_B',
            accessor: 'VOL_B',
            width: 90,
          },
          {
            Header: 'Tổng_vol_S',
            accessor: 'VOL_S',
            width: 90,
          },
        ],
      },
      {
        Header:
          '_______________________________________________BÁN__________________________________________',
        columns: [
          {
            Header: 'GT_1',
            accessor: 'GT_BAN_1',
            width: 90,
          },
          {
            Header: 'KL_1',
            accessor: 'KL_BAN_1',
            width: 80,
          },
          {
            Header: 'GT_2',
            accessor: 'GT_BAN_2',
            width: 90,
          },
          {
            Header: 'KL_2',
            accessor: 'KL_BAN_2',
            width: 80,
          },
          {
            Header: 'GT_3',
            accessor: 'GT_BAN_3',
            width: 90,
          },
          {
            Header: 'KL_3',
            accessor: 'KL_BAN_3',
            width: 80,
          },
          {
            Header: 'TOTAL_S',
            accessor: 'TOTAL_S',
            width: 120,
          },
        ],
      },
    ],
    []
  )

  // const onMomentChange = (e) => {
  // if (!momentRef) return
  // const {
  //   current: { value = "" },
  // } = momentRef
  // if (!value) return
  // console.log(momentRef.current.value)
  // }

  const MemoizedTable = useMemo(
    () => (
      <Table
        columns={columns}
        data={tableData.data}
        getCellProps={(cellInfo) => {
          console.log(cellInfo)
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
    console.log(index)
    // if (!isPlaying) {
    //   if (isBackward && index <= MIN_INDEX) {
    //     console.log(1)
    //     return
    //   }
    //   if (!isBackward && index >= MAX_INDEX) {
    //     console.log(2)
    //     return
    //   }
    // } else {
    // }
    // if (index >= MAX_INDEX && index <= MIN_INDEX) {
    //   console.log('OUT')
    //   return
    // }
    console.log(3)
    setStartTime((prevTime) => {
      const updatedIndex = isBackward
        ? prevTime.index - Math.abs(seconds)
        : prevTime.index + Math.abs(seconds)
      // console.log('UPDATED INDEX', updatedIndex)
      return {
        time: addSeconds({ time: prevTime.time, seconds }),
        index: updatedIndex,
      }
    })
  }

  const forward = () => {
    const { index } = startTime
    if (index <= MIN_INDEX || index >= MAX_INDEX) {
      console.log('OUT OF HERE')
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

  return (
    <div className='lightning-table'>
      <h1>Home</h1>

      {/* <MemoizedTable /> */}

      <div style={{ marginTop: '2em' }} />

      {/* {startTime.time && ( */}
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

      <Input
        style={inputStyle}
        onChange={onMomentChange}
        onPressEnter={onMomentFinish}
        value={startTime.time}
      />

      <Player play={play} pause={pause} forward={forward} backward={backward} />

      <div
        style={{
          width: '250px',
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

      {tableData.data.length !== 0 &&
        tableData.color.length > 0 &&
        console.log('HERE TABLE RENDER', tableData.data)}
      {tableData.data.length !== 0 && tableData.color.length > 0 ? (
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
          <span>Loading...</span>
          <LoadingOutlined />
        </div>
      )}

      {/* <Input
        ref={momentRef}
        //  value={moment}
        onChange={onMomentChange}
      /> */}
    </div>
  )
}

export default LightningTable

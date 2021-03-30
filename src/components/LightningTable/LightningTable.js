import React, { useState, useEffect, useMemo, useRef } from 'react'
import * as momentjs from 'moment'
import { getData, addSeconds } from '../../utils'
import Player from '../Player'
import Table from '../common/Table'
// import Input from "../common/Input"

import { Input, Slider } from 'antd'

import { MOCK_DATA } from '../../utils'

import './LightningTable.scss'

const formatRow = (rows, columns) => {
  const formattedRow = {}
  // console.log("ROWS", rows)
  rows.forEach((item, index) => {
    // const columnName = MOCK_DATA.columns[index]
    formattedRow[columns[index].Header] = item
  })
  return formattedRow
}

const formatColor = (rows, columns) => {
  const formattedColor = {}
  // console.log("ROWS", rows)
  // console.log(rows)
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
  time: '09:30:00',
  index: 29,
}

const LightningTable = () => {
  const [startTime, setStartTime] = useState(initialStartTime)
  const [tableData, setTableData] = useState({ data: [], color: [] })
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
  useEffect(() => {
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
    const columnNames = Object.keys(MOCK_DATA.columns)
    const cols = columnNames.map((col) => ({
      Header: col,
      accessor: col,
      width: 500,
      order: MOCK_DATA.columns[col],
    }))
    // console.log("COLUMNS", cols)
    return cols
  }, [])

  // const formattedRow = useMemo(() => {
  //   const tickIndex = tick
  //   return formatRow(MOCK_DATA.snapshots[tickIndex][0], columns)
  // }, [])

  const formattedRows = useMemo(() => {
    const tickIndex = startTime.index
    const result = MOCK_DATA.snapshots[tickIndex].map((item, index) => {
      return formatRow(MOCK_DATA.snapshots[tickIndex][index], columns)
    })
  }, [])

  const updateTableData = ({ useTick = true }) => {
    const updateIndex = startTime.index
    if (updateIndex >= MAX_INDEX || updateIndex <= MIN_INDEX) return
    console.log(updateIndex)
    const rowResult = MOCK_DATA.snapshots[updateIndex].map((item, index) => {
      return formatRow(MOCK_DATA.snapshots[updateIndex][index], columns)
    })
    const colorResult = MOCK_DATA.colors[updateIndex].map((item, index) => {
      return formatColor(MOCK_DATA.colors[updateIndex][index], columns)
    })
    // console.log("DATA HERE", rowResult)
    // console.log("COLORS HERE", colorResult)
    setTableData({ color: colorResult, data: rowResult })
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data = [] } = await getData()
      // setTableData(data)
      // console.log("Original", data)
    }
    fetchData()
    updateTableData({})
  }, [formattedRows])

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

      {startTime.time && (
        <span style={{ fontSize: '24px', display: 'block', fontWeight: '600' }}>
          {startTime.time}
        </span>
      )}

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
          style={{ width: '100%', marginLeft: '20px' }}
          min={1}
          max={20}
          onChange={onStepChange}
          value={typeof stepValue === 'number' ? stepValue : 0}
        />
      </div>

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

      {/* <Input
        ref={momentRef}
        //  value={moment}
        onChange={onMomentChange}
      /> */}
    </div>
  )
}

export default LightningTable

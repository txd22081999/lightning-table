import React, { useState, useEffect, useMemo, useRef } from "react"
import * as momentjs from "moment"
import { getData } from "../../utils"
import Player from "../Player"
import Table from "../common/Table"
// import Input from "../common/Input"

import { Input } from "antd"

import { MOCK_DATA } from "../../utils"

import "./LightningTable.scss"

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

const DELAY_TIME = 500

const tableStyle = {
  maxWidth: "80%",
  overflowX: "scroll",
  // padding: "20px 50px",
  // border: "1px solid black",
  boxShadow: "0px 0px 4px rgba(0,0,0,0.4)",
  margin: "0 auto",
  // backgroundColor: "#e6e6e6",
}

const inputStyle = { width: 200, textAlign: "center" }

const LightningTable = () => {
  const [tableData, setTableData] = useState({ data: [], color: [] })
  const [tick, setTick] = useState(0)
  const [moment, setMoment] = useState("")
  const momentRef = useRef(null)

  // Update table every 1 second
  // useEffect(() => {
  //   const update = () => {
  //     if (tick >= 100) {
  //       setTick(0)
  //     }
  //     setTick((prev) => prev + 1)
  //   }
  //   const updateInterval = setInterval(update, DELAY_TIME)

  //   return () => {
  //     clearInterval(updateInterval)
  //   }
  // }, [])

  useEffect(() => {
    updateTableData()
  }, [tick])

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

  const formattedRow = useMemo(() => {
    const tickIndex = tick
    return formatRow(MOCK_DATA.snapshots[tickIndex][0], columns)
  }, [])

  const formattedRows = useMemo(() => {
    const tickIndex = tick
    const result = MOCK_DATA.snapshots[tickIndex].map((item, index) => {
      return formatRow(MOCK_DATA.snapshots[tickIndex][index], columns)
    })

    // console.log("formattedRows", result)
  }, [])

  const updateTableData = () => {
    const tickIndex = tick
    const rowResult = MOCK_DATA.snapshots[tickIndex].map((item, index) => {
      return formatRow(MOCK_DATA.snapshots[tickIndex][index], columns)
    })
    const colorResult = MOCK_DATA.colors[tickIndex].map((item, index) => {
      return formatColor(MOCK_DATA.colors[tickIndex][index], columns)
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
    updateTableData()
  }, [formattedRows])

  const columns2 = useMemo(
    () => [
      {
        Header: "_________NET__________",
        columns: [
          {
            Header: "NET",
            accessor: "NET",
            width: 110,
          },
          {
            Header: "Mã",
            accessor: "MA",
            width: 50,
          },
        ],
      },
      {
        Header:
          "_______________________________________________MUA__________________________________________",
        columns: [
          {
            Header: "TOTAL_B",
            accessor: "TOTAL_B",
            width: 120,
          },
          {
            Header: "GT_3",
            accessor: "GT_MUA_3",
            width: 90,
          },
          {
            Header: "KL_3",
            accessor: "KL_MUA_3",
            width: 80,
          },
          {
            Header: "GT_2",
            accessor: "GT_MUA_2",
            width: 90,
          },
          {
            Header: "KL_2",
            accessor: "KL_MUA_2",
            width: 80,
          },
          {
            Header: "GT_1",
            accessor: "GT_MUA_1",
            width: 90,
          },
          {
            Header: "KL_1",
            accessor: "KL_MUA_1",
            width: 80,
          },
        ],
      },
      {
        Header: "_________TOTAL__________",
        columns: [
          {
            Header: "Tổng_vol_B",
            accessor: "VOL_B",
            width: 90,
          },
          {
            Header: "Tổng_vol_S",
            accessor: "VOL_S",
            width: 90,
          },
        ],
      },
      {
        Header:
          "_______________________________________________BÁN__________________________________________",
        columns: [
          {
            Header: "GT_1",
            accessor: "GT_BAN_1",
            width: 90,
          },
          {
            Header: "KL_1",
            accessor: "KL_BAN_1",
            width: 80,
          },
          {
            Header: "GT_2",
            accessor: "GT_BAN_2",
            width: 90,
          },
          {
            Header: "KL_2",
            accessor: "KL_BAN_2",
            width: 80,
          },
          {
            Header: "GT_3",
            accessor: "GT_BAN_3",
            width: 90,
          },
          {
            Header: "KL_3",
            accessor: "KL_BAN_3",
            width: 80,
          },
          {
            Header: "TOTAL_S",
            accessor: "TOTAL_S",
            width: 120,
          },
        ],
      },
    ],
    []
  )

  const onMomentChange = (e) => {
    // if (!momentRef) return
    // const {
    //   current: { value = "" },
    // } = momentRef
    // if (!value) return
    // console.log(momentRef.current.value)
  }

  console.log("render")

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
          const isHighlighted = colorStyle === "#000000"

          return {
            style: {
              backgroundColor:
                colorStyle === "#000000" ? "#ffffff" : colorStyle,
            },
          }
        }}
        styles={tableStyle}
      />
    ),
    [tableData.data]
  )

  const onMomentFinish = (e) => {
    console.log(e.target.value)
  }

  console.log(momentjs("9:30").format("h:mm"))

  return (
    <div className='lightning-table'>
      <h1>Home</h1>

      {/* <MemoizedTable /> */}

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
          const isHighlighted = colorStyle === "#000000"

          return {
            style: {
              backgroundColor:
                colorStyle === "#000000" ? "#ffffff" : colorStyle,
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

      <div style={{ marginTop: "2em" }} />

      <Input
        style={inputStyle}
        onChange={onMomentChange}
        onPressEnter={onMomentFinish}
      />

      <Player />
    </div>
  )
}

export default LightningTable
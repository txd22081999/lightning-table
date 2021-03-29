import React from "react"
import { useTable } from "react-table"

import "./Table.scss"

// Create a default prop getter
const defaultPropGetter = () => ({})

const Table = ({
  columns,
  data,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  styles,
}) => {
  console.log("TABLE RENDER")
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <div className='table-container' style={{ ...styles }}>
      <div className='table-inner-container'>
        <table
          {...getTableProps([
            {
              className: "table",
            },
          ])}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  // console.log(column.getHeaderProps())
                  return (
                    // <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                    <th
                      {...column.getHeaderProps([
                        {
                          // className: column.className,
                          className: "header",
                        },
                      ])}
                    >
                      {column.render("Header")}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr
                  {...row.getRowProps([
                    {
                      className: "row",
                    },
                  ])}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps([
                          {
                            className: "cell",
                            // style: {
                            //   background: "black",
                            // },
                          },
                          getColumnProps(cell.column),
                          getCellProps(cell),
                        ])}
                      >
                        {cell.render("Cell")}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table

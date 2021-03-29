import React, { forwardRef } from "react"
import { useTable } from "react-table"

import "./Input.scss"

// Create a default prop getter
const defaultPropGetter = () => ({})

const Input = (props, ref) => {
  return (
    <>
      <input ref={ref} {...props}></input>
    </>
  )
}

export default forwardRef(Input)

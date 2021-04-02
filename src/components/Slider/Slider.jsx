import React, { useEffect, useState } from 'react'
// import { Range, getTrackBackground } from '../src/index';
import { Range, getTrackBackground } from 'react-range'
import { originalTime, unixTime } from '../../utils'

import './Slider.scss'

const STEP = 10
const MIN = 0
const MAX = 100

const TwoThumbsDraggableTrack = (props) => {
  const {
    rtl = false,
    values,
    min,
    max,
    onChange = () => {},
    step = 1,
    onSliderFinish,
  } = props
  console.log(values)
  console.log(min)
  // const [sliderValues, setSliderValues] = React.useState([25, 75])
  const [sliderValues, setSliderValues] = useState(values)
  const [updatedTime, setUpdatedTime] = useState({ start: '', end: '' })

  // useEffect(() => {
  //   if (!values) {
  //     return
  //   }
  //   // setSliderValues(values)
  // }, [values])

  const onFinalChange = (vals) => {
    console.log(vals)
    // setSliderValues(values)
    onSliderFinish(vals)
  }

  const onTimeChange = (e, type) => {
    const time = e.target.value
    console.log(time)
    if (type === 'start') {
      setUpdatedTime({
        ...updatedTime,
        start: time,
      })
    }
    if (type === 'end') {
      setUpdatedTime({
        ...updatedTime,
        end: time,
      })
    }
    // console.log(e.key)
    // console.log(e.target.value)
    // const [start, end] = sliderValues
    // setSliderValues([unixTime(startTime), end])
  }

  // const onTimeChange = (vals) => {
  //   console.log(vals)
  //   const { startTime, endTime } = vals
  //   const [start, end] = sliderValues

  //   if (startTime) {
  //     setSliderValues([unixTime(startTime), end])
  //   }
  //   if (endTime) {
  //     setSliderValues([start, unixTime(endTime)])
  //   }
  // }

  const onKeyDown = (e, type) => {
    const {
      key,
      target: { value },
    } = e
    if (key !== 'Enter') return

    const item = value.split(':')
    const isNotValidTime = item.some((v) => isNaN(v))
    console.log(isNotValidTime)
    if (isNotValidTime) {
      setUpdatedTime({
        start: '',
        end: '',
      })
      return
    }
    setUpdatedTime({
      start: '',
      end: '',
    })
    const [start, end] = sliderValues
    const unixValue = unixTime(value)
    if (unixValue < min || unixValue > max) return

    if (type === 'start') {
      setSliderValues([unixValue, end])
    }

    if (type === 'end') {
      setSliderValues([start, unixValue])
    }
  }

  return (
    <div
      className='time-slider'
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '300px',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <span>Start: </span>

          <input
            // value={originalTime(sliderValues[0])}
            // defaultValue={updatedTime.start}
            type='text'
            onKeyDown={(e) => onKeyDown(e, 'start')}
            value={updatedTime.start}
            onChange={(e) => onTimeChange(e, 'start')}
            className='input-start'
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <span>End: </span>

          <input
            // value={originalTime(sliderValues[0])}
            // defaultValue={updatedTime.start}
            type='text'
            onKeyDown={(e) => onKeyDown(e, 'end')}
            value={updatedTime.end}
            onChange={(e) => onTimeChange(e, 'end')}
            className='input-end'
          />
        </div>
      </div>
      <Range
        // draggableTrack
        // values={[1617328800, 1617328810]}
        // values={values}
        values={sliderValues}
        step={step}
        onFinalChange={onFinalChange}
        // min={1617328800}
        min={min}
        max={max}
        // min={1617328800}
        // max={1617328900}
        rtl={rtl}
        // onChange={onChange}
        onChange={(values) => {
          setSliderValues(values)
        }}
        renderTrack={({ props, children }) => (
          <div
            role='button'
            tabIndex='-1'
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  // values,
                  values: sliderValues,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: min,
                  max: max,
                  rtl,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '42px',
              width: '42px',
              borderRadius: '4px',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
            }}
          >
            <div
              style={{
                height: '16px',
                width: '5px',
                backgroundColor: isDragged ? '#548BF4' : '#CCC',
              }}
            />
          </div>
        )}
      />

      <output style={{ marginTop: '30px' }} id='output'>
        {originalTime(sliderValues[0])} - {originalTime(sliderValues[1])}
      </output>
    </div>
  )
}

export default TwoThumbsDraggableTrack

import React, { useEffect, useState } from 'react'
// import { Range, getTrackBackground } from '../src/index';
import { Range, getTrackBackground } from 'react-range'
import { originalTime } from '../../utils'

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
  // const [sliderValues, setSliderValues] = React.useState([25, 75])
  const [sliderValues, setSliderValues] = useState([1617332440, 1617332460])

  console.log(values)
  console.log(originalTime(values[0]))
  console.log(originalTime(values[1]))

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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '300px',
      }}
    >
      <Range
        draggableTrack
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

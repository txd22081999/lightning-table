import React from 'react'

import ReactSlider from '../Slider'

import { originalTime } from '../../utils'

const TimeSlider = (props) => {
  //   console.log('TIME SLIDER HERE')

  const {
    timeRange = { start: '', end: '' },
    onTimeChange,
    exactTime = { start: '', end: '' },
  } = props
  //   if (timeRange.start === undefined || timeRange.start === '') return null
  const { start, end } = exactTime
  const min = parseInt(start),
    max = parseInt(end)

  const formatter = (value) => {
    return originalTime(value).toString()
  }

  const timeSliderValue = [timeRange.start, timeRange.end]
  console.log(min)
  console.log(timeRange)

  console.log(timeSliderValue)
  //   return <span>asdasdsa</span>

  return (
    <>
      {timeRange.start && timeRange.end && (
        <>
          <div
            style={{
              width: '180px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '600',
              fontSize: '1.2em',
            }}
          >
            <span>{originalTime(timeRange.start)}</span>
            <span>{originalTime(timeRange.end)}</span>
          </div>
          <div
            style={{
              maxWidth: '650px',
              margin: '0.5em auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{originalTime(exactTime.start)}</span>
              <box-icon
                type='solid'
                name='sun'
                class='time-icon day'
              ></box-icon>
            </div>

            <ReactSlider
              min={min}
              max={max}
              values={timeSliderValue}
              // onChange={onTimeChange}
              onSliderFinish={onTimeChange}
            />

            <div style={{ display: 'flex' }}>
              <box-icon
                class='time-icon night'
                name='moon'
                type='solid'
                styles={{ color: 'gray', fill: 'gray' }}
              ></box-icon>
              <span>{originalTime(exactTime.end)}</span>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default TimeSlider

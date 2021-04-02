import React from 'react'
import useDimensions from 'react-use-dimensions'
import {withDeviceRatio, withSize} from 'react-financial-charts'

import PSChart from '../PSChart'

import './PSChartContainer.scss'

const PSChartContainer = (props) => {
    const [ref, { width, height }] = useDimensions()

    return (
        // <div ref={ref} style={{width: '100%', height: '100%'}}>
        <div className='ps-chart-container'>
            <PSChart />

        </div>
        // </div>
    )
}

export default PSChartContainer

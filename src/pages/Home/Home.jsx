import React from 'react'
import LightningTable from '../../components/LightningTable'
import BuySellLineChart from '../../components/BuySellLineChart'
import PSChart from '../../components/PSChart'
import PSChartContainer from '../../components/PSChartContainer'
import Slider from '../../components/Slider'

import './Home.scss'
import TimeSlider from '../../components/TimeSlider'

const Home = () => {
  return (
    <div className='Home'>
      {/* <LightningTable /> */}
      {/* <BuySellLineChart /> */}

      {/* <Slider /> */}

      {/* <TimeSlider /> */}

      <div className='charts-container'>
        <div className='chart-item ps-chart-container'>
          <BuySellLineChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChartContainer />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChartContainer />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChartContainer />
        </div>
        <div className='chart-item ps-chart-container odd'>
          <LightningTable />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChartContainer />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChartContainer />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChartContainer />
        </div>
      </div>
    </div>
  )
}

export default Home

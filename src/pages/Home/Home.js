import React from 'react'
import LightningTable from '../../components/LightningTable'
import BuySellLineChart from '../../components/BuySellLineChart/'
import PSChart from '../../components/PSChart/'

import './Home.scss'

const Home = () => {
  return (
    <div className='Home'>
      {/* <LightningTable /> */}
      {/* <BuySellLineChart /> */}
      <div className='charts-container'>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
        <div className='chart-item ps-chart-container'>
          <PSChart />
        </div>
      </div>
    </div>
  )
}

export default Home

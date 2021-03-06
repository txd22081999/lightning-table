import React, { useState, useEffect } from 'react'

import { Button } from 'antd'
import {
  PlayCircleFilled,
  PauseCircleFilled,
  StepBackwardFilled,
  StepForwardFilled,
} from '@ant-design/icons'

import './Player.scss'

const Player = (props) => {
  const [playing, setPlaying] = useState(false)
  const { play, pause, forward, backward } = props

  useEffect(() => {
    if (playing) {
      play()
    } else {
      pause()
    }
    return () => {}
  }, [playing])

  const onPlayClick = () => {
    setPlaying((prevPlay) => !prevPlay)
  }

  const PlayIcon = () =>
    playing ? <PauseCircleFilled /> : <PlayCircleFilled />

  const onForwardClick = () => {
    forward()
  }

  const onBackwardClick = () => {
    backward()
  }

  return (
    <div className='player-controls'>
      <Button
        type='primary'
        icon={<StepBackwardFilled />}
        size='large'
        onClick={onBackwardClick}
      ></Button>
      <Button
        type='primary'
        icon={<PlayIcon />}
        size='large'
        onClick={onPlayClick}
      ></Button>
      <Button
        type='primary'
        icon={<StepForwardFilled />}
        size='large'
        onClick={onForwardClick}
      ></Button>
    </div>
  )
}

export default Player

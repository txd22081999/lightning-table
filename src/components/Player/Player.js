import React, { useState } from "react"

import { Button } from "antd"
import {
  PlayCircleFilled,
  PauseCircleFilled,
  StepBackwardFilled,
  StepForwardFilled,
} from "@ant-design/icons"

import "./Player.scss"

const Player = () => {
  const [play, setPlay] = useState(false)

  const onPlayClick = () => {
    setPlay((prevPlay) => !prevPlay)
  }

  const PlayIcon = () => (play ? <PauseCircleFilled /> : <PlayCircleFilled />)

  return (
    <div className='player-controls'>
      <Button
        type='primary'
        icon={<StepBackwardFilled />}
        size='large'
      ></Button>
      <Button
        type='primary'
        icon={<PlayIcon />}
        size='large'
        onClick={onPlayClick}
      ></Button>
      <Button type='primary' icon={<StepForwardFilled />} size='large'></Button>
    </div>
  )
}

export default Player

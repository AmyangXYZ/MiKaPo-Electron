import { useState } from 'react'
import Video from './components/Video'
import MMDScene from './components/MMDScene'
import * as poseDetection from '@tensorflow-models/pose-detection'

function App(): JSX.Element {
  const [pose, setPose] = useState<poseDetection.Pose | null>(null)
  const [fps, setFps] = useState<number>(0)
  return (
    <>
      <div>
        <p>FPS: {fps}</p>
        <p>poses: {pose?.keypoints3D!.length}</p>
        <Video setPose={setPose}></Video>
        <MMDScene pose={pose} setFps={setFps}></MMDScene>
      </div>
    </>
  )
}

export default App

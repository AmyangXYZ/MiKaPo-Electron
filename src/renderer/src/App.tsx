import { useState } from 'react'
import Video from './Video'
import MMDScene from './MMDScene'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import Chat from './Chat'

import Titlebar from './Titlebar'

function App(): JSX.Element {
  const [pose, setPose] = useState<NormalizedLandmark[] | null>(null)
  const [face, setFace] = useState<NormalizedLandmark[] | null>(null)
  const [leftHand, setLeftHand] = useState<NormalizedLandmark[] | null>(null)
  const [rightHand, setRightHand] = useState<NormalizedLandmark[] | null>(null)
  const [isTitlebarVisible, setIsTitlebarVisible] = useState(false)
  return (
    <div onClick={() => setIsTitlebarVisible(false)}>
      <Titlebar isTitlebarVisible={isTitlebarVisible} setIsTitlebarVisible={setIsTitlebarVisible} />
      <Video
        setPose={setPose}
        setFace={setFace}
        setLeftHand={setLeftHand}
        setRightHand={setRightHand}
      />
      <MMDScene pose={pose} face={face} leftHand={leftHand} rightHand={rightHand} />
      <Chat />
    </div>
  )
}

export default App

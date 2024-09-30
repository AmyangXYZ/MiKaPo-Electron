import { useState } from 'react'
import Video from './Video'
import MMDScene from './MMDScene'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import Chat from './Chat'

import Titlebar from './Titlebar'

function App(): JSX.Element {
  const [pose, setPose] = useState<NormalizedLandmark[] | null>(null)
  const [face, setFace] = useState<NormalizedLandmark[] | null>(null)
  const [isTitlebarVisible, setIsTitlebarVisible] = useState(false)
  return (
    <div onClick={() => setIsTitlebarVisible(false)}>
      <Titlebar isTitlebarVisible={isTitlebarVisible} setIsTitlebarVisible={setIsTitlebarVisible} />
      <Video setPose={setPose} setFace={setFace} />
      <MMDScene pose={pose} face={face} />
      <Chat />
    </div>
  )
}

export default App

import { useState } from 'react'
import Video from './Video'
import MMDScene from './MMDScene'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import Chat from './Chat'
import { AccessibilityNew } from '@mui/icons-material'
import { IconButton } from '@mui/material'

function App(): JSX.Element {
  const [pose, setPose] = useState<NormalizedLandmark[] | null>(null)
  const [face, setFace] = useState<NormalizedLandmark[] | null>(null)

  const handleMMDModelUpload = (): void => {
    window.electron.ipcRenderer.send('dialog-char', {})
  }

  return (
    <>
      {pose === null && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <h3>Initializing AI and MMD...</h3>
        </div>
      )}
      <div className="toolbar">
        <IconButton color="info" component="label" onClick={handleMMDModelUpload}>
          <AccessibilityNew />
        </IconButton>
      </div>
      <Video setPose={setPose} setFace={setFace}></Video>
      <MMDScene pose={pose} face={face}></MMDScene>
      <Chat></Chat>
    </>
  )
}

export default App

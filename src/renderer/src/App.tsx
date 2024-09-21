import { useRef, useState } from 'react'
import Video from './Video'
import MMDScene from './MMDScene'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'
import Chat from './Chat'
import { AccessibilityNew, Movie, Videocam } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const defaultVideoSrc = './zhiyin.mp4'

function App(): JSX.Element {
  const [pose, setPose] = useState<NormalizedLandmark[] | null>(null)
  const [face, setFace] = useState<NormalizedLandmark[] | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState<string>(defaultVideoSrc)
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false)

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
    }
  }

  const handleMMDModelUpload = (): void => {
    window.electron.ipcRenderer.send('dialog-char', {})
  }

  const toggleCamera = async (): Promise<void> => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
      setIsCameraActive(false)
      // Set the video source after disabling the camera
      setVideoSrc(defaultVideoSrc)
      if (videoRef.current) {
        videoRef.current.srcObject = null
        videoRef.current.src = defaultVideoSrc
        videoRef.current.load()
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        setIsCameraActive(true)
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }
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

        <IconButton color="secondary" component="label" disabled={isCameraActive}>
          <Movie />
          <VisuallyHiddenInput
            type="file"
            onChange={handleVideoUpload}
            accept="video/*"
            disabled={isCameraActive}
          />
        </IconButton>

        <IconButton onClick={toggleCamera} color="error">
          <Videocam />
        </IconButton>
      </div>
      <Video
        videoSrc={videoSrc}
        videoRef={videoRef}
        isCameraActive={isCameraActive}
        setPose={setPose}
        setFace={setFace}
      ></Video>
      <MMDScene pose={pose} face={face}></MMDScene>
      <Chat></Chat>
    </>
  )
}

export default App

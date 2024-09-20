import { useEffect, useRef, useState } from 'react'

import {
  FilesetResolver,
  PoseLandmarker,
  NormalizedLandmark,
  FaceLandmarker
} from '@mediapipe/tasks-vision'
import { IconButton } from '@mui/material'
import { Videocam, CloudUpload, Settings } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const defaultVideoSrc = './zhiyin.mp4'

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

function Video({
  setPose,
  setFace
}: {
  setPose: (pose: NormalizedLandmark[]) => void
  setFace: (face: NormalizedLandmark[]) => void
}): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState<string>(defaultVideoSrc)
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
      }
    }
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

  useEffect(() => {
    FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    ).then(async (vision) => {
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        minPosePresenceConfidence: 0.5,
        minPoseDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputSegmentationMasks: false
      })
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU'
        },

        runningMode: 'VIDEO',
        outputFaceBlendshapes: true,
        numFaces: 1,
        minFacePresenceConfidence: 0.2,
        minFaceDetectionConfidence: 0.2
      })

      let lastTime = performance.now()
      const detect = (): void => {
        if (
          videoRef.current &&
          lastTime != videoRef.current.currentTime &&
          videoRef.current.videoWidth > 0
        ) {
          lastTime = videoRef.current.currentTime
          poseLandmarker.detectForVideo(videoRef.current, performance.now(), (result) => {
            setPose(result.worldLandmarks[0])
          })

          const faceResult = faceLandmarker.detectForVideo(videoRef.current, performance.now(), {})
          setFace(faceResult.faceLandmarks[0])
        }
        requestAnimationFrame(detect)
      }
      detect()
    })
  }, [setPose, setFace])

  return (
    <div className="videoContainer">
      <div className="toolbar">
        <IconButton color="info" component="label">
          <Settings />
        </IconButton>

        <IconButton color="secondary" component="label" disabled={isCameraActive}>
          <CloudUpload />
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileUpload}
            accept="video/*"
            disabled={isCameraActive}
          />
        </IconButton>

        <IconButton onClick={toggleCamera} color="error">
          <Videocam />
        </IconButton>
      </div>

      <video
        ref={videoRef}
        controls={!isCameraActive}
        playsInline
        disablePictureInPicture
        controlsList="nofullscreen noremoteplayback"
        src={isCameraActive ? undefined : videoSrc}
      />
    </div>
  )
}

export default Video

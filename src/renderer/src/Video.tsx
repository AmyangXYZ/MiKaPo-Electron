import { useEffect, useRef } from 'react'

import { FilesetResolver, NormalizedLandmark, HolisticLandmarker } from '@mediapipe/tasks-vision'

function Video({
  setPose,
  setFace,
  setLeftHand,
  setRightHand
}: {
  setPose: (pose: NormalizedLandmark[]) => void
  setFace: (face: NormalizedLandmark[]) => void
  setLeftHand: (leftHand: NormalizedLandmark[]) => void
  setRightHand: (rightHand: NormalizedLandmark[]) => void
}): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm'
    ).then(async (vision) => {
      const holisticLandmarker = await HolisticLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/holistic_landmarker/holistic_landmarker/float16/latest/holistic_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO'
      })

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      let lastTime = performance.now()
      const detect = (): void => {
        if (
          videoRef.current &&
          lastTime != videoRef.current.currentTime &&
          videoRef.current.videoWidth > 0
        ) {
          lastTime = videoRef.current.currentTime
          holisticLandmarker.detectForVideo(videoRef.current, performance.now(), (result) => {
            if (result.poseWorldLandmarks[0]) {
              setPose(result.poseWorldLandmarks[0])
            } else {
              setPose([])
            }
            if (result.faceLandmarks && result.faceLandmarks.length > 0) {
              setFace(result.faceLandmarks[0])
            } else {
              setFace([])
            }
            if (result.leftHandWorldLandmarks && result.leftHandWorldLandmarks.length > 0) {
              setLeftHand(result.leftHandWorldLandmarks[0])
            } else {
              setLeftHand([])
            }
            if (result.rightHandWorldLandmarks && result.rightHandWorldLandmarks.length > 0) {
              setRightHand(result.rightHandWorldLandmarks[0])
            } else {
              setRightHand([])
            }
          })
        }
        requestAnimationFrame(detect)
      }
      detect()
    })
  }, [setPose, setFace, videoRef])

  return (
    <div className="videoContainer">
      <video ref={videoRef} playsInline />
    </div>
  )
}

export default Video

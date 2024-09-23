import { useEffect } from 'react'

import { FilesetResolver, NormalizedLandmark, HolisticLandmarker } from '@mediapipe/tasks-vision'

function Video({
  videoSrc,
  videoRef,
  isCameraActive,
  setPose,
  setFace
}: {
  videoSrc: string
  videoRef: React.RefObject<HTMLVideoElement>
  isCameraActive: boolean
  setPose: (pose: NormalizedLandmark[]) => void
  setFace: (face: NormalizedLandmark[]) => void
}): JSX.Element {
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
          })
        }
        requestAnimationFrame(detect)
      }
      detect()
    })
  }, [setPose, setFace, videoRef])

  return (
    <div className="videoContainer">
      <video
        ref={videoRef}
        controls={!isCameraActive}
        playsInline
        disablePictureInPicture
        controlsList="nofullscreen noremoteplayback"
        src={isCameraActive ? undefined : videoSrc}
        preload="auto"
      />
    </div>
  )
}

export default Video

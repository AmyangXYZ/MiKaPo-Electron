import { useEffect } from 'react'

import {
  FilesetResolver,
  PoseLandmarker,
  NormalizedLandmark,
  FaceLandmarker
} from '@mediapipe/tasks-vision'

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

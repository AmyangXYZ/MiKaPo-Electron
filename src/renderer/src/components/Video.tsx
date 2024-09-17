import { useEffect, useRef } from 'react'
import '@tensorflow/tfjs-backend-webgl'
import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'

function Video({ setPose }: { setPose: (pose: poseDetection.Pose | null) => void }): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const initPoseDetector = async (): Promise<void> => {
      await tf.ready()

      const model = poseDetection.SupportedModels.BlazePose
      const detector = await poseDetection.createDetector(model, {
        runtime: 'mediapipe',
        modelType: 'full',
        solutionPath: `/mediapipe/`
      })
      const detectPose = async (): Promise<void> => {
        const poses = await detector.estimatePoses(videoRef.current!, {
          maxPoses: 1,
          flipHorizontal: false
        })

        if (poses.length > 0) {
          setPose(poses[0])
        }
        requestAnimationFrame(() => detectPose())
      }
      if (videoRef.current) {
        detectPose()
      }
    }
    initPoseDetector()
  }, [])
  return (
    <video ref={videoRef} className="videoPlayer" controls>
      <source src="./blue.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

export default Video

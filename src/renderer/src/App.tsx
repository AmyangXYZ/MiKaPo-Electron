import { useEffect, useRef, useState } from 'react'
import Video from './Video'
import MMDScene from './MMDScene'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'

function App(): JSX.Element {
  const [pose, setPose] = useState<NormalizedLandmark[] | null>(null)
  const [face, setFace] = useState<NormalizedLandmark[] | null>(null)
  const [fps, setFps] = useState<number>(0)
  const chat = useRef<string>('')

  useEffect(() => {
    const generate = async (): Promise<void> => {
      try {
        const response = await window.ollamaAPI.generate('llama3.1', 'hello')
        chat.current = response.response
      } catch (error) {
        console.error(error)
      }
    }
    generate()
  }, [])
  return (
    <>
      {pose === null && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <h3>Initializing AI and MMD...</h3>
        </div>
      )}
      <header className="header">
        <a href="https://github.com/AmyangXYZ/MiKaPo">
          <h2>MiKaPo</h2>
        </a>
        <p>FPS: {fps}</p>
        <a href="https://github.com/AmyangXYZ/MiKaPo-electron">
          <h4>Download</h4>
        </a>
        <p>ollama:{chat.current}</p>
      </header>
      <div className="container">
        <Video setPose={setPose} setFace={setFace}></Video>
        <MMDScene pose={pose} face={face} setFps={setFps}></MMDScene>
      </div>
    </>
  )
}

export default App

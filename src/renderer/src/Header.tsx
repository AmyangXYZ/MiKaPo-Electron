import { useEffect } from 'react'

interface HeaderProps {
  fps: number
}

function Header({ fps }: HeaderProps): JSX.Element {
  useEffect(() => {
    const generate = async (): Promise<void> => {
      const response = await window.ollamaAPI.generate('llama3.1', 'Hello, world!')
      console.log(response.response)
    }
    generate()
  }, [])
  return (
    <header className="header">
      <a href="https://github.com/AmyangXYZ/MiKaPo">
        <h2>MiKaPo</h2>
      </a>
      <p>FPS: {fps}</p>
      <a href="https://github.com/AmyangXYZ/MiKaPo-electron">
        <h4>Download</h4>
      </a>
    </header>
  )
}

export default Header

import { useEffect, useRef } from 'react'

function Chat(): JSX.Element {
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
  return <div className="chat">{chat.current}</div>
}

export default Chat

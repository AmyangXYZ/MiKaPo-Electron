import { useRef } from 'react'

import { AccessibilityNew, Close, Fullscreen, Remove } from '@mui/icons-material'
import { IconButton } from '@mui/material'

function Titlebar({
  isTitlebarVisible,
  setIsTitlebarVisible
}: {
  isTitlebarVisible: boolean
  setIsTitlebarVisible: (isTitlebarVisible: boolean) => void
}): JSX.Element {
  const titlebarContainerRef = useRef<HTMLDivElement>(null)

  const handleMMDModelUpload = (): void => {
    window.electron.ipcRenderer.send('dialog-char', {})
  }

  const handleMinimize = (): void => {
    window.electron.ipcRenderer.send('minimize')
  }

  const handleFullscreen = (): void => {
    window.electron.ipcRenderer.send('fullscreen')
  }

  const handleClose = (): void => {
    window.electron.ipcRenderer.send('quit')
  }

  return (
    <div
      className="titlebar-container"
      ref={titlebarContainerRef}
      onMouseEnter={() => setIsTitlebarVisible(true)}
    >
      {isTitlebarVisible && (
        <div className="titlebar">
          <IconButton
            className="titlebar-item"
            color="error"
            component="label"
            onClick={handleMMDModelUpload}
            size="small"
          >
            <AccessibilityNew />
          </IconButton>
          <div className="titlebar-item">
            <IconButton color="secondary" component="label" onClick={handleMinimize} size="small">
              <Remove />
            </IconButton>
            <IconButton color="secondary" component="label" onClick={handleFullscreen} size="small">
              <Fullscreen />
            </IconButton>
            <IconButton color="secondary" component="label" onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default Titlebar

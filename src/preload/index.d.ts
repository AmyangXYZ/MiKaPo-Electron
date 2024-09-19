import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    ollamaAPI: {
      generate: (modelName: string, prompt: string) => Promise<{ response }>
    }
  }
}

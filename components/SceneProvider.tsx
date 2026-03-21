'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type Scene = 'insight' | 'topics' | 'creation'

interface SceneContextType {
  scene: Scene
  setScene: (scene: Scene) => void
}

const SceneContext = createContext<SceneContextType>({
  scene: 'insight',
  setScene: () => {},
})

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [scene, setSceneState] = useState<Scene>('topics')

  const setScene = useCallback((next: Scene) => {
    setSceneState(next)
    if (next === 'creation') {
      window.dispatchEvent(new CustomEvent('scene:enter-creation'))
    }
  }, [])

  return (
    <SceneContext.Provider value={{ scene, setScene }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  return useContext(SceneContext)
}

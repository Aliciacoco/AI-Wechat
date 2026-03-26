'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { SchoolProfile } from '@/data/school-profiles'

type Scene = 'insight' | 'topics' | 'creation' | 'review'

interface SceneContextType {
  scene: Scene
  setScene: (scene: Scene) => void
  currentSchool: SchoolProfile | null
  setCurrentSchool: (school: SchoolProfile | null) => void
}

const SceneContext = createContext<SceneContextType>({
  scene: 'insight',
  setScene: () => {},
  currentSchool: null,
  setCurrentSchool: () => {},
})

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [scene, setSceneState] = useState<Scene>('topics')
  const [currentSchool, setCurrentSchool] = useState<SchoolProfile | null>(null)

  const setScene = useCallback((next: Scene) => {
    setSceneState(next)
    if (next === 'creation') {
      window.dispatchEvent(new CustomEvent('scene:enter-creation'))
    }
  }, [])

  return (
    <SceneContext.Provider value={{ scene, setScene, currentSchool, setCurrentSchool }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  return useContext(SceneContext)
}

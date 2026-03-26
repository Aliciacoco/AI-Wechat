'use client'

import { useScene } from './SceneProvider'
import InsightScene from './scenes/InsightScene'
import TopicsScene from './scenes/TopicsScene'
import CreationScene from './scenes/CreationScene'
import ReviewScene from './scenes/ReviewScene'

export default function SceneContent() {
  const { scene } = useScene()

  return (
    <>
      <div style={{ display: scene === 'insight' ? 'block' : 'none' }}>
        <InsightScene />
      </div>
      <div style={{ display: scene === 'topics' ? 'block' : 'none' }}>
        <TopicsScene />
      </div>
      <div style={{ display: scene === 'creation' ? 'block' : 'none' }}>
        <CreationScene />
      </div>
      <div style={{ display: scene === 'review' ? 'block' : 'none' }}>
        <ReviewScene />
      </div>
    </>
  )
}


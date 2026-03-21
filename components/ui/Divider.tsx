import { tokens } from '@/lib/design-tokens'
import { CSSProperties } from 'react'

interface DividerProps {
  /** 方向，默认水平 */
  vertical?: boolean
  className?: string
  style?: CSSProperties
}

export default function Divider({ vertical = false, className = '', style }: DividerProps) {
  if (vertical) {
    return (
      <div
        className={className}
        style={{
          width: '1px',
          alignSelf: 'stretch',
          backgroundColor: tokens.color.divider,
          flexShrink: 0,
          ...style,
        }}
      />
    )
  }
  return (
    <div
      className={className}
      style={{
        height: '1px',
        width: '100%',
        backgroundColor: tokens.color.divider,
        ...style,
      }}
    />
  )
}

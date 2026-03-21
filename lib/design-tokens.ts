/**
 * 设计规范 Token
 * 来源：AI专用设计规范.md
 *
 * 使用方式：
 *   import { tokens } from '@/lib/design-tokens'
 *   style={{ color: tokens.color.text.primary }}
 */

export const tokens = {
  // ── 色彩体系 ───────────────────────────────────────────────
  color: {
    // 底色
    base: {
      white: '#FFFFFF',
      gray: '#FBFBFD', // Apple 灰
    },
    // 文字
    text: {
      primary: '#1D1D1F',   // 标题
      secondary: '#424245', // 正文
      tertiary: '#86868B',  // 辅助
    },
    // 品牌色 —— 仅用于关键行动点（CTA）
    accent: '#0071E3',
    // 分割线
    divider: '#F2F2F2',
    // 边框
    border: '#E5E5E5',
  },

  // ── 字体与排版 ─────────────────────────────────────────────
  typography: {
    fontFamily: {
      zh: '"PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif',
      en: '"SF Pro Rounded", "Inter", sans-serif',
    },
    // 字阶
    size: {
      h1: '32px',
      body: '16px',
      label: '12px',
    },
    // 字重
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
    },
    // 行高 / 字间距
    lineHeight: {
      body: 1.6,
      tight: 1.2,
    },
    letterSpacing: {
      h1: '-0.02em',
      body: '0',
      label: '0.05em', // 英文 label 增加字间距
    },
  },

  // ── 圆角 ───────────────────────────────────────────────────
  radius: {
    card: '20px',       // 容器 / 卡片
    cardLg: '24px',     // 大容器
    button: '99px',     // 胶囊按钮（全圆角）
    buttonSm: '12px',   // 小方按钮
    modal: '20px',      // 弹窗
  },

  // ── 阴影 ───────────────────────────────────────────────────
  // 禁止使用大扩散投影，仅允许以下两种
  shadow: {
    none: 'none',
    diffuse: '0 2px 8px rgba(0,0,0,0.04)', // 极淡弥散影，区分层级
  },

  // ── 间距 ───────────────────────────────────────────────────
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
} as const

// 快捷类型导出
export type DesignTokens = typeof tokens

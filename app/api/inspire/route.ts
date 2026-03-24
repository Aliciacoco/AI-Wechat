import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { TOPIC_STRATEGY_PROMPT_TEXT } from '@/lib/prompts'

export const runtime = 'nodejs'
export const maxDuration = 60

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
  timeout: 55000,
  maxRetries: 0,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // messages: { role: 'user' | 'assistant', content: string }[]
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: '缺少消息参数' }), { status: 400 })
    }

    const stream = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: TOPIC_STRATEGY_PROMPT_TEXT },
        ...messages,
      ],
      temperature: 0.8,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: any) {
    console.error('Inspire API error:', error)
    return new Response(JSON.stringify({ error: error?.message || '生成失败，请重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

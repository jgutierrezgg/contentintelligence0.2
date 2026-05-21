import { useState, useCallback } from 'react'

export function useAgentChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages)
  const [typing, setTyping] = useState(false)

  const addAgentMessage = useCallback((text, delayMs = 1200) => {
    setTyping(true)
    return new Promise(resolve => {
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { role: 'agent', text }])
        resolve()
      }, delayMs)
    })
  }, [])

  const addUserMessage = useCallback((text) => {
    setMessages(m => [...m, { role: 'user', text }])
  }, [])

  const reset = useCallback(() => {
    setMessages(initialMessages)
    setTyping(false)
  }, [initialMessages])

  return { messages, typing, addAgentMessage, addUserMessage, reset }
}

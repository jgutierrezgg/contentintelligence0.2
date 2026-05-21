import { useState, useEffect } from 'react'

export function useAutoProcess(steps, intervalMs = 1800) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (currentStep >= steps.length) {
      setFinished(true)
      return
    }
    const t = setTimeout(() => {
      setCompletedSteps(d => [...d, currentStep])
      setCurrentStep(c => c + 1)
    }, intervalMs)
    return () => clearTimeout(t)
  }, [currentStep, steps.length, intervalMs])

  return { currentStep, completedSteps, finished }
}

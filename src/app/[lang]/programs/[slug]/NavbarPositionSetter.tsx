'use client'

import { useEffect } from 'react'
import { useNavbarStore } from '@/store/navbar-store'

export default function NavbarPositionSetter() {
  const { setFixed, setIsProgram } = useNavbarStore()

  useEffect(() => {
    setFixed(true)
    setIsProgram(true)
    
    return () => {
      setFixed(false)
      setIsProgram(false)
    }
  }, [setFixed, setIsProgram])

  return null
}

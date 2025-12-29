"use client"
import { useCallback } from "react"
import { Button } from "react-aria-components"
import { someAction } from "./actions/some.action"

export default function Home() {


  const handleClick = useCallback(async () => {
    alert(await someAction())
  }, [])

  return (
    <Button onPress={handleClick}>Click me</Button>
  )
}

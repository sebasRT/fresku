"use client"
import { useState } from "react"
import { useEventListener } from 'usehooks-ts'

const useConnection = () => {
    const [isConnected, setIsConnected] = useState(true)

    useEventListener("online", () => setIsConnected(true))
    useEventListener("offline", () => setIsConnected(false))

    return { isConnected }
}

export default useConnection
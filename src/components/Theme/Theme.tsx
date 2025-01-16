"use client"

import React from "react"
import dynamic from "next/dynamic"

const ChakraUI = dynamic(() => import("@/components/Theme/Chakra-ui"), { ssr: false })

export default function Theme(props: { children: React.ReactNode }) {
    return (
        <ChakraUI>
            {props.children}
        </ChakraUI>
    )
}
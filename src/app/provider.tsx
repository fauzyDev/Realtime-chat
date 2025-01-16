"use client"

import React from "react"
import Theme from "@/components/Theme/Theme"

export default function Provider(props: { children: React.ReactNode }) {
  return (
    <Theme>
      {props.children}
    </Theme>
  )
}
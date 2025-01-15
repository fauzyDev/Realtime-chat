"use client"

import React from "react";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Home/Chat"), { ssr: false })

export default function Home() {
  return ( <Chat/> )
}
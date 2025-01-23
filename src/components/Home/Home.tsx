"use client"

import React from "react";
import dynamic from "next/dynamic";
import { Flex } from "@chakra-ui/react";

const Chat = dynamic(() => import("@/components/Chat/Chat"), { ssr: false })

export default function Home() {
  return (
    <Flex direction="column" w="100vw" h="100vh" p={4}>
      <Chat/> 
    </Flex>
  ) 
}
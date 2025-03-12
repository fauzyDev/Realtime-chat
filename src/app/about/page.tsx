"use client"

import React from 'react'
import { User } from '@/libs/types'

export default function Home() {
    const [users, setUsers] = React.useState<User[]>([])

    React.useEffect(() => {
        async function fetchUsers() {
              try {
                
                  const res = await fetch("http://localhost:3000/api/cache/users")
                  const data = await res.json()
                  
                  setUsers(data)
              } catch (error) {
                console.error("error", error)
                 setUsers([]);
              }
            }
            fetchUsers()
    }, [])
    console.log("data", users)

    return (
    <div>{users.map((index) => (
        <li key={index.id}>{index.name}</li>
    ))}</div>
  )
}

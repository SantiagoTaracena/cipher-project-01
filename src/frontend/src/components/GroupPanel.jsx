import React, { useState, useEffect } from 'react'
import axios from 'axios'

const GroupPanel = ({ groupId }) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/messages/groups/${groupId}`)
    .then((response) => {
      setMessages(response.data)
    })
    .catch((error) => console.error('Error al realizar la solicitud', error))    
  }, [groupId])

  return (
    <div>
      {messages && messages.map((message, index) => (
        <div key={index}>
          <h1>{message.id}</h1>
          <h2>{message.author}: {message.mensaje}</h2>
        </div>
      ))}
    </div>
  )
}

export default GroupPanel

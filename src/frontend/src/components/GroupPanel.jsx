import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '../components/Button'
import '../styles/group-panel.sass'

const GroupPanel = ({ groupId, closeMail }) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/messages/groups/${groupId}`)
    .then((response) => {
      setMessages(response.data)
    })
    .catch((error) => console.error('Error al realizar la solicitud', error))    
  }, [groupId])

  return (
    <div className="group-panel-container">
      <div className="group-messages">
        {messages && messages.map((message, index) => (
          <div
            key={index}
            className="group-message"
          >
            <h2>{message.author}: {message.mensaje}</h2>
          </div>
        ))}
      </div>
      <div className="close-group-button">
        <Button
          buttonText="Cerrar Correo"
          type="button"
          onClick={() => closeMail(0)}
        />
      </div>
    </div>
  )
}

export default GroupPanel

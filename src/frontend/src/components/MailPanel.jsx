import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Button from '../components/Button'
import '../styles/mail-panel.sass'

const MailPanel = ({ emisor, closeMail }) => {
  const [messages, setMessages] = useState([])

  const { user } = useContext(UserContext)

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${import.meta.env.VITE_APP_API_URL}/messages/${user.username}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: { privateKey: user.privateKey }
    })
      .then((response) => {
        const fetchedMessages = response.data
        const messagesToShow = []
        fetchedMessages.forEach((fetchedMessage) => {
          const receivedMessage = ((fetchedMessage.username_origen === emisor) && (fetchedMessage.username_destino === user.username))
          if (receivedMessage) {
            messagesToShow.push(fetchedMessage)
          }
        })
        setMessages(messagesToShow)
      })
      .catch((error) => console.error('Error al realizar la solicitud', error))
  }, [emisor, user])

  return (
    <div className="mail-panel">
      <div className="mail-information">
        <div className="mail-emisor-receptor">
          <h3 className="emisor">Chat con: {emisor}</h3>
        </div>
        <div className="mail-message">
          {messages.map((message, index) => (
            <div key={index} className="message-box"><b>{message.username_origen}</b>: {message.message}</div>
          ))}
        </div>
      </div>
      <div className="close-mail-button">
        <Button buttonText="Cerrar Correo" type="button" onClick={() => closeMail(0)} />
      </div>
    </div>
  )
}

export default MailPanel

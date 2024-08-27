import React, { useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Button from '../components/Button'
import '../styles/write-mail.sass'

const WriteMail = () => {
  const [receptor, setReceptor] = useState('')
  const [message, setMessage] = useState('')

  const handleReceptorChange = (event) => {
    setReceptor(event.target.value)
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const { user } = useContext(UserContext)

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = { emisor: user.username, receptor, message }
    const token = localStorage.getItem('token')
    axios.post(`${import.meta.env.VITE_APP_API_URL}/messages/${receptor}`, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => alert('Mensaje enviado', response.data[0]))
      .catch((error) => console.error('Error al realizar la solicitud', error))
  }

  return (
    <div className="write-mail-container">
      <div className="receptor-input-container">
        <div className="receptor-to">
          <h3>Para:</h3>
        </div>
        <input
          type="text"
          id="receptor-input"
          className="receptor-input"
          value={receptor}
          onChange={handleReceptorChange}
        />
      </div>
      <div className="write-mail-content">
        <textarea
          id="content-input"
          className="content-input"
          value={message}
          onChange={handleMessageChange}
        />
      </div>
      <div className="send-button-container">
        <Button buttonText="Enviar Correo" type="button" onClick={handleSubmit} />
      </div>
    </div>
  )
}

export default WriteMail

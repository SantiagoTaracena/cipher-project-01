import React from 'react'
import Button from '../components/Button'
import '../styles/write-mail.sass'

const WriteMail = () => {
  return (
    <div className="write-mail-container">
      <div className="receptor-input-container">
        <div className="receptor-to">
          <h3>Para:</h3>
        </div>
        <input className="receptor-input" />
      </div>
      <div className="write-mail-content">
        <textarea className="content-input" />
      </div>
      <div className="send-button-container">
        <Button
          buttonText="Enviar Correo"
          type="button"
          onClick={() => console.log('Enviado')}
        />
      </div>
    </div>
  )
}

export default WriteMail

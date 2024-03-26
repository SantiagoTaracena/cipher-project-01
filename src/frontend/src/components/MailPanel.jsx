import React from 'react'
import Button from '../components/Button'
import '../styles/mail-panel.sass'

const MailPanel = ({ emisor, receptor, content, closeMail }) => (
  <div className="mail-panel">
    <div className="mail-information">
      <div className="mail-emisor-receptor">
        <h3 className="emisor">De: {emisor}</h3>
        <h3 className="receptor">Para: {receptor}</h3>
      </div>
      <div className="mail-message">
        <p>{content}</p>
      </div>
    </div>
    <div className="close-mail-button">
      <Button
        buttonText="Cerrar Correo"
        type="button"
        onClick={() => closeMail(0)}
      />
    </div>
  </div>
)

export default MailPanel

import React from 'react'
import '../styles/mail-panel.sass'

const MailPanel = ({ emisor, receptor, content, closeMail }) => {
  return (
    <div className="mail-panel">
      <h3>De: {emisor}</h3>
      <h3>Para: {receptor}</h3>
      <h4>{content}</h4>
      <button onClick={() => closeMail(0)}>Close Mail</button>
    </div>
  )
}

export default MailPanel

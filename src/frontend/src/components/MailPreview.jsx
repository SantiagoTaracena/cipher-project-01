import React from 'react'
import '../styles/mail-preview.sass'

const MailPreview = ({ emisor, content, onClick }) => (
  <div class="mail-container" onClick={onClick}>
    <h3>De: {emisor}</h3>
    <p>{content.length > 50 ? `${content.substring(0, 50)}...` : content}</p>
  </div>
)

export default MailPreview

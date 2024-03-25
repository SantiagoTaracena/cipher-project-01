import React, { useState, useEffect } from 'react'
import MailPreview from '../components/MailPreview'
import '../styles/mail.sass'

const dummyMails = [
  {
    id: 0,
    mensaje_cifrado: 'asdfjñkla',
    username_destino: 'tar20017',
    username_origen: 'arr20188',
  },
  {
    id: 1,
    mensaje_cifrado: 'jdslfñasdf',
    username_destino: 'tar20017',
    username_origen: 'lop20679',
  },
]

const Mail = () => {
  const [mails, setMails] = useState([])
  const [focusedMail, setFocusedMail] = useState(0)
  const [currentMail, setCurrentMail] = useState({ id: 0, mensaje_cifrado: '', username_destino: '', username_origen: '' })
  const [redacting, setRedacting] = useState(false)

  useEffect(() => {
    setMails(dummyMails)
  }, [])

  return (
    <main className="main">
      <header className="header">
        <div style={{ visibility: 'hidden' }}>
          <h5>Nuevo Mail</h5>
          <h5>Cerrar Sesión</h5>
        </div>
        <h1>Proyecto de Cifrado</h1>
        <div>
          <h5 onClick={() => setRedacting(true)}>Nuevo Mail</h5>
          <h5>Cerrar Sesión</h5>
        </div>
      </header>
      <div className="content">
        <div className="mail-list">
          {mails.map((mail) => (
            <MailPreview
              emisor={mail.username_origen}
              content={mail.mensaje_cifrado}
              onClick={() => {
                const mailId = mail.id
                setFocusedMail(mailId + 1)
                setCurrentMail(dummyMails.find((mail) => (mail.id === mailId)))
                setRedacting(false)
              }}
            />
          ))}
        </div>
        <div className="mail-content">
          {(focusedMail) ? (
            <>
              {(redacting) ? (
                <h1>Hola</h1>
              ) : (
                <>
                  <h1>{focusedMail}</h1>
                  <h3>De: {currentMail.username_origen}</h3>
                  <h3>Para: {currentMail.username_destino}</h3>
                  <h4>{currentMail.mensaje_cifrado}</h4>
                  <button onClick={() => setFocusedMail(0)}>Quit</button>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default Mail

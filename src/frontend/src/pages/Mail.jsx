import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import MailPreview from '../components/MailPreview'
import MailPanel from '../components/MailPanel'
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
  {
    id: 2,
    mensaje_cifrado: 'jfslkkjsflfsjlksfjlkasjlkñsjlkñjlkñfñjlkasñjldsjlkñajñlkajñlkfdsjlkñasjklfñajlsfdjñlkañjlkd',
    username_destino: 'tar20017',
    username_origen: 'par20117',
  },
]

const Mail = () => {
  const [mails, setMails] = useState([])
  const [focusedMail, setFocusedMail] = useState(0)
  const [currentMail, setCurrentMail] = useState({ id: 0, mensaje_cifrado: '', username_destino: '', username_origen: '' })

  useEffect(() => {
    setMails(dummyMails)
  }, [])

  const updateFocusedMail = (mail) => {
    const mailId = mail.id
    setFocusedMail(mailId + 1)
    const foundMail = dummyMails.find((mail) => (mail.id === mailId))
    setCurrentMail(foundMail)
  }

  return (
    <main className="main">
      <header className="header">
        <Header />
      </header>
      <div className="content">
        <div className="mail-list">
          {mails.map((mail) => (
            <MailPreview
              emisor={mail.username_origen}
              content={mail.mensaje_cifrado}
              onClick={() => updateFocusedMail(mail)}
            />
          ))}
        </div>
        <div className="mail-content">
          {(focusedMail) ? (
            <MailPanel
              emisor={currentMail.username_origen}
              receptor={currentMail.username_destino}
              content={currentMail.mensaje_cifrado}
              closeMail={setFocusedMail}
            />
          ) : (
            <h1>Hola</h1>
          )}
        </div>
      </div>
    </main>
  )
}

export default Mail

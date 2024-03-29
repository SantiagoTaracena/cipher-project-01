import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Header from '../components/Header'
import MailPreview from '../components/MailPreview'
import MailPanel from '../components/MailPanel'
import WriteMail from '../components/WriteMail'
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
    mensaje_cifrado: 'asdf',
    username_destino: 'tar20017',
    username_origen: 'par20117',
  },
]

const Mail = () => {
  const [unparsedMails, setUnparsedMails] = useState([])
  const [mails, setMails] = useState([])
  const [focusedMail, setFocusedMail] = useState(0)
  const [currentMail, setCurrentMail] = useState({ id: 0, mensaje_cifrado: '', username_destino: '', username_origen: '' })

  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/messages/${user.username}`)
    .then((response) => setUnparsedMails(response.data))
    .catch((error) => console.error('Error al realizar la solicitud', error))
    console.log(unparsedMails)
    const parsedMails = []
    unparsedMails.forEach((unparsedMail) => {
      const parsedMail = {
        id: unparsedMail[0],
        mensaje_cifrado: unparsedMail[1],
        username_destino: unparsedMail[2],
        username_origen: unparsedMail[3],
      }
      parsedMails.push(parsedMail)
    })
    setMails(parsedMails)
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
          {mails.map((mail, index) => (
            <MailPreview
              key={index}
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
            <WriteMail />
          )}
        </div>
      </div>
    </main>
  )
}

export default Mail

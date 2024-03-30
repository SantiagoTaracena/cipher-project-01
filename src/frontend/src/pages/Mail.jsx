import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Header from '../components/Header'
import MailPreview from '../components/MailPreview'
import GroupPreview from '../components/GroupPreview'
import MailPanel from '../components/MailPanel'
import WriteMail from '../components/WriteMail'
import '../styles/mail.sass'

const Mail = () => {
  const [personalMails, setPersonalMails] = useState(true)
  const [mails, setMails] = useState([])
  const [groups, setGroups] = useState([])
  const [focusedMail, setFocusedMail] = useState(0)
  const [currentMail, setCurrentMail] = useState({ id: 0, mensaje_cifrado: '', username_destino: '', username_origen: '' })

  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    switchMails()
  }, [personalMails])

  const switchMails = () => {
    if (personalMails) {
      axios.get(`${import.meta.env.VITE_APP_API_URL}/messages/${user.username}`)
      .then((response) => {
        const unparsedMails = response.data
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
      })
      .catch((error) => console.error('Error al realizar la solicitud', error))
    } else {
      axios.get(`${import.meta.env.VITE_APP_API_URL}/groups`)
      .then((response) => {
        const groups = response.data
        const groupsToShow = []
        groups.forEach((group) => {
          if (group[2].includes(user.username)) {
            groupsToShow.push(group)
          }
        })
        setGroups(groupsToShow)
      })
      .catch((error) => console.error('Error al realizar la solicitud', error))
    }
  }

  const updateFocusedMail = (mail) => {
    const mailId = mail.id
    setFocusedMail(mailId + 1)
    const foundMail = mails.find((mail) => (mail.id === mailId))
    setCurrentMail(foundMail)
  }

  return (
    <main className="main">
      <header className="header">
        <Header />
      </header>
      <div className="content">
        <div className="mail-list">
          <div className="mail-category-menu">
            <h3 onClick={() => setPersonalMails(true)}>Mails personales</h3>
            <h3 onClick={() => setPersonalMails(false)}>Mails grupales</h3>
          </div>
          {(personalMails) ? (
            <div>
              {mails.map((mail, index) => (
                <MailPreview
                  key={index}
                  emisor={mail.username_origen}
                  content={mail.mensaje_cifrado}
                  onClick={() => updateFocusedMail(mail)}
                />
              ))}
            </div>
          ) : (
            <div>
              {groups.map((group, index) => (
                <GroupPreview
                  key={index}
                  onClick={() => console.log('group', group[1])}
                  groupName={group[1]}
                />
              ))}
            </div>
          )}
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

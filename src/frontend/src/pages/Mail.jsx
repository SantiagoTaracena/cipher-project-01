import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Header from '../components/Header'
import MailPreview from '../components/MailPreview'
import GroupPreview from '../components/GroupPreview'
import MailPanel from '../components/MailPanel'
import GroupPanel from '../components/GroupPanel'
import WriteMail from '../components/WriteMail'
import '../styles/mail.sass'

const Mail = () => {
  const [personalMails, setPersonalMails] = useState(true)
  const [mails, setMails] = useState([])
  const [groups, setGroups] = useState([])
  const [focusedMail, setFocusedMail] = useState(0)
  const [currentMail, setCurrentMail] = useState({ id: 0, message: '', receptor: '', emisor: '' })
  const [focusedGroup, setFocusedGroup] = useState(0)
  const [currentGroup, setCurrentGroup] = useState({ id: 0, groupName: '', users: [], key: '' })
  const [groupMessages, setGroupMessages] = useState([])

  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    switchMails()
  }, [personalMails])

  const capitalizeAndReplace = (string) => {
    let words = string.split('-')
    let capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    let result = capitalizedWords.join(' ')
    return result
  }

  const switchMails = () => {
    if (personalMails) {
      axios.get(`${import.meta.env.VITE_APP_API_URL}/messages/${user.username}`)
      .then((response) => {
        const unparsedMails = response.data
        const parsedMails = []
        unparsedMails.forEach((unparsedMail) => {
          const parsedMail = {
            id: unparsedMail.id,
            message: unparsedMail.message,
            receptor: unparsedMail.username_destino,
            emisor: unparsedMail.username_origen,
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
          if (group.usuarios.includes(user.username)) {
            const parsedGroup = {
              id: group.id,
              groupName: capitalizeAndReplace(group.nombre),
              users: group.usuarios,
              key: group.clave_simetrica,
            }
            groupsToShow.push(parsedGroup)
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
    setFocusedGroup(0)
    const foundMail = mails.find((mail) => (mail.id === mailId))
    setCurrentMail(foundMail)
  }

  const updateFocusedGroup = (group) => {
    const groupId = group.id
    setFocusedGroup(groupId + 1)
    setFocusedMail(0)
    const foundGroup = groups.find((group) => (group.id === groupId))
    setCurrentGroup(foundGroup)
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
                  emisor={mail.emisor}
                  content={mail.message}
                  onClick={() => updateFocusedMail(mail)}
                />
              ))}
            </div>
          ) : (
            <div>
              {groups.map((group, index) => (
                <GroupPreview
                  key={index}
                  onClick={() => updateFocusedGroup(group)}
                  groupName={group.groupName}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mail-content">
          {(focusedMail || focusedGroup) ? (
            <div style={{ width: '100%', height: '100%' }}>
              {(focusedGroup) ? (
                <GroupPanel
                  groupId={currentGroup.id}
                  groupName={currentGroup.groupName}
                  closeMail={setFocusedGroup}
                />
              ) : (
                <MailPanel
                  emisor={currentMail.emisor}
                  receptor={currentMail.receptor}
                  content={currentMail.message}
                  closeMail={setFocusedMail}
                />
              )}
            </div>
          ) : (
            <WriteMail />
          )}
        </div>
      </div>
    </main>
  )
}

export default Mail

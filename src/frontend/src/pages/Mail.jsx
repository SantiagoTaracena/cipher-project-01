import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Header from '../components/Header'
import UsersPreview from '../components/UsersPreview'
import GroupPreview from '../components/GroupPreview'
import MailPanel from '../components/MailPanel'
import GroupPanel from '../components/GroupPanel'
import WriteMail from '../components/WriteMail'
import '../styles/mail.sass'

const Mail = () => {
  const [personalMails, setPersonalMails] = useState(true)
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [focusedUser, setFocusedUser] = useState(0)
  const [currentUser, setCurrentUser] = useState({ id: 0, username: '' })
  const [userMessages, setUserMessages] = useState([])
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
    const token = localStorage.getItem('token')
  
    if (personalMails) {
      axios.get(`${import.meta.env.VITE_APP_API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        const unparsedUsers = response.data
        const parsedUsers = unparsedUsers.filter(unparsedUser => unparsedUser.username !== user.username)
          .map(unparsedUser => ({
            id: unparsedUser.id,
            username: unparsedUser.username
          }))
        
        setUsers(parsedUsers)
      })
      .catch((error) => console.error('Error al realizar la solicitud', error))
    } else {
      axios.get(`${import.meta.env.VITE_APP_API_URL}/groups`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        const groups = response.data
        const groupsToShow = groups
          .filter(group => group.usuarios.includes(user.username))
          .map(group => ({
            id: group.id,
            groupName: capitalizeAndReplace(group.nombre),
            users: group.usuarios,
            key: group.clave_simetrica,
          }))
        
        setGroups(groupsToShow)
      })
      .catch((error) => console.error('Error al realizar la solicitud', error))
    }
  }
  

  const updateFocusedUser = (user) => {
    const userId = user.id
    setFocusedUser(userId + 1)
    setFocusedGroup(0)
    const foundUser = users.find((user) => (user.id === userId))
    setCurrentUser(foundUser)
  }

  const updateFocusedGroup = (group) => {
    const groupId = group.id
    setFocusedGroup(groupId + 1)
    setFocusedUser(0)
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
            <h3 onClick={() => setPersonalMails(true)}>Usuarios</h3>
            <h3 onClick={() => setPersonalMails(false)}>Grupos</h3>
          </div>
          {(personalMails) ? (
            <div>
              {users.map((user, index) => (
                <UsersPreview
                  key={index}
                  username={user.username}
                  onClick={() => updateFocusedUser(user)}
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
          {(focusedUser || focusedGroup) ? (
            <div style={{ width: '100%', height: '100%' }}>
              {(focusedGroup) ? (
                <GroupPanel
                  groupId={currentGroup.id}
                  groupName={currentGroup.groupName}
                  closeMail={setFocusedGroup}
                />
              ) : (
                <MailPanel
                  emisor={currentUser.username}
                  messages={userMessages}
                  closeMail={setFocusedUser}
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

import React, { createContext, useState, useMemo } from 'react'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ id: 0, username: '', privateKey: '' })

  const state = useMemo(() => ({ user, setUser }), [user])

  return (
    <UserContext.Provider value={state}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext }
export default UserProvider

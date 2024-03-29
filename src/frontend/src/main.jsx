import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import UserProvider from './providers/UserProvider'

const root = document.getElementById('root')
const reactRoot = ReactDOM.createRoot(root)

reactRoot.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
)

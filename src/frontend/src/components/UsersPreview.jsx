import React from 'react'
import '../styles/users-preview.sass'

const UsersPreview = ({ username, onClick }) => (
  <div
    className="users-container"
    onClick={onClick}
  >
    <div className="online-icon" />
    <h3>{username}</h3>
  </div>
)

export default UsersPreview

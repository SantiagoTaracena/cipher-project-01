import React from 'react'
import '../styles/group-preview.sass'

const GroupPreview = ({ onClick, groupName }) => (
  <div
    className="group-container"
    onClick={onClick}
  >
    <h3>Grupo: {groupName}</h3>
  </div>
)

export default GroupPreview

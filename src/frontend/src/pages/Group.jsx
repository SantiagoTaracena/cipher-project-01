import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Button from '../components/Button'
import '../styles/group.sass'

const Group = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    members: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const navigate = useNavigate()

  const { user, setUser } = useContext(UserContext)

  const handleSubmit = (event) => {
    event.preventDefault()
    const groupMembers = [user.username, ...formData.members.split(', ')]
    const data = { groupName: formData.groupName, groupMembers, password: formData.password }
    axios.post(`${import.meta.env.VITE_APP_API_URL}/groups`, data)
    .then((response) => alert('Grupo enviado'))
    .catch((error) => console.error('Error al realizar la solicitud', error))
    navigate('/mail')
  }

  return (
    <main className="container">
      <div className="information-card">
        <h1>Crear Grupo</h1>
        <h3>Crea un grupo ingresando el nombre que lo identifica, los usuarios separados por coma y espacio (, ), y la contraseña</h3>
        <form
          className="sign-up-form"
          onSubmit={handleSubmit}
        >
          <div className="sign-up-input-entry">
            <label htmlFor="group-name">Nombre del grupo:</label>
            <input
              type="text"
              id="group-name"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sign-up-input-entry">
            <label htmlFor="members">Miembros del grupo:</label>
            <input
              type="text"
              id="members"
              name="members"
              value={formData.members}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sign-up-input-entry">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sign-up-buttons">
            <Button buttonText="Crear grupo" type="submit" onClick={handleSubmit} />
            <Link to="/mail"><Button buttonText="Volver" type="button" /></Link>
            <Link to="/delete-group"><Button buttonText="Borrar grupo" type="button" /></Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Group

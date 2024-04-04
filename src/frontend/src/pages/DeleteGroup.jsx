import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button'
import '../styles/delete-group.sass'

const DeleteGroup = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    axios.delete(`${import.meta.env.VITE_APP_API_URL}/groups/${formData.groupName}`, { data: formData, headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
      alert('Grupo eliminado')
      navigate('/mail')
    })
    .catch((error) => console.error('Error al realizar la solicitud', error))
  }

  return (
    <div className="delete-group-container">
      <div className="delete-group-card">
        <h1>Eliminar Grupo</h1>
        <h3>Elimina un grupo ingresando su nombre y su contraseña</h3>
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
            <Button buttonText="Eliminar grupo" type="submit" onClick={handleSubmit} />
            <Link to="/mail"><Button buttonText="Volver" type="button" /></Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteGroup

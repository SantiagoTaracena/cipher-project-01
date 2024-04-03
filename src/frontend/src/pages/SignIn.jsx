import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Button from '../components/Button'
import '../styles/sign-up.sass'

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
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
    axios.post(`${import.meta.env.VITE_APP_API_URL}/users/${formData.username}`, formData)
    .then((response) => {
      const auth = response.data.auth
      const id = response.data.id
      const username = response.data.username
      if (auth) {
        setUser({ id, username })
        navigate('/mail')
      } else {
        alert('No se encontró al usuario')
      }
    })
    .catch((error) => console.error('Error al realizar la solicitud', error))
  }

  return (
    <main className="sign-up-container">
      <div className="sign-up-card">
        <h1>Inicio de Sesión</h1>
        <form
          className="sign-up-form"
          onSubmit={handleSubmit}
        >
          <div className="sign-up-input-entry">
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
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
            <Button buttonText="Iniciar Sesión" type="submit" onClick={handleSubmit} />
            <Link to="/"><Button buttonText="Volver" type="button" /></Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignIn

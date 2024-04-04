import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button'
import '../styles/sign-up.sass'

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post(`${import.meta.env.VITE_APP_API_URL}/users`, formData)
    .then((response) => alert(`Usuario creado con llave privada ${response.data.status}`))
    .catch((error) => console.error('Error al realizar la solicitud', error))
    navigate('/')
  }

  return (
    <main className="sign-up-container">
      <div className="sign-up-card">
        <h1>Registro</h1>
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
          <div className="sign-up-buttons">
            <Button buttonText="Registrarse" type="submit" onClick={handleSubmit} />
            <Link to="/"><Button buttonText="Volver" type="button" /></Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignUp

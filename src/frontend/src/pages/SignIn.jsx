import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import '../styles/sign-up.sass'

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(formData)
  }

  return (
    <main className="sign-up-container">
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
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
        <Link to="/mail"><Button buttonText="Iniciar Sesión" type="submit" /></Link>
      </form>
    </main>
  )
}

export default SignIn

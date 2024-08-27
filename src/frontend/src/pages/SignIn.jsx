import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../providers/UserProvider'
import Button from '../components/Button'
import '../styles/sign-up.sass'

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    privateKey: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const navigate = useNavigate()

  const { setUser } = useContext(UserContext)

  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post(`${import.meta.env.VITE_APP_API_URL}/users/${formData.username}`, formData)
      .then((response) => {
        const { auth, id, username, token } = response.data
        if (auth) {
          localStorage.setItem('token', token)
          axios.put(`${import.meta.env.VITE_APP_API_URL}/users/${formData.username}/key`, { privateKey: formData.privateKey }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
            .then(() => {
              alert('La llave pública ha sido actualizada')
            })
            .catch((error) => console.error('Error al realizar la solicitud', error))

          setUser({ id, username, privateKey: formData.privateKey })
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
        <form className="sign-up-form" onSubmit={handleSubmit}>
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
            <label htmlFor="privateKey">Llave privada:</label>
            <input
              type="password"
              id="privateKey"
              name="privateKey"
              value={formData.privateKey}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sign-up-buttons">
            <Button buttonText="Iniciar Sesión" type="submit" />
            <Link to="/"><Button buttonText="Volver" type="button" /></Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignIn

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from '../components/Button'
import '../styles/sign-up.sass'

const SignUp = () => {
  const [privateKey, setPrivateKey] = useState('')
  const [showPrivateKey, setShowPrivateKey] = useState(false)
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
    .then((response) => {
      setPrivateKey(response.data.private_key)
      setShowPrivateKey(true)
    })
    .catch((error) => console.error('Error al realizar la solicitud', error))
  }

  return (showPrivateKey) ? (
    <div className="private-key-container">
      <div className="private-key-card">
        <h3>Esta es tu llave privada:</h3>
        <div className="private-key-div">{privateKey}</div>
        <Button
          buttonText="Aceptar"
          type="button"
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  ) : (
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

import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import '../styles/landing.sass'

const Landing = () => (
  <main className="container">
    <div className="information-card">
      <h1>Cipher Mail</h1>
      <h3>Haz uso de nuestro servicio de correos electrónicos completamente seguro</h3>
      <div className="container-links">
        <Link to="/sign-up"><Button buttonText="Regístrate" type="button" /></Link>
        <p>ó</p>
        <Link to="/sign-in"><Button buttonText="Inicia sesión" type="button" /></Link>
      </div>
    </div>
  </main>
)

export default Landing

import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import '../styles/landing.sass'

const Landing = () => (
  <div className="container">
    <h1>Proyecto de Cifrado</h1>
    <h3>Haz uso de nuestro servicio de correos electrónicos completamente seguro</h3>
    <div className="container-links">
      <Link to="/sign-up"><Button buttonText="Regístrate" /></Link>
      <p>ó</p>
      <Link to="/sign-in"><Button buttonText="Inicia sesión" /></Link>
    </div>
  </div>
)

export default Landing

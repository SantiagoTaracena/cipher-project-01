import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/header.sass'

const Header = () => (
  <div className="header-container">
    <div className="hidden">
      <h3>Cerrar Sesión</h3>
      <h3>Crear Grupo</h3>
    </div>

    <h1>Cipher Mail</h1>
    <div>
      <Link to="/"><h3>Cerrar Sesión</h3></Link>
      <Link to="/group"><h3>Crear Grupo</h3></Link>
    </div>
  </div>
)

export default Header

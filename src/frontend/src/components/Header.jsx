import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/header.sass'

const Header = () => (
  <div className="header-container">
    <h3 className="hidden">Cerrar Sesión</h3>
    <h1>Cipher Mail</h1>
    <Link to="/"><h3>Cerrar Sesión</h3></Link>
  </div>
)

export default Header

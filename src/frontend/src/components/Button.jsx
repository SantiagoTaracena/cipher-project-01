import React from 'react'
import '../styles/button.sass'

const Button = ({ buttonText, type, onClick }) => (
  <button
    type={type}
    onClick={onClick}
  >
    {buttonText}
  </button>
)

export default Button

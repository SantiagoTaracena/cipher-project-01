import React from 'react'

const Button = ({ buttonText, type, onClick }) => (
  <button
    style={{ padding: '10px' }}
    type={type}
    onClick={onClick}
  >
    {buttonText}
  </button>
)

export default Button

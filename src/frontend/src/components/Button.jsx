import React from 'react'

const Button = ({ buttonText, type }) => (
  <button style={{ padding: '10px' }} type={type}>{buttonText}</button>
)

export default Button

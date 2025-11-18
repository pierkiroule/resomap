import React, { useState } from 'react'
import './MobileMenu.css'

function MobileMenu({ children, title = "Paramètres" }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'} {title}
      </button>
      
      <div className="mobile-menu-content">
        {children}
      </div>
    </div>
  )
}

export default MobileMenu

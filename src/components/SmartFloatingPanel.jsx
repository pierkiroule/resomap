import React, { useState, useRef, useEffect } from 'react'
import './SmartFloatingPanel.css'

function SmartFloatingPanel({ 
  title, 
  children, 
  onClose,
  defaultPosition = 'top-right',
  defaultWidth = 320,
  defaultHeight = 'auto',
  minWidth = 280,
  maxWidth = 600,
  minHeight = 200
}) {
  const [position, setPosition] = useState(getDefaultPosition(defaultPosition))
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDocked, setIsDocked] = useState(false)
  const [showPositionPresets, setShowPositionPresets] = useState(false)
  
  const panelRef = useRef(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 })

  function getDefaultPosition(preset) {
    const margin = 20
    const w = window.innerWidth
    const h = window.innerHeight
    
    const presets = {
      'top-left': { x: margin, y: margin },
      'top-right': { x: w - defaultWidth - margin, y: margin },
      'bottom-left': { x: margin, y: h - 400 - margin },
      'bottom-right': { x: w - defaultWidth - margin, y: h - 400 - margin },
      'top': { x: (w - defaultWidth) / 2, y: margin },
      'bottom': { x: (w - defaultWidth) / 2, y: h - 400 - margin },
      'left': { x: margin, y: (h - 400) / 2 },
      'right': { x: w - defaultWidth - margin, y: (h - 400) / 2 },
      'center': { x: (w - defaultWidth) / 2, y: (h - 400) / 2 }
    }
    
    return presets[preset] || presets['top-right']
  }

  // Snap to edges
  const snapToEdge = (pos, size) => {
    const snapDistance = 30
    const w = window.innerWidth
    const h = window.innerHeight
    
    let newX = pos.x
    let newY = pos.y
    
    // Snap to left
    if (pos.x < snapDistance) newX = 0
    // Snap to right
    if (pos.x + size.width > w - snapDistance) newX = w - size.width
    // Snap to top
    if (pos.y < snapDistance) newY = 0
    // Snap to bottom
    if (pos.y + (typeof size.height === 'number' ? size.height : 400) > h - snapDistance) {
      newY = h - (typeof size.height === 'number' ? size.height : 400)
    }
    
    return { x: newX, y: newY }
  }

  // Drag handlers
  const handleDragStart = (e) => {
    if (isDocked) return
    
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    setIsDragging(true)
    dragStartRef.current = {
      x: clientX - position.x,
      y: clientY - position.y
    }
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    const newPos = {
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y
    }
    
    // Constrain to viewport
    newPos.x = Math.max(0, Math.min(newPos.x, window.innerWidth - size.width))
    newPos.y = Math.max(0, Math.min(newPos.y, window.innerHeight - 100))
    
    setPosition(newPos)
  }

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false)
      // Apply snap
      const snapped = snapToEdge(position, size)
      setPosition(snapped)
    }
  }

  // Resize handlers
  const handleResizeStart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    setIsResizing(true)
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: size.width,
      height: typeof size.height === 'number' ? size.height : 400
    }
  }

  const handleResizeMove = (e) => {
    if (!isResizing) return
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    const deltaX = clientX - resizeStartRef.current.x
    const deltaY = clientY - resizeStartRef.current.y
    
    const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.width + deltaX))
    const newHeight = Math.max(minHeight, resizeStartRef.current.height + deltaY)
    
    setSize({ width: newWidth, height: newHeight })
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  // Double-click to dock/undock
  const handleDoubleClick = () => {
    setIsDocked(!isDocked)
    if (!isDocked) {
      // Dock to right side
      setPosition({ x: window.innerWidth - size.width, y: 0 })
    }
  }

  // Position presets
  const applyPreset = (preset) => {
    const newPos = getDefaultPosition(preset)
    setPosition(newPos)
    setShowPositionPresets(false)
  }

  // Global mouse/touch event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove)
      window.addEventListener('touchend', handleDragEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
        window.removeEventListener('touchmove', handleDragMove)
        window.removeEventListener('touchend', handleDragEnd)
      }
    }
  }, [isDragging, position, size])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove)
      window.addEventListener('mouseup', handleResizeEnd)
      window.addEventListener('touchmove', handleResizeMove)
      window.addEventListener('touchend', handleResizeEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleResizeMove)
        window.removeEventListener('mouseup', handleResizeEnd)
        window.removeEventListener('touchmove', handleResizeMove)
        window.removeEventListener('touchend', handleResizeEnd)
      }
    }
  }, [isResizing])

  if (isMinimized) {
    return (
      <div 
        className="smart-panel-tab"
        style={{ 
          right: position.x < window.innerWidth / 2 ? 'auto' : '0',
          left: position.x < window.innerWidth / 2 ? '0' : 'auto',
          top: position.y 
        }}
        onClick={() => setIsMinimized(false)}
      >
        <span className="tab-icon">📋</span>
        <span className="tab-title">{title}</span>
      </div>
    )
  }

  return (
    <>
      <div
        ref={panelRef}
        className={`smart-floating-panel ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''} ${isDocked ? 'docked' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height
        }}
      >
        {/* Header */}
        <div 
          className="smart-panel-header"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onDoubleClick={handleDoubleClick}
        >
          <div className="panel-title-row">
            <span className="panel-title">{title}</span>
            {isDocked && <span className="docked-badge">📌</span>}
          </div>
          
          <div className="panel-controls">
            {/* Position presets */}
            <div className="preset-dropdown">
              <button 
                className="panel-btn"
                onClick={() => setShowPositionPresets(!showPositionPresets)}
                title="Position Presets"
              >
                📍
              </button>
              {showPositionPresets && (
                <div className="preset-menu">
                  <div className="preset-grid">
                    <button onClick={() => applyPreset('top-left')} title="Top Left">↖</button>
                    <button onClick={() => applyPreset('top')} title="Top">↑</button>
                    <button onClick={() => applyPreset('top-right')} title="Top Right">↗</button>
                    <button onClick={() => applyPreset('left')} title="Left">←</button>
                    <button onClick={() => applyPreset('center')} title="Center">⊙</button>
                    <button onClick={() => applyPreset('right')} title="Right">→</button>
                    <button onClick={() => applyPreset('bottom-left')} title="Bottom Left">↙</button>
                    <button onClick={() => applyPreset('bottom')} title="Bottom">↓</button>
                    <button onClick={() => applyPreset('bottom-right')} title="Bottom Right">↘</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Minimize */}
            <button 
              className="panel-btn"
              onClick={() => setIsMinimized(true)}
              title="Minimize (to tab)"
            >
              ─
            </button>
            
            {/* Close */}
            <button 
              className="panel-btn close-btn"
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="smart-panel-content">
          {children}
        </div>

        {/* Resize handle */}
        <div 
          className="resize-handle"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          title="Resize"
        >
          ⋰
        </div>
      </div>

      {/* Snap guides (visual feedback) */}
      {isDragging && (
        <div className="snap-guides">
          <div className="snap-guide snap-left" />
          <div className="snap-guide snap-right" />
          <div className="snap-guide snap-top" />
          <div className="snap-guide snap-bottom" />
        </div>
      )}
    </>
  )
}

export default SmartFloatingPanel

import React from 'react'

const handleToggle = () => {
  console.log('object')
  document.body.classList.toggle('dark-mode-on')
}

function handleLoacalStorage(params) {
  return true
}

const DarkMode = () => {
  return (
    <div className="dark-mode-div">
      <button onClick={handleToggle} className="dark-toggle-btn">
        <i className="dark-mode-icon fa-solid fa-moon"></i>
      </button>
    </div>
  )
}

export default DarkMode

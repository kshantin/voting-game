import React from 'react'

import './component.css'

const AppComponent = (props) => {
  return (
    <div className="app-component-container">
      <button type="button" className="button app-component-button">
        <span>
          <span>Выход</span>
          <br></br>
        </span>
      </button>
    </div>
  )
}

export default AppComponent

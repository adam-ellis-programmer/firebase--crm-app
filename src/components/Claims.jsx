import { useEffect } from 'react'
import { useAuthStatusTwo } from '../hooks/useAuthStatusTwo'

const Claims = () => {
  const { loggedIn, loggedInUser, claims } = useAuthStatusTwo()
  // make a redirect here if not logged in
  // Add a console.log to debug the claims object
  console.log('Claims:', claims)

  if (!loggedIn || !claims) {
    return (
      <div className="loading">
        <p>Loading claims...</p>
      </div>
    )
  }

  // Convert claims to an array of key-value pairs that we can map over
  const claimsArray = Object.entries(claims?.claims || {})

  return (
    <div className="claims-container">
      {/* Claims Section */}
      <div className="claims-section">
        <h2>User Claims</h2>
        <div className="claims-grid">
          {claimsArray.map(([key, value]) => (
            <div key={key} className="claim-item">
              <span className="claim-label">{key}</span>
              <div className="claim-value">
                {typeof value === 'boolean' ? (
                  value ? (
                    <i className="fas fa-check check"></i>
                  ) : (
                    <i className="fas fa-times cross"></i>
                  )
                ) : (
                  <span className="text-value">
                    {value === '' ? 'None' : String(value)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Claims

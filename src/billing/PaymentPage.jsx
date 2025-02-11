import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { pricingTiers } from './data'
import { Link } from 'react-router-dom'

const PaymentPage = () => {
  const { id } = useParams()

  // Find the specific tier that matches the id parameter
  const selectedTier = pricingTiers.find((tier) => tier.id === id)

  // If no matching tier is found, you might want to handle that case
  if (!selectedTier) {
    return <div>No pricing tier found</div>
  }

  return (
    <div className="page-container payment-page-container">
      <div>
        <div
          className={`pricing-card pay-page-card ${
            selectedTier.recommended ? 'recommended' : ''
          }`}
        >
          {selectedTier.recommended && (
            <span className="recommended-badge">Recommended</span>
          )}
          <i className={`pricing-icon ${selectedTier.iconClass}`}></i>
          <h3 className="pricing-name">{selectedTier.name}</h3>
          <p className="pricing-description">{selectedTier.description}</p>
          <div className="pricing-price">
            ${selectedTier.price}
            <span className="pricing-period">/{selectedTier.billingPeriod}</span>
          </div>

          <ul className="features-list">
            {selectedTier.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          {selectedTier.limitations.length > 0 && (
            <ul className="limitations-list">
              {selectedTier.limitations.map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

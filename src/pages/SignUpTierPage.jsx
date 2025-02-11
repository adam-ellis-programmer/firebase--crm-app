import { Link } from 'react-router-dom'
import { pricingTiers } from '../billing/data'
console.log(pricingTiers)
const SignUpTierPage = () => {
  return (
    <div className="page-container tier-grid">
      {pricingTiers.map((tier, i) => (
        <div
          key={tier.id}
          className={`pricing-card ${tier.recommended ? 'recommended' : ''}`}
        >
          {tier.recommended && <span className="recommended-badge">Recommended</span>}
          <i className={`pricing-icon ${tier.iconClass}`}></i>
          <h3 className="pricing-name">{tier.name}</h3>
          <p className="pricing-description">{tier.description}</p>
          <div className="pricing-price">
            ${tier.price}
            <span className="pricing-period">/{tier.billingPeriod}</span>
          </div>

          <ul className="features-list">
            {tier.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          {tier.limitations.length > 0 && (
            <ul className="limitations-list">
              {tier.limitations.map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
            </ul>
          )}

          <Link to={`/payment-page/${tier.id}`} className={`pricing-button ${tier.id}`}>
            {tier.buttonText}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default SignUpTierPage

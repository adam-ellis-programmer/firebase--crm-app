// Pricing tiers data structure
export const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for small teams just getting started',
    price: 0,
    billingPeriod: 'forever',
    iconClass: 'fa-light fa-rocket-launch',
    features: [
      'Up to 5 team members',
      '100 contacts',
      'Basic CRM features',
      'Email support',
      'Basic reporting',
      '1GB storage',
      'Standard widgets',
    ],
    limitations: ['No API access', 'Community support only', 'Basic analytics'],
    buttonText: 'Start Free',
    recommended: false,
    link: '/payment-page'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Ideal for growing businesses',
    price: 49.99,
    billingPeriod: 'monthly',
    iconClass: 'fa-light fa-stars',
    features: [
      'Up to 25 team members',
      'Unlimited contacts',
      'Advanced CRM features',
      'Priority email & chat support',
      'Advanced reporting',
      '25GB storage',
      'Premium widgets',
      'API access',
      'Custom fields',
      'Workflow automation',
    ],
    limitations: [],
    buttonText: 'Start Premium Trial',
    recommended: true,
    link: '/payment-page'
  },
  {
    id: 'corporation',
    name: 'Enterprise',
    description: 'For large organizations needing full control',
    price: 199.99,
    billingPeriod: 'monthly',
    iconClass: 'fa-light fa-building',
    features: [
      'Unlimited team members',
      'Unlimited contacts',
      'Enterprise CRM features',
      '24/7 dedicated support',
      'Custom reporting',
      'Unlimited storage',
      'Enterprise widgets',
      'Full API access',
      'Custom development',
      'Advanced automation',
      'SLA guarantee',
      'Dedicated account manager',
      'Custom integrations',
      'On-premises option',
    ],
    limitations: [],
    buttonText: 'Contact Sales',
    recommended: false,
    link: '/payment-page'
  },
]

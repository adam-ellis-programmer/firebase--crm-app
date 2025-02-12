import React, { useEffect, useState, useContext } from 'react'
import FormRow from '../components/FormRow'
import CrmContext from '../crm context/CrmContext'
import { generateTenDigitNumber } from '../CrmFunctions'
import { calculateFutureDates } from './calculateDates'
console.log(calculateFutureDates().oneYear.milliseconds)
const CompanyPaymentForm = () => {
  const { dispatch, subscriptionInfo } = useContext(CrmContext)
  console.log(subscriptionInfo)
  // Initialize all form fields in state

  const generateOrgId = (orgName) => {
    return orgName.slice(0, 3).toUpperCase() + '--' + generateTenDigitNumber()
  }
  const orgId = generateOrgId(subscriptionInfo.organization)

  const handleChange = (e) => {
    const { name, value } = e.target
    // Instead of using local state, dispatch to context
    dispatch({
      type: 'SET_SUBSCRIPTION_INFO',
      payload: {
        ...subscriptionInfo, // Spread existing subscription info
        [name]: value, // Update the changed field
        organizationId: orgId,
        expDate: calculateFutureDates().oneYear.milliseconds,
        signUpDate: calculateFutureDates().current.milliseconds,
      },
    })
  }

  return (
    <div className="bg-slate-100 max-w-md mx-auto p-6 mb-8">
      <form id="company-payment-form" className="space-y-4">
        <FormRow
          type="text"
          name="firstName"
          labelText="First Name"
          defaultValue={subscriptionInfo.firstName}
          onChange={handleChange}
        />
        <FormRow
          type="text"
          name="lastName"
          labelText="Last Name"
          defaultValue={subscriptionInfo.lastName}
          onChange={handleChange}
        />
        <FormRow
          type="email"
          name="email"
          labelText="Company Email"
          defaultValue={subscriptionInfo.email}
          onChange={handleChange}
        />
        <FormRow
          type="tel"
          name="phone"
          labelText="Phone Number"
          defaultValue={subscriptionInfo.phone}
          onChange={handleChange}
        />
        <FormRow
          type="text"
          name="organization"
          labelText="Organization"
          defaultValue={subscriptionInfo.organization}
          onChange={handleChange}
        />
        <FormRow
          type="text"
          name="password"
          labelText="Password"
          defaultValue={subscriptionInfo.password}
          onChange={handleChange}
        />

        {/* <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button> */}
      </form>
    </div>
  )
}

export default CompanyPaymentForm

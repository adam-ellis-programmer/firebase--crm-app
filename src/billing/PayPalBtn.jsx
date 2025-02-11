import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

import React from 'react'
const styles = {
  shape: 'rect',
  layout: 'vertical',
  color: 'white',
  disableMaxWidth: true,
  label: 'checkout',
}

const PayPalBtn = () => {
  const initialOptions = {
    clientId: 'YOUR_CLIENT_ID',
  }

  const createOrder = async () => {
    try {
      const response = await fetch('/my-server/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: [{ id: 'YOUR_PRODUCT_ID', quantity: 'YOUR_PRODUCT_QUANTITY' }],
        }),
      })

      const orderData = await response.json()

      if (!orderData.id) {
        const errorDetail = orderData.details[0]
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : 'Unexpected error occurred, please try again.'

        throw new Error(errorMessage)
      }

      return orderData.id
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <div>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons createOrder={createOrder} />
      </PayPalScriptProvider>
    </div>
  )
}

export default PayPalBtn

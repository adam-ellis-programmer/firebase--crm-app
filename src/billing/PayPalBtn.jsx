import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useCallback, useState, useContext } from 'react'
import CrmContext from '../crm context/CrmContext'

const PayPalBtn = ({ price, productId }) => {
  const { dispatch, subscriptionInfo } = useContext(CrmContext)
  // Add state to track payment status
  const [paymentStatus, setPaymentStatus] = useState('')

  const initialOptions = {
    clientId: process.env.REACT_APP_PAY_PAL_ID,
    currency: 'GBP',
    intent: 'capture',
  }

  // Handle successful payments
  // toast.success('Payment completed!') // If using toast notifications
  // Here you could:
  // - Update your database
  // - Redirect to a success page
  // - Show a success message
  const handleSuccess = useCallback(
    (data) => {
      console.log('Payment successful:', data)
      setPaymentStatus('Payment completed successfully!')
      console.log('subscription data=>', subscriptionInfo)
      subscriptionInfo.claims = {}
      subscriptionInfo.claims.admin = true
      subscriptionInfo.claims.manager = true
      subscriptionInfo.claims.ceo = true
      subscriptionInfo.claims.sales = true
      subscriptionInfo.claims.reportsTo = true
      subscriptionInfo.claims.reportsTo = ''
      // subscriptionInfo.organization = data.organization
      // subscriptionInfo.organizationId = data.organizationId

      const functions = getFunctions()
      const newSubscriber = httpsCallable(functions, 'newSubscriber')

      newSubscriber({ ...subscriptionInfo }).then((result) => {
        const data = result.data
        delete data.password
        console.log(data)
      })
    },
    [subscriptionInfo]
  )
  // Add subscriptionInfo to the dependencies

  // Handle payment errors
  const handleError = useCallback((error) => {
    console.error('Payment error:', error)
    setPaymentStatus('Payment failed: ' + error.message)
    // toast.error('Payment failed!') // If using toast notifications
    // Here you could:
    // - Show an error message
    // - Log the error
    // - Offer retry options
  }, [])

  const createOrder = useCallback(async () => {
    try {
      const functions = getFunctions()
      const createOrder = httpsCallable(functions, 'createPayPalOrder')

      const result = await createOrder({
        amount: price, // Test amount of $10
        productId, // Test product ID
      })

      if (!result.data.id) {
        throw new Error('Failed to create PayPal order')
      }

      setPaymentStatus('Order created, awaiting payment...')
      return result.data.id
    } catch (error) {
      handleError(error)
      throw error
    }
  }, [])

  const onApprove = useCallback(
    async (data, actions) => {
      try {
        const functions = getFunctions()
        const capturePayment = httpsCallable(functions, 'capturePayPalPayment')

        const result = await capturePayment({
          orderId: data.orderID,
        })

        if (result.data.status === 'COMPLETED') {
          handleSuccess(result.data)
        } else {
          throw new Error('Payment not completed')
        }
      } catch (error) {
        handleError(error)
      }
    },
    [handleSuccess]
  )

  return (
    <div className="w-full max-w-md mx-auto">
      <PayPalScriptProvider options={initialOptions}>
        {/* Show payment status if any */}
        {paymentStatus && (
          <div className="mb-4 text-center">
            <p
              className={`text-sm ${
                paymentStatus.includes('failed') ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {paymentStatus}
            </p>
          </div>
        )}

        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay',
          }}
        />
      </PayPalScriptProvider>
    </div>
  )
}

export default PayPalBtn

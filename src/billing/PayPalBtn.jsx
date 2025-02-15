import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useCallback, useState, useContext } from 'react'
import CrmContext from '../crm context/CrmContext'

const PayPalBtn = ({ price, productId }) => {
  const { dispatch, subscriptionInfo } = useContext(CrmContext)
  // Add state to track payment status
  console.log(subscriptionInfo)
  const [newSubId, setNewSubId] = useState('')
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
    // async no nesting to get updated value
    // variable inside server fucntion
    async (data) => {
      try {
        console.log('Payment successful:', data)
        setPaymentStatus('Payment completed successfully!')
        console.log('subscription data=>', subscriptionInfo)

        //  we need the id and full name
        // Set up claims
        // delete dbSubscriptionInfo.claims called later
        subscriptionInfo.claims = {
          orgOwner: true,
          admin: true,
          superAdmin: true,
          manager: true,
          ceo: true,
          sales: true,
          reportsTo: {
            id: 'hello', // from data we get back from the server
            name: 'adam', // from data we get back from the server
          },
          organization: subscriptionInfo.organization,
          organizationId: subscriptionInfo.organizationId,
        }
        // MOVE HANDLE DB SIGHN UP INTO SERVER FUCNTIONS
        const functions = getFunctions()
        const newSubscriber = httpsCallable(functions, 'newSubscriber')
        const handleDatabaseSignUp = httpsCallable(functions, 'handleDatabaseSignUp')

        // First create the user and get their ID
        const newUserResult = await newSubscriber({ ...subscriptionInfo })
        console.log(newUserResult)
        console.log('User Record:', newUserResult.data.userRecord)
        console.log('Claims Response:', newUserResult.data.claimsResponse)
        console.log('Original Data:', newUserResult.data.data)

        const userId = newUserResult.data.userRecord.uid

        // Now create the database entry with the user ID
        const dbSubscriptionInfo = {
          ...subscriptionInfo,
          id: userId,
        }
        console.log(userId)
        console.log(dbSubscriptionInfo.id)

        delete dbSubscriptionInfo.password
        // delete dbSubscriptionInfo.claims
 
        const dbResult = await handleDatabaseSignUp(dbSubscriptionInfo)
        console.log('User created:', dbResult.data)
      } catch (error) {
        console.error('Error in handleSuccess:', error)
        // Handle error appropriately
      }
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

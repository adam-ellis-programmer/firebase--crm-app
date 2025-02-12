const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { admin, db } = require('./firebase.config')

exports.addAdminRole = onCall((request) => {
  return admin
    .auth()
    .getUserByEmail(request.data.email)
    .then((user) => {
      console.log(user)
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: request.data.admin,
        manager: request.data.manager,
        ceo: request.data.ceo,
        sales: request.data.sales,
        reportsTo: request.data.reportsTo,
      })
    })
    .then(() => {
      return admin.auth().getUserByEmail(request.data.email)
    })
    .then((updatedUser) => {
      console.log('Updated user custom claims:', updatedUser.customClaims)
      return {
        message: `${request.data.email} has been assigned these roles.`,
        customClaims: updatedUser.customClaims,
        user: updatedUser,
        status: 'ok',
      }
    })
    .catch((err) => {
      console.log(err)
      throw new HttpsError('internal', err.message)
    })
})

exports.getUser = onCall((request) => {
  if (!request.data.email) {
    throw new HttpsError('invalid-argument', 'Email is required')
  }

  return admin
    .auth()
    .getUserByEmail(request.data.email)
    .then((data) => {
      return data
    })
    .catch((error) => {
      throw new HttpsError('not-found', 'User not found')
    })
})

exports.makeNewUser = onCall((request) => {
  if (!request.data.email || !request.data.password || !request.data.name) {
    throw new HttpsError('invalid-argument', 'Missing required fields')
  }

  return admin
    .auth()
    .createUser({
      email: request.data.email,
      password: request.data.password,
      displayName: request.data.name,
    })
    .then((userRecord) => {
      console.log('Successfully created new user:', userRecord.uid)
      return {
        data: userRecord,
        msg: `Successfully created new user ${userRecord.displayName}: whos id is ${userRecord.uid} `,
      }
    })
    .catch((error) => {
      throw new HttpsError('internal', 'Error creating new user: ' + error.message)
    })
})

exports.globalArray = []

exports.deleteAgent = onCall((request) => {
  if (!request.data.email) {
    throw new HttpsError('invalid-argument', 'Email is required')
  }

  return admin
    .auth()
    .getUserByEmail(request.data.email)
    .then((user) => {
      admin.auth().deleteUser(user.uid)
      return user
    })
    .then((user) => {
      console.log('Successfully deleted user')
      exports.globalArray.push({
        userData: user,
        status: 'ok',
        msg: `success ${user.uid} has been deleted`,
      })
      return {
        userData: user,
        msg: `success ${user.displayName} has been deleted`,
      }
    })
    .catch((error) => {
      throw new HttpsError('internal', 'Error deleting user: ' + error.message)
    })
})

exports.updateDBPermissions = onCall(async (request) => {
  if (!request.auth) {
    console.log('context===>', request)
    throw new HttpsError(
      'unauthenticated',
      'User must be authenticated to perform this operation.'
    )
  }

  const { oldId, newId } = request.data

  if (!oldId || !newId) {
    throw new HttpsError(
      'invalid-argument',
      'The function must be called with "oldId" and "newId" arguments.'
    )
  }

  const customersRef = db.collection('customers')
  const q = customersRef.where('reportsTo.id', '==', oldId)

  try {
    const querySnapshot = await q.get()
    if (querySnapshot.empty) {
      return { message: 'No matching documents found.' }
    }

    const batch = db.batch()

    querySnapshot.forEach((doc) => {
      const customerRef = doc.ref
      batch.update(customerRef, { 'reportsTo.id': newId })
    })

    await batch.commit()
    return { message: 'Batch update committed successfully.' }
  } catch (error) {
    console.error('Error updating documents:', error)
    throw new HttpsError('internal', 'Unable to complete batch update: ' + error.message)
  }
})

exports.listAllUsers = onCall((request) => {
  const users = []

  const listAllUsers = (nextPageToken) => {
    return admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          users.push(userRecord.toJSON())
        })
        if (listUsersResult.pageToken) {
          return listAllUsers(listUsersResult.pageToken)
        }
        return users
      })
      .catch((error) => {
        throw new HttpsError('internal', 'Failed to list users: ' + error.message)
      })
  }

  return listAllUsers()
    .then((fetchedUsers) => {
      console.log('Successfully fetched all users:', fetchedUsers.length)
      return { users: fetchedUsers }
    })
    .catch((error) => {
      console.error('Error in listAllUsers:', error)
      throw new HttpsError('internal', 'Failed to list users: ' + error.message)
    })
})

exports.testFunc = onCall((request) => {
  // Auth check
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in')
  }
  let authMsg = ''
  if (request.auth) {
    authMsg = 'user logged in'
  }
  if (!request.auth) {
    authMsg = 'user not logged in'
  }

  // You can access auth properties
  console.log('User ID:', request.auth.uid)
  console.log('User email:', request.auth.token.email)
  console.log('Custom claims:', request.auth.token)

  const text = request.data.text
  const req = request.data

  return {
    req,
    authMsg,
    text,
    message: 'this is a test message from the backend!.',
    msg: `Hello ${process.env.PLANET} and ${process.env.AUDIENCE}`,
  }
})
// ====================
// ====================
// ====================
// ====================
// ====================
// ====================
// ====================
// ====================

// generateAccessToken ensures secure authentication
// handlePayPalResponse ensures reliable error handling

// Base URL for PayPal API - switches between sandbox and production
const PAYPAL_BASE = process.env.FUNCTIONS_EMULATOR
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com'

/**
 * Generates an OAuth 2.0 access token for PayPal API authentication
 * @returns {Promise<string>} The PayPal access token
 */
async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error(
      'Missing PayPal API credentials. Please add them to your environment variables.'
    )
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString(
    'base64'
  )

  try {
    const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const data = await response.json()

    if (data.error) {
      console.error('PayPal token error:', data)
      throw new Error(data.error_description)
    }

    return data.access_token
  } catch (error) {
    console.error('Failed to generate PayPal access token:', error)
    throw error
  }
}

/**
 * Handles the response from PayPal API calls
 * @param {Response} response - The fetch response from PayPal
 * @returns {Promise<Object>} Parsed response data
 */
async function handlePayPalResponse(response) {
  const jsonResponse = await response.json()

  if (!response.ok) {
    console.error('PayPal API error:', jsonResponse)
    throw new Error(jsonResponse.message || 'PayPal API error')
  }

  return jsonResponse
}

/**
 * Creates a PayPal order for the transaction
 */
exports.createPayPalOrder = onCall(async (request) => {
  try {
    const { amount, currency = 'GBP', productId } = request.data

    if (!amount || !productId) {
      throw new Error('Amount and productId are required')
    }

    const accessToken = await generateAccessToken()

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: `Order for product ${productId}`,
          custom_id: productId,
        },
      ],
      application_context: {
        brand_name: process.env.BRAND_NAME || 'Your Store',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: process.env.SUCCESS_URL,
        cancel_url: process.env.CANCEL_URL,
      },
    }

    const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    })

    const orderData = await handlePayPalResponse(response)

    // Store order details in your database if needed
    // await admin.firestore().collection('orders').doc(orderData.id).set({
    //   userId: request.auth.uid,
    //   productId,
    //   amount,
    //   status: 'CREATED',
    //   createdAt: admin.firestore.FieldValue.serverTimestamp()
    // });

    return orderData
  } catch (error) {
    console.error('Error creating PayPal order:', error)
    throw new Error(`Failed to create PayPal order: ${error.message}`)
  }
})

/**
 * Captures payment for a created PayPal order
 */
exports.capturePayPalPayment = onCall(async (request) => {
  try {
    const { orderId } = request.data

    if (!orderId) {
      throw new Error('OrderId is required')
    }

    const accessToken = await generateAccessToken()

    const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const captureData = await handlePayPalResponse(response)

    captureData.test = 'hello'

    // Update order status in your database if needed
    // await admin.firestore().collection('orders').doc(orderId).update({
    //   status: 'COMPLETED',
    //   paymentDetails: captureData,
    //   updatedAt: admin.firestore.FieldValue.serverTimestamp()
    // });

    return captureData
  } catch (error) {
    console.error('Error capturing PayPal payment:', error)
    throw new Error(`Failed to capture PayPal payment: ${error.message}`)
  }
})

/**
 * Optional: Verifies PayPal webhook events
 */
exports.handlePayPalWebhook = onCall(async (request) => {
  if (!request.auth) {
    throw new Error('Unauthorized')
  }

  try {
    const { event_type, resource } = request.data

    // Handle different webhook events
    switch (event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Handle successful payment
        // await handleSuccessfulPayment(resource);
        break
      case 'PAYMENT.CAPTURE.DENIED':
        // Handle denied payment
        // await handleFailedPayment(resource);
        break
      // Add other webhook events as needed
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing PayPal webhook:', error)
    throw new Error(`Failed to process PayPal webhook: ${error.message}`)
  }
})

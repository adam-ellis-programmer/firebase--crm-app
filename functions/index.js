const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { admin, db, getFirestore } = require('./firebase.config')
// index.js (root functions folder)
// const authFunctions = require('./src/auth')
// // Export all auth functions
// exports.auth = authFunctions

// follow node inport / export
const { newAccSignUp } = require('./src/accountSignUp')
const { adminAddUser } = require('./src/addAgent')
const { deleteAgent } = require('./src/deleteAgent')
const { getClaims, updateAccess } = require('./src/changeAccess')
const { authTest, singleUpdate, simpleQuery } = require('./src/testFuncitons')
exports.authTest = authTest
exports.adminAddUser = adminAddUser
exports.singleUpdate = singleUpdate
exports.newAccSignUp = newAccSignUp
exports.simpleQuery = simpleQuery
exports.deleteAgent = deleteAgent
exports.getClaims = getClaims
exports.updateAccess = updateAccess

exports.addAdminRole = onCall((request) => {
  return admin
    .auth()
    .getUserByEmail(request.data.email)
    .then((user) => {
      console.log(user)
      // return user
      return admin.auth().setCustomUserClaims(user.uid, {
        claims: {
          // superAdmin: request.data.admin,
          admin: request.data.admin,
          manager: request.data.manager,
          ceo: request.data.ceo,
          sales: request.data.sales,
          reportsTo: request.data.reportsTo,
          organization: request.data.organization,
          organization: request.data.organization,
        },
      })
    })
    .then(() => {
      // return request.data
      return admin.auth().getUserByEmail(request.data.email)
    })
    .then((updatedUser) => {
      console.log('Updated user custom claims:', updatedUser.customClaims)
      return {
        message: `${request.data.email} has been assigned these roles.`,
        customClaims: updatedUser.customClaims.claims,
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

// handle all data here, bot accouts, and agents
// database one fucntion call with split callback
// fucntions as needed
// make obj and pass into function to create db
// records
exports.newSubscriber = onCall(async (request) => {
  const id = `ORG-${org}-${db.collection('agents').doc().id}`

  let userRecordData // Variable to store the userRecord
  return admin
    .auth()
    .createUser({
      email: request.data.email,
      password: request.data.password,
      displayName: `${request.data.firstName} ${request.data.lastName}`,
    })
    .then((userRecord) => {
      // Store the userRecord
      userRecordData = userRecord

      // Set the custom claims
      return admin.auth().setCustomUserClaims(userRecord.uid, {
        claims: {
          orgOwner: request.data.claims.orgOwner,
          superAdmin: request.data.claims.admin,
          admin: request.data.claims.admin,
          manager: request.data.claims.manager,
          ceo: request.data.claims.ceo,
          sales: request.data.claims.sales,
          reportsTo: request.data.claims.reportsTo,
          organization: request.data.claims.organization,
          organizationId: request.data.claims.organizationId,
        },
      })
    })
    .then(async (claimsResponse) => {
      const data = await handleDatabaseEntries()

      // Return both the userRecord and the claims response
      return {
        userRecord: userRecordData,
        claimsResponse: claimsResponse,
        data: request.data,
        data,
      }
    })
    .catch((error) => {
      console.error('Error creating new subscriber:', error)
      throw new Error(error.message)
    })
})

// create auth user
// todo add on the custom claims
exports.makeNewUser = onCall((request) => {
  let userRecordData

  if (!request.data.email || !request.data.password || !request.data.name) {
    throw new HttpsError('invalid-argument', 'Missing required fields')
  }

  const claims = {
    admin: false,
    manager: false,
    ceo: false,
    sales: false,
    reportsTo: '',
    organization: false,
    organizationId: false,
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
      userRecordData = userRecord
      return admin.auth().setCustomUserClaims(userRecord.uid, { claims })
    })
    .then(() => {
      // After setting claims, get the user to fetch the updated claims
      return admin.auth().getUser(userRecordData.uid)
    })
    .then((userWithClaims) => {
      return {
        userRecord: userRecordData,
        claims: claims, // Return the claims object we set
        customClaims: userWithClaims.customClaims, // Return the actual custom claims from Firebase
        data: request.data,
        msg: 'success, created new user with claims',
      }
    })
    .catch((error) => {
      throw new HttpsError('internal', 'Error creating new user: ' + error.message)
    })
})
exports.globalArray = []

// exports.deleteAgent = onCall((request) => {
//   if (!request.data.email) {
//     throw new HttpsError('invalid-argument', 'Email is required')
//   }

//   return admin
//     .auth()
//     .getUserByEmail(request.data.email)
//     .then((user) => {
//       admin.auth().deleteUser(user.uid)
//       return user
//     })
//     .then((user) => {
//       console.log('Successfully deleted user')
//       exports.globalArray.push({
//         userData: user,
//         status: 'ok',
//         msg: `success ${user.uid} has been deleted`,
//       })
//       return {
//         userData: user,
//         msg: `success ${user.displayName} has been deleted`,
//       }
//     })
//     .catch((error) => {
//       throw new HttpsError('internal', 'Error deleting user: ' + error.message)
//     })
// })

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

// make into a non exports and call  from server
// pass in id, claims, and any other data
// that we need here
exports.handleDatabaseSignUp = onCall(async (request) => {
  try {
    const db = getFirestore()
    const userData = { ...request.data }
    const userId = request.data.id

    const accRef = db.collection('organizations').doc(userId)
    const userRef = db.collection('agents').doc(userId)

    const reportsTo = {
      id: userId,
      name: `${userData.firstName} ${userData.lastName}`,
    }

    // Create account data WITHOUT claims
    const accData = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      accUsers: 0,
      accUsersLimit: 10,
      totalSpent: 0,
      salesMade: 0,
    }
    delete accData.claims // Only delete claims from account data

    // Create agent data WITH claims
    const agent = {
      ...userData, // Keeps the claims
      reportsTo,
    }

    // set account
    await accRef.set(accData)
    // set agent
    await userRef.set(agent)

    return {
      success: true,
      data: accData,
      agentData: agent,
    }
  } catch (error) {
    console.error('Error in handleDatabaseSignUp:', error)
    throw new Error('Failed to create database user')
  }
})

exports.handleWelcomeEmails = onCall(async (request) => {
  return request.data
})

async function getData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    const json = await response.json()

    return {
      data: json,
      msg: 'hello from the server',
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

async function handleDatabaseEntries(params) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    const json = await response.json()

    return {
      data: json,
      msg: 'hello from the server',
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

async function dbEntries(userId) {
  try {
    const db = getFirestore()
    const userData = request.data
    const userId = request.data.id

    // get org name and rplace \s with -
    const identifier = userData.organization

    // Create a new document in dbUsers collection
    // Using the email as the document ID (you can modify this if needed)

    // todo: change organizations id to different id
    const accRef = db.collection('organizations').doc(userId)
    const userRef = db.collection('agents').doc(userId)

    // Add timestamp to the data
    const dataToStore = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      accUsers: 0,
      accUsersLimit: 10,
      totalSpent: 0,
      salesMade: 0,
      reportsTo: {
        id: userId,
        name: `${userData.firstName} ${userData.lastName}`,
      },
    }

    const accUser = {
      ...userData,
      reportsTo: {
        id: userId,
        name: `${userData.firstName} ${userData.lastName}`,
      },
      //  ...
    }

    await accRef.set(dataToStore)
    await userRef.set(accUser)

    return {
      success: true,
      data: dataToStore,
      userData: accUser,
    }
  } catch (error) {
    console.error('Error in handleDatabaseSignUp:', error)
    throw new Error('Failed to create database user')
  }
}

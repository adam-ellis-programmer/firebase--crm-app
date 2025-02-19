// for funcitons that handle initial payed sign up
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { getAuth } = require('../firebase.config')
const { getFirestore } = require('firebase-admin/firestore')

// Initialize Firestore
const db = getFirestore()
const newAccSignUp = onCall(async (request) => {
  try {
    // USE REGEX TO FIND \S REPLACE '' THE CAPS
    const data = request.data.data
    const org = request.data.data.organization.slice(0, 4).toUpperCase()
    const id = `COMP-${org}-${db.collection('organizations').doc().id}`

    // Create the user in Authentication
    const userRecord = await getAuth().createUser({
      uid: id,
      email: data.email,
      emailVerified: false,
      password: data.password,
      displayName: `${data.firstName} ${data.lastName}`, // Combine first and last name
      photoURL: 'http://www.example.com/12345678/photo.png',
      disabled: false,
    })

    // Set custom claims
    await getAuth().setCustomUserClaims(userRecord.uid, {
      claims: {
        orgOwner: true,
        superAdmin: true,
        admin: true,
        manager: true,
        ceo: true,
        sales: true,
        reportsTo: {
          id: id,
          name: userRecord.displayName,
        },
        organization: data.organization,
        organizationId: data.organizationId,
        orgId: id,
      },
    })

    // Get the updated user info with claims
    const user = await getAuth().getUser(userRecord.uid)

    // delete password from db
    delete data.password
    const agentObj = {
      ...data,
      claims: user.customClaims.claims,
      reportsTo: {
        id: id,
        name: userRecord.displayName,
      },
    }

    // Create the database entry
    const dbResult = await makeDbEntry(agentObj, userRecord.uid, id)
    // const update = await updateAccountDoc(data.organizationId)

    return { user, success: true, userRecord, dbResult, agentObj, dbResult }
  } catch (error) {
    console.log('Error creating new user:', error)
    throw new HttpsError('internal', 'Error creating new user: ' + error.message)
    // throw new Error(error.message)
  }
})

// ============
// MAKE DB ENTRY
// ============

async function makeDbEntry(userData, uid, id) {
  try {
    // Create a new document in the agents collection
    const agentRef = db.collection('agents').doc(uid)
    const orgRef = db.collection('organizations').doc(uid)

    // Prepare the agent data
    const agentData = {
      ...userData,
      createdAt: new Date(),
      // delete one or the other
      orgId: id,
      docId: id,
    }

    delete userData.claims
    const orgObj = {
      ...userData,
      accUsersLimit: 10,
      accUsers: 0,
      orgId: id,
      docId: id,
    }

    // Add the documents to Firestore
    await agentRef.set(agentData)
    await orgRef.set(orgObj)

    return { success: true, data: agentData }
  } catch (error) {
    console.error('Error making DB entry:', error)
    throw new Error('Failed to create database entry')
  }
}

module.exports = {
  newAccSignUp,
}

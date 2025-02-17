const { onCall } = require('firebase-functions/v2/https')
const { getAuth } = require('../firebase.config')
const { getFirestore } = require('firebase-admin/firestore')

// Initialize Firestore
const db = getFirestore()

async function makeDbEntry(userData, uid) {
  try {
    // Create a new document in the agents collection
    const agentRef = db.collection('agents').doc(uid)

    // Prepare the agent data
    const agentData = {
      ...userData,
      createdAt: new Date(),
      uid: uid,
      id: uid,
    }

    // Add the document to Firestore
    await agentRef.set(agentData)

    return { success: true, data: agentData }
  } catch (error) {
    console.error('Error making DB entry:', error)
    throw new Error('Failed to create database entry')
  }
}

const adminAddUser = onCall(async (request) => {
  try {
    const data = request.data.data
    const org = request.data.data.organization.slice(0, 4).toUpperCase()
    const id = `AGENT-${org}-${db.collection('agents').doc().id}`

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
      orgOwner: true,
      superAdmin: true,
      admin: true,
      manager: true,
      ceo: true,
      sales: true,
      reportsTo: data.reportsTo,
      organization: data.organization,
      organizationId: data.organizationId,
    })
    // Get the updated user info
    const user = await getAuth().getUser(userRecord.uid)

    // delete password from db
    delete data.password
    const agentObj = {
      ...data,
      claims: user.customClaims,
    }

    // Create the database entry
    const dbResult = await makeDbEntry(agentObj, userRecord.uid)
    // const update = await updateAccountDoc(data.organizationId)

    console.log('Successfully created new user:', userRecord.uid)
    return {
      success: true,
      uid: userRecord.uid,
      data,
      user,
      dbEntry: dbResult,
      org,
      update,
    }
  } catch (error) {
    console.log('Error creating new user:', error)
    throw new HttpsError('internal', 'Error creating new user: ' + error.message)
    // throw new Error(error.message)
  }
})

// we need to create a referenct to the doc
//  If you try to update without getting the current count first, you could run into race conditions.
//
// attomic
// Organization has 5 users
// Two people try to add new users at exactly the same time
// If both functions read 5 and add 1, both will write 6
// Now you have 6 users recorded when you should have 7

// However, Firestore does provide an atomic increment operation using FieldValue.increment(). Here's the better way to do it:
async function updateAccountDoc(uid) {}

module.exports = {
  adminAddUser,
}

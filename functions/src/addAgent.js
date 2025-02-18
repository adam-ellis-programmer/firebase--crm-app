const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { getAuth } = require('../firebase.config')
const { getFirestore } = require('firebase-admin/firestore')

// Initialize Firestore
const db = getFirestore()

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
      claims: {
        // orgOwner: true,
        superAdmin: true,
        admin: true,
        manager: true,
        ceo: true,
        sales: true,
        reportsTo: data.reportsTo,
        organization: data.organization,
        organizationId: data.organizationId,
        orgId: data.orgId,
      },
    })
    // Get the updated user info
    const user = await getAuth().getUser(userRecord.uid)

    // delete password from db
    delete data.password
    const agentObj = {
      ...data,
      claims: user.customClaims.claims,
      docId: id,
      createdAt: new Date(),
      docId: id,
      orgId: data.orgId,
    }

    // Create the database entry
    const dbResult = await agentDbEntry(agentObj, id, data.orgId)

    console.log('Successfully created new user:', userRecord.uid)
    return {
      success: true,
      uid: userRecord.uid,
      data,
      user,
      dbEntry: dbResult,
      org,
      docId: id,
      orgId: data.orgId,
    }
  } catch (error) {
    console.log('Error creating new user:', error)
    throw new HttpsError('internal', 'Error creating new user: ' + error.message)
    // throw new Error(error.message)
  }
})

async function agentDbEntry(userData, id, orgId) {
  try {
    // Create a new document in the agents collection
    const agentRef = db.collection('agents').doc(id)

    // Prepare the agent data
    const agentData = {
      ...userData,
    }

    // Add the document to Firestore
    await agentRef.set(agentData)
    const updateData = await updateDocument(orgId)

    return { success: 'yes', data: agentData, updateData }
  } catch (error) {
    console.error('Error making DB entry:', error)
    throw new Error('Failed to create database entry')
  }
}

// look up atomic data
async function updateDocument(id) {
  // update ref
  const updateRef = db.collection('organizations').doc(id)

  // get doc ref
  const orgRef = db.collection('organizations').doc(id)

  // get doc
  const doc = await orgRef.get()

  if (!doc.exists) {
    return { msg: 'No Such document' }
  } else {
    // get current users
    const accUsersNum = doc.data().accUsers

    // update doc
    const res = await updateRef.update({ accUsers: accUsersNum + 1 })

    return { msg: 'success', accUsersNum, res }
  }
}

module.exports = {
  adminAddUser,
}

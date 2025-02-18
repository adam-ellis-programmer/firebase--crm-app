// for funcitons that handle initial payed sign up
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { getAuth } = require('../firebase.config')
const { getFirestore } = require('firebase-admin/firestore')

// Initialize Firestore
const db = getFirestore()
const deleteAgent = onCall(async (request) => {
  const email = request.data.email
  try {
    // get user
    const user = await getAuth().getUserByEmail(email)
    // init id
    const id = user.uid
    // delete user
    const deleted = await getAuth().deleteUser(id)
    // remove from db
    const dBDelete = deleteFromDB(id)
    // return data to client
    return { success: true, user, id, deleted, dBDelete }
  } catch (error) {
    console.log(error)
    throw new HttpsError('internal', 'Error deleting user: ' + error.message)
  }
})

async function deleteFromDB(id) {
  const res = await db.collection('agents').doc(id).delete()
  return { success: true, res }
}

async function handleDbUpdate(id) {
  //...
  return { success: true, id }
}

module.exports = {
  deleteAgent,
}

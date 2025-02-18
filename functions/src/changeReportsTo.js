// for funcitons that handle initial payed sign up
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { getAuth } = require('../firebase.config')
const { getFirestore } = require('firebase-admin/firestore')

// Initialize Firestore
const db = getFirestore()
const changeReportsTo = onCall(async (request) => {
  try {
    const email = request.data.data.email
    const data = request.data
    const user = await getAuth().getUserByEmail(email)
    const agentRecord = await updateDatabase(user.uid)
    return { agentRecord, success: true, res: request.data, user, data }
  } catch (error) {
    throw new HttpsError('internal', 'Error changing user access: ' + error.message)
  }
})

async function updateDatabase(id) {
  try {
    const cityRef = db.collection('agents').doc(id)
    const doc = await cityRef.get()
    if (!doc.exists) {
      console.log('No such document!')
    } else {
      console.log('Document data:', doc.data())
      const initialData = {
        name: 'Frank',
        age: 12,
        favorites: {
          food: 'Pizza',
          color: 'Blue',
          subject: 'recess',
        },
      }

      // ...
      const res = await db.collection('agents').doc(id).update({
        age: 13,
        'favorites.color': 'Red',
      })
      return { id: doc.id, data: doc.data() }
    }
  } catch (error) {
    throw new HttpsError('internal', 'Error changing user access: ' + error.message)
  }
}
/**
 * update the auth claims
 * update the agent in the database
 */
module.exports = {
  changeReportsTo,
}

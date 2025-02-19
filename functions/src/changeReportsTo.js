// for funcitons that handle initial payed sign up
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { getAuth } = require('../firebase.config')
const { getFirestore } = require('firebase-admin/firestore')

// Initialize Firestore
const db = getFirestore()
const changeReportsTo = onCall(async (request) => {
  try {
    const email = request.data.data.email
    const reportsToObj = request.data.data.reportsTo
    const user = await getAuth().getUserByEmail(email)
    const agentRecord = await updateDatabase(user.uid, reportsToObj)
    return { success: true, res: request.data, user, reportsToObj, agentRecord }
  } catch (error) {
    throw new HttpsError('internal', 'Error changing user access: ' + error.message)
  }
})

async function updateDatabase(id, reportsToObj) {
  try {
    const cityRef = db.collection('agents').doc(id)
    const doc = await cityRef.get()
    if (!doc.exists) {
      console.log('No such document!')
    } else {
      console.log('Document data:', doc.data())
      // ...
      const updateRes = await db.collection('agents').doc(id).update({
        'reportsTo.id': reportsToObj.id,
        'reportsTo.name': reportsToObj.name,
        'claims.reportsTo.id': reportsToObj.id,
        'claims.reportsTo.name': reportsToObj.name,
      })
      return { id: doc.id, data: doc.data(), updateRes }
    }
  } catch (error) {
    throw new HttpsError('internal', 'Error changing user access: ' + error.message)
  }
}

module.exports = {
  changeReportsTo,
}

import { db, admin, getFirestore } from '../firebase.config'
exports.test = onCall((request) => {
  return {
    msg: 'hello from the server component',
    data: request.data,
  }
  // Your function code here
})

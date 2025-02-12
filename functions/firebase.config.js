// functions/firebase.config.js
const admin = require('firebase-admin')

// Initialize without config since we're using service account credentials
admin.initializeApp()

const db = admin.firestore()

module.exports = { db, admin } // Export both db and admin

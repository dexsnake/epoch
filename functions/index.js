const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.addAdminRole = functions.https.onCall((data, context) => {
	return admin
		.auth()
		.getUserByEmail(data.email)
		.then((user) => {
			return admin.auth().setCustomUserClaims(user.uid, {
				isAdmin: true,
			})
		})
		.then(() => {
			return {
				message: `Success! ${data.email} has been made an admin`,
			}
		})
		.catch((err) => {
			return err
		})
})

exports.createUser = functions.https.onCall((data, context) => {
	return admin
		.auth()
		.createUser({
			email: data.email,
			password: data.password,
		})
		.then((user) => {
			return user
		})
		.catch((err) => {
			return err
		})
})
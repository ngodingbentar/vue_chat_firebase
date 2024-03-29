import firebase from "firebase/app";
import "firebase/database";

const config = {
	apiKey: process.env.VUE_APP_API_KEY,
	authDomain: process.env.VUE_APP_AUTH_DOMAIN,
	projectId: process.env.VUE_APP_PROJECT_ID,
	storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.VUE_APP_SENDER_ID,
	appId: process.env.VUE_APP_APP_ID,
	databaseURL: process.env.VUE_APP_DB_URL
}

const db = firebase.initializeApp(config);
export default db;
import firebase from "firebase/app";
import "firebase/database";

const config = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: "vuechat-9eb19",
	storageBucket: "vuechat-9eb19.appspot.com",
	messagingSenderId: "955052840025",
	appId: "1:955052840025:web:b76552b4004a0a0c72cd48"
}

const db = firebase.initializeApp(config);
export default db;
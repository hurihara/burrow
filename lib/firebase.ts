import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeXvxoEIUl7BFb9YCt5YzVjjFtixQmukk",
  authDomain: "burrow-90f6b.firebaseapp.com",
  projectId: "burrow-90f6b",
  storageBucket: "burrow-90f6b.firebasestorage.app",
  messagingSenderId: "608885449270",
  appId: "1:608885449270:web:cb31781a9180d518afae97"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

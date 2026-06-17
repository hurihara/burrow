import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestNotificationPermission = async () => {
  if (!messaging) return null
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'ここに鍵を貼り付けて'
      })
      return token
    }
  } catch (e) {
    console.error(e)
  }
  return null
}

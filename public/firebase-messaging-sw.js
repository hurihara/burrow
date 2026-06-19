importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAeXvxoEIUl7BFb9YCt5YzVjjFtixQmukk",
  authDomain: "burrow-90f6b.firebaseapp.com",
  projectId: "burrow-90f6b",
  storageBucket: "burrow-90f6b.firebasestorage.app",
  messagingSenderId: "608885449270",
  appId: "1:608885449270:web:cb31781a9180d518afae97"
});

const messaging = firebase.messaging();

// バックグラウンド通知を自分でハンドル（重複防止）
messaging.onBackgroundMessage((payload) => {
  // デフォルトの自動表示を上書きして1回だけ出す
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
  });
});

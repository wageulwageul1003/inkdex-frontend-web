import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env.local',
});

dotenv.config({
  path: '.env',
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase config:', {
  apiKey: !!firebaseConfig.apiKey,
  authDomain: !!firebaseConfig.authDomain,
  projectId: !!firebaseConfig.projectId,
  storageBucket: !!firebaseConfig.storageBucket,
  messagingSenderId: !!firebaseConfig.messagingSenderId,
  appId: !!firebaseConfig.appId,
});

const serviceWorker = `
importScripts(
  'https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js'
);

importScripts(
  'https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js'
);

firebase.initializeApp(
  ${JSON.stringify(firebaseConfig)}
);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[FCM] Background message:', payload);
});
`;

const outputPath = path.join(
  process.cwd(),
  'public',
  'firebase-messaging-sw.js',
);

fs.writeFileSync(outputPath, serviceWorker, 'utf-8');

console.log('Firebase Messaging Service Worker generated:', outputPath);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFIpOTxUpzSfzynXssqvkP014SU5TM_Is",
  authDomain: "phonemasterskenya.firebaseapp.com",
  projectId: "phonemasterskenya",
  storageBucket: "phonemasterskenya.firebasestorage.app",
  messagingSenderId: "660014384321",
  appId: "1:660014384321:web:f1c74581ddfcc6f8448040",
  measurementId: "G-QNCM51DF2H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const db = getFirestore(app);


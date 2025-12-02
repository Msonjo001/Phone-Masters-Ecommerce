import React from 'react'
/*
  Firebase configuration placeholder.
  Replace the firebaseConfig object with your project's credentials.
  This file uses Firebase modular SDK (v9+).
*/
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Simple auth hook for UI handling. Replace with context or robust state as needed.
export function useAuth(){
  const [user, setUser] = React.useState(null)

  React.useEffect(()=>{
    // TODO: attach onAuthStateChanged listener and set user
  },[])

  const login = async (email, password) => {
    // placeholder: sign in with firebase
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setUser({ name: email, role: 'buyer' })
    } catch(e){
      console.error(e)
      throw e
    }
  }

  const register = async (email, password, role='buyer') => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setUser({ name: email, role })
    } catch(e){
      console.error(e)
      throw e
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return { user, login, register, logout }
}
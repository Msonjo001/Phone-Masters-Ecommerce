// src/data/productsData.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const fetchProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/* src/firebaseConfig.ts */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCzmEnk3VUiUGm6qyJqRWxnXK8LsCWlduE",
    authDomain: "atmora-8ee3a.firebaseapp.com",
    projectId: "atmora-8ee3a",
    storageBucket: "atmora-8ee3a.firebasestorage.app",
    messagingSenderId: "577996496565",
    appId: "1:577996496565:web:9dfc6f8f226bf912aa28fc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
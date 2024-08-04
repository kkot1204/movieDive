// Firebase 앱을 초기화하는 모듈을 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
// Firebase 데이터베이스 가져오기
import { getFirestore,collection, addDoc, getDocs, doc, updateDoc, deleteDoc  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

//사용자 아이디를 위해 추가
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmulI1n7YvyAtOtQumYNa5IaaPvEddBvQ",
  authDomain: "movieaccount-3d409.firebaseapp.com",
  projectId: "movieaccount-3d409",
  storageBucket: "movieaccount-3d409.appspot.com",
  messagingSenderId: "942641611452",
  appId: "1:942641611452:web:864f3cd1c0918cfe14c6b9",
  measurementId: "G-E97WVRRBKZ"
};

const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);

//사용자 아이디 불러오기
const auth = getAuth();
let userId = null'
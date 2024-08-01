// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmulI1n7YvyAtOtQumYNa5IaaPvEddBvQ",
  authDomain: "movieaccount-3d409.firebaseapp.com",
  projectId: "movieaccount-3d409",
  storageBucket: "movieaccount-3d409.appspot.com",
  messagingSenderId: "942641611452",
  appId: "1:942641611452:web:864f3cd1c0918cfe14c6b9",
  measurementId: "G-E97WVRRBKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const signUpButton = document.querySelector("#signUpButton");
signUpButton.addEventListener("click", (event) => {
  event.preventDefault();
  const signUpEmail = document.getElementById("signUpEmail").value;
  const signUpPassword = document.getElementById("signUpPassword").value;

  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
      alert("회원가입 완료");
      // Signed in
      const user = userCredential.user;
      window.location.reload();
    })
    .catch((error) => {
      alert("이메일 주소 혹은 비밀번호를 다시 확인해주세요");
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
});

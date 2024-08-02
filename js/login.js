// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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
const auth = getAuth();

const logInButton = document.querySelector("#loginButton");
logInButton.addEventListener("click", (event) => {
  event.preventDefault();
  const loginID = document.getElementById("loginID").value;
  const loginPassword = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, loginID, loginPassword)
    .then((userCredential) => {
      // Signed in
      console.log(userCredential);
      const user = userCredential.user;
    })
    .catch((error) => {
      alert("로그인 정보가 일치하지 않습니다.");
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
});

// 회원가입 버튼 클릭시 login page 로 이동
document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.querySelector(".moveToSignUpPageButton");
  if (signupButton) {
    signupButton.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }
});
console.log(signupButton);

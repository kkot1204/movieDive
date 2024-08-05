import "./firebase-init.js";
import { auth, firestoreDB } from "./firebase-init.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// 회원가입 부분
document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.querySelector("#signUpButton");

  if (signUpButton) {
    signUpButton.addEventListener("click", (event) => {
      event.preventDefault();
      const signUpEmail = document.getElementById("signUpEmail").value;
      const signUpPassword = document.getElementById("signUpPassword").value;

      createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        .then(async (userCredential) => {
          alert("회원가입 완료");
          // Signed in
          const user = userCredential.user;
          localStorage.setItem("userID", user.uid);
          await setDoc(doc(firestoreDB, "user", `${user.uid}`), { saveMovies: [], reviewMovies: [] });
        })
        .then(() => (window.location.href = "/index.html"))
        .catch((error) => {
          console.log("error: ", error);
          alert("이메일 주소 혹은 비밀번호를 다시 확인해주세요");
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    });
  }

  // 로그인 버튼 클릭시 login page 로 이동
  const loginButton = document.querySelector(".moveToLoginPageButton");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});

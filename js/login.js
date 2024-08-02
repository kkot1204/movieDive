import "./firebase-init.js";
import { auth } from "./firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const logInButton = document.querySelector("#loginButton");

  if (logInButton) {
    // if문으로 로그인 버튼이 존재하는지 확인. 없으면 null, 안정성 감소
    logInButton.addEventListener("click", (event) => {
      event.preventDefault(); // 페이지가 새로고침 되는 것을 방지
      const loginID = document.getElementById("loginID").value;
      const loginPassword = document.getElementById("loginPassword").value;
      // 이메일과 비밀번호 입력 시 로그인 auth 는 인증 객체
      signInWithEmailAndPassword(auth, loginID, loginPassword)
        .then((userCredential) => {
          // 로그인 정보를 가져오고 성공 시 index.html 로 이동
          //Firebase 인증 메서드가 성공적으로 완료됐을 때 반환되는 객체 userCredential
          const user = userCredential.user;
          window.location.href = "/index.html";
        })
        .catch((error) => {
          alert("로그인 정보가 일치하지 않습니다.");
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    });
  }
  // 회원가입 버튼 클릭 시 회원가입 페이지로 이동
  const signupButton = document.querySelector(".moveToSignUpPageButton");
  if (signupButton) {
    signupButton.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }
});

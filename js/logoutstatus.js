// 로그인 로그아웃 상태값
import { auth } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.querySelector(".moveToLoginPageButton");
  const signUpButton = document.querySelector(".moveToSignUpPageButton");
  const logoutButton = document.getElementById("logoutButton");
  const myMoviesButton = document.getElementById("moveToMyMoviesButton");

  // 모든 버튼을 숨긴 상태에서 인증 상태에 따라 버튼을 표시
  if (loginButton) loginButton.style.display = "none";
  if (signUpButton) signUpButton.style.display = "none";
  if (logoutButton) logoutButton.style.display = "none";
  if (myMoviesButton) myMoviesButton.style.display = "none";

  const userLoggedIn = localStorage.getItem("userLoggedIn");

  if (userLoggedIn === "true") {
    if (loginButton) loginButton.style.display = "none";
    if (signUpButton) signUpButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "block";
    if (myMoviesButton) myMoviesButton.style.display = "block";
  } else {
    if (loginButton) loginButton.style.display = "block";
    if (signUpButton) signUpButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";
    if (myMoviesButton) myMoviesButton.style.display = "none";
  }

  // Firebase Auth 상태 감지
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("userLoggedIn", "true");
      if (loginButton) loginButton.style.display = "none";
      if (signUpButton) signUpButton.style.display = "none";
      if (logoutButton) logoutButton.style.display = "block";
      if (myMoviesButton) myMoviesButton.style.display = "block";
    } else {
      localStorage.setItem("userLoggedIn", "false");
      if (loginButton) loginButton.style.display = "block";
      if (signUpButton) signUpButton.style.display = "block";
      if (logoutButton) logoutButton.style.display = "none";
      if (myMoviesButton) myMoviesButton.style.display = "none";
    }
  });

  // 로그아웃 후 index.html로 리디렉션
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("User logged out");
          localStorage.setItem("userID", null);
        })
        .then(() => (window.location.href = "index.html"))
        .catch((error) => {
          console.error("Logout failed:", error);
        });
    });
  }
});

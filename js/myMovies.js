import "./firebase-init.js";
import "./logoutstatus.js";

// TODO: index.html 에도 myMovies로 이동할 클릭 이벤트 추가
const moveToMyMoviesButton = document.querySelector("#moveToMyMoviesButton");
export const setToMyMoviesButtonEvent = () => {
  moveToMyMoviesButton.addEventListener("click", () => {
    window.location.href = `./myMovies.html`;
  });
};

setToMyMoviesButtonEvent();

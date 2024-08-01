// TODO: detail.html 에도 myMovies로 이동할 클릭 이벤트 추가
const moveToMyMoviesButton = document.querySelector("#moveToMyMoviesButton");
export const setToMyMoviesButtonEvent = () => {
  moveToMyMoviesButton.addEventListener("click", () => {
    window.location.href = `./myMovies.html`;
  });
};

setToMyMoviesButtonEvent();

const saveButtons = document.querySelectorAll(".saveButton");
const setSaveMovieButtonEvent = () => {
  saveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("savedButton");
    });
  });
};

setSaveMovieButtonEvent();

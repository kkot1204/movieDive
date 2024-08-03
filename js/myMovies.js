// import "./firebase-init.js";
import "./logoutstatus.js";

// TODO: index.html 에도 myMovies로 이동할 클릭 이벤트 추가
const moveToMyMoviesButton = document.querySelector("#moveToMyMoviesButton");
/** myMovies.html로 이동하는 버튼 이벤트 등록 */
export const setToMyMoviesButtonEvent = () => {
  if (!moveToMyMoviesButton) return;
  moveToMyMoviesButton.addEventListener("click", () => {
    window.location.href = `./myMovies.html`;
  });
};

setToMyMoviesButtonEvent();

let userID = localStorage.getItem("userID");
console.log("userID: ", userID);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
const db = getFirestore(app);
const docRef = doc(db, "user", `${userID}`);

export let saveMovieIDArray = [];
let reviewMovieIDArray = [];

let saveMovieInfoArray = [];
let reviewMovieInfoArray = [];

/** 접속한 유저의 saveMovies, reviewMovies 받아오기 */
export const getUserMovies = async () => {
  try {
    if (userID === "null") return;
    let userInfo = await getDoc(docRef);
    saveMovieIDArray = userInfo.data().saveMovies;
    reviewMovieIDArray = userInfo.data().reviewMovies;

    for (let movieID of saveMovieIDArray) {
      const url = `https://api.themoviedb.org/3/movie/${movieID}?`;

      let response = await fetch(url, options);
      response = await response.json();

      const movieData = {
        id: response.id,
        title: response.title,
        posterPath: `https://image.tmdb.org/t/p/w500${response.poster_path}`,
        overview: response.overview
      };

      saveMovieInfoArray.push(movieData);
    }

    for (let movieID of reviewMovieIDArray) {
      const url = `https://api.themoviedb.org/3/movie/${movieID}?`;
      let response = await fetch(url, options);
      response = await response.json();

      const movieData = {
        id: response.id,
        title: response.title,
        posterPath: `https://image.tmdb.org/t/p/w500${response.poster_path}`,
        overview: response.overview
      };

      reviewMovieInfoArray.push(movieData);
    }
  } catch (error) {
    console.log("error! ", error);
  }
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjJlOWIyZWNkMmI1MDIwN2YzMWU2NzFhMDU3NzRmNSIsIm5iZiI6MTcyMTkxNjYxOC43MTM4NTgsInN1YiI6IjY2YTI1YWMxY2EyMzA4N2I0YWNmODgwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.k8F1VMfOMPodILUqqlXGQXrOEgkbQGiJ8w_vnWFM_nE"
  }
};

const savedMoviesSection = document.querySelector(".savedMovies");
const reviewedMoviesSection = document.querySelector(".reviewedMovies");
async function showUserMovies() {
  await getUserMovies();

  if (window.location.href.includes("myMovies")) {
    updateMyMovieSection(saveMovieInfoArray);
    updateMyMovieSection(reviewMovieInfoArray);
  }
}

showUserMovies();

/** 찜하기 버튼 클릭시 발생할 이벤트 콜백함수 */
export const saveButtonEvent = async (event) => {
  event.currentTarget.classList.toggle("saved");
  const selectedMovieID = event.currentTarget.parentElement.id;
  if (event.currentTarget.classList.contains("saved")) {
    // 찜한 경우
    saveMovieIDArray.push(selectedMovieID);
  } else {
    // 찜 해제한 경우
    saveMovieIDArray = saveMovieIDArray.filter((id) => id != selectedMovieID);
  }

  await updateDoc(docRef, { saveMovies: saveMovieIDArray });
  if (window.location.href.includes("myMovies")) location.reload(true);
};

/** 영화 정보 배열을 받아 interestMovies 내부 요소들을 구성한다.
 * @param movieInfoArray - saveMovieInfoArray 혹은 reviewMovieInfoArray
 */
const updateMyMovieSection = (movieInfoArray) => {
  movieInfoArray.forEach((movie) => {
    const tempCard = document.createElement("div");
    tempCard.className = "movie-card";
    tempCard.id = movie.id;

    tempCard.innerHTML = `
    <img src=${movie.posterPath} alt="영화이미지" />
    <div class="text_area">
      <h3>${movie.title}</h3>
      <p>${movie.overview}</p>
    </div>`;

    const tempButton = document.createElement("span");
    tempButton.className = "material-symbols-outlined saveButton";

    if (saveMovieIDArray.includes(String(movie.id))) {
      tempButton.classList.add("saved");
    }

    tempButton.style.fontSize = "36px";
    tempButton.innerText = "favorite";

    tempButton.addEventListener("click", saveButtonEvent);

    tempCard.appendChild(tempButton);

    const movieSection = movieInfoArray === saveMovieInfoArray ? savedMoviesSection : reviewedMoviesSection;
    movieSection.appendChild(tempCard);
  });
};

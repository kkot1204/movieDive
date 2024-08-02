// TODO: detail.html 에도 myMovies로 이동할 클릭 이벤트 추가
const moveToMyMoviesButton = document.querySelector("#moveToMyMoviesButton");
/** myMovies.html로 이동하는 버튼 이벤트 등록 */
export const setToMyMoviesButtonEvent = () => {
  moveToMyMoviesButton.addEventListener("click", () => {
    window.location.href = `./myMovies.html`;
  });
};

setToMyMoviesButtonEvent();

const saveButtons = document.querySelectorAll(".saveButton");
/** 버튼에 영화 찜하기 이벤트 등록 */
const setSaveMovieButtonEvent = () => {
  saveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("savedButton");
    });
  });
};

// setSaveMovieButtonEvent();

const userID = "c4JZesd1IXO1W2wHJyLDy46CMg52"; // 테스트용 ID, TODO: 추후 firebase auth에 id 관련 메서드 등 찾아서 적용

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

let saveMovieArray = [];
let reviewMovieArray = [];

/** 접속한 유저의 saveMovies, reviewMovies 받아오기 */
const getUserMovies = async () => {
  try {
    let userInfo = await getDoc(docRef);
    let userSaveMovies = userInfo.data().saveMovies;
    let userReviewMovies = userInfo.data().reviewMovies;

    for (let movieID of userSaveMovies) {
      const url = `https://api.themoviedb.org/3/movie/${movieID}?`;

      let response = await fetch(url, options);
      response = await response.json();

      const movieData = {
        id: response.id,
        title: response.title,
        posterPath: `https://image.tmdb.org/t/p/w500${response.poster_path}`,
        overview: response.overview
      };

      saveMovieArray.push(movieData);
    }

    for (let movieID of userReviewMovies) {
      const url = `https://api.themoviedb.org/3/movie/${movieID}?`;
      let response = await fetch(url, options);
      response = await response.json();

      const movieData = {
        id: response.id,
        title: response.title,
        posterPath: `https://image.tmdb.org/t/p/w500${response.poster_path}`,
        overview: response.overview
      };

      reviewMovieArray.push(movieData);
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

  saveMovieArray.forEach((movie) => {
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
    tempButton.style.fontSize = "36px";
    tempButton.innerText = "favorite";

    tempButton.addEventListener("click", (event) => {
      event.currentTarget.classList.toggle("savedButton");
    });

    tempCard.appendChild(tempButton);
    savedMoviesSection.appendChild(tempCard);
  });

  reviewMovieArray.forEach((movie) => {
    const tempCard = document.createElement("div");
    tempCard.className = "movie-card";
    tempCard.id = movie.id;

    tempCard.innerHTML = `
    <img src=${movie.posterPath} alt="영화이미지" />
    <div class="text_area">
      <h3>${movie.title}</h3>
      <p>${movie.overview}</p>
    </div>
    `;

    const tempButton = document.createElement("span");
    tempButton.className = "material-symbols-outlined saveButton";
    tempButton.style.fontSize = "36px";
    tempButton.innerText = "favorite";

    tempButton.addEventListener("click", (event) => {
      event.currentTarget.classList.toggle("savedButton");
    });

    tempCard.appendChild(tempButton);
    reviewedMoviesSection.appendChild(tempCard);
  });
}

showUserMovies();

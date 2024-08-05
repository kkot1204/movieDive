import "./logoutstatus.js";
import { firestoreDB } from "./firebase-init.js";
import { doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
const docRef = doc(firestoreDB, "user", `${userID}`);

export let saveMovieIDArray = [];
let reviewMovieIDArray = [];

let saveMovieInfoArray = [];
let reviewMovieInfoArray = [];

/** 접속한 유저의 saveMovies, reviewMovies 받아오기 */
export const getUserMovies = async () => {
  try {
    if (!userID || userID === "null") return; // 로그아웃한 경우, 로그인하지 않은 경우
    let userInfo = await getDoc(docRef);

    // firestore에 존재하지 않는 경우 (ex. 이전에 만들어둔 게정)
    if (!userInfo.exists()) {
      await setDoc(doc(firestoreDB, "user", `${userID}`), { saveMovies: [], reviewMovies: [] });
      userInfo = await getDoc(docRef);
    }

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
const numberOfSaveMovies = document.querySelector("#numberOfSaveMovies");
const numberOfReviewMovies = document.querySelector("#numberOfReviewMovies");
async function showUserMovies() {
  await getUserMovies();

  if (saveMovieIDArray.length === 0) {
    savedMoviesSection.firstElementChild.classList.remove("hidden");
  } else {
    numberOfSaveMovies.innerText = `(${String(saveMovieIDArray.length)})`;
  }

  if (reviewMovieIDArray.length === 0) {
    reviewedMoviesSection.firstElementChild.classList.remove("hidden");
  } else {
    numberOfReviewMovies.innerText = `(${String(reviewMovieIDArray.length)})`;
  }

  updateMyMovieSection(saveMovieInfoArray);
  updateMyMovieSection(reviewMovieInfoArray);
}

if (window.location.href.includes("myMovies")) showUserMovies();

/** 찜하기 버튼 클릭시 발생할 이벤트 콜백함수 */
export const saveButtonEvent = async (event) => {
  if (!userID || userID === "null") {
    alert("회원가입/로그인을 먼저 해주세요!");
    return;
  }
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

/** 리뷰 등록, 삭제시 firestore 업데이트
 * @param isAddReview - 리뷰 등록하는 경우 true, 삭제하는 경우 false
 */
export const updateReviewMovie = async (movieID, isAddReview) => {
  if (!userID || userID === "null") return;
  if (isAddReview) {
    // 리뷰 등록하는 경우
    reviewMovieIDArray.push(movieID);
  } else {
    // 리뷰 삭제하는 경우
    reviewMovieIDArray = reviewMovieIDArray.filter((id) => id != movieID);
  }

  await updateDoc(docRef, { reviewMovies: reviewMovieIDArray });
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
    tempCard.addEventListener("click", moveToDetail);

    const movieSection = movieInfoArray === saveMovieInfoArray ? savedMoviesSection : reviewedMoviesSection;
    movieSection.appendChild(tempCard);
  });
};

const moveToDetail = (event) => {
  if (event.target.classList.contains("saveButton")) return;
  window.location.href = `./detail.html?movie=${encodeURIComponent(event.currentTarget.id)}`;
};

function picture() {
  let userPicture = document.getElementById("moveToMyMoviesButton");
  let randomColor =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  userPicture.style.backgroundColor = randomColor;
}

document.addEventListener("DOMContentLoaded", (event) => {
  picture();
  setInterval(picture, 1000);
});

// 이미지 파일 경로 배열
const imageCount = 5; // 이미지 파일 수
const imagePaths = [];

for (let i = 1; i <= imageCount; i++) {
  imagePaths.push(`image/${i}.png`);
}

// 랜덤 이미지 불러오기 함수
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener("DOMContentLoaded", () => {
  const randomImageElement = document.getElementById("moveToMyMoviesButton");
  const randomImagePath = getRandomImage();

  const imgElement = document.createElement("img");
  imgElement.src = randomImagePath;
  imgElement.alt = "Random Image";
  imgElement.width = 42; // 너비 설정
  imgElement.height = 42; // 높이 설정

  randomImageElement.appendChild(imgElement);
});

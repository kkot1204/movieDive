import { setToMyMoviesButtonEvent, getUserMovies, saveMovieIDArray, saveButtonEvent } from "./myMovies.js";

import "./firebase-init.js"; // Firebase 초기화
import "./logoutstatus.js"; // 로그아웃 상태 관리를 위한 스크립트 추가

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjJlOWIyZWNkMmI1MDIwN2YzMWU2NzFhMDU3NzRmNSIsIm5iZiI6MTcyMTkxNjYxOC43MTM4NTgsInN1YiI6IjY2YTI1YWMxY2EyMzA4N2I0YWNmODgwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.k8F1VMfOMPodILUqqlXGQXrOEgkbQGiJ8w_vnWFM_nE"
  }
};

let movie_list;

async function getMovieData(searchText) {
  console.log("sss", searchText);
  let url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";

  // 검색어가 있을 경우에는 검색 관련 url을 붙여준다.
  if (searchText) {
    url = `https://api.themoviedb.org/3/search/movie?query=${searchText}`;
  }

  //원래 그려져 있던 부모 컨테이너를 한 번 지워준다.
  let parentHtml = document.getElementById("movie-container");
  parentHtml.innerHTML = "";

  console.log("url부분", url);

  await getUserMovies();

  // fetch를 통한 데이터 가져오기 + 카드 그려주는 로직
  fetch(url, options).then((response) => {
    response.json().then((response) => {
      movie_list = response["results"];
      console.log(response);
      let temp_html = ``;
      movie_list.forEach((i) => {
        let img_url = "https://image.tmdb.org/t/p/w500" + i["poster_path"];
        let movie_title = i["title"];
        let overview = i["overview"];
        let vote = i["vote_average"];
        let id = i["id"];

        createMovieCard(id, movie_title, img_url, overview, vote);
      });
    });
  });
}

const movieContainer = document.getElementById("movie-container");
const createMovieCard = (id, title, posterPath, overview, vote) => {
  const tempCard = document.createElement("div");
  tempCard.className = "movie-card";
  tempCard.id = id;
  tempCard.innerHTML = `
      <img src="${posterPath}" alt="영화이미지">
      <div class="text_area">
          <h3>${title}</h3>
          <p>${overview}</p>
          <span>평점 : ${vote}</span>
      </div>
    `;

  const tempButton = document.createElement("span");
  tempButton.className = "material-symbols-outlined saveButton";

  if (saveMovieIDArray.includes(String(id))) {
    tempButton.classList.add("saved");
  }

  tempButton.style.fontSize = "36px";
  tempButton.innerText = "favorite";

  tempButton.addEventListener("click", saveButtonEvent);
  tempCard.appendChild(tempButton);

  tempCard.addEventListener("click", moveToDetail);
  movieContainer.appendChild(tempCard);
};

// selectbox 부분
function getMovieDataForId(id) {
  console.log(id);
  movieContainer.innerHTML = "";
  let temp_html = ``;

  // 평점 높은 순
  if (id === "top_rated") {
    let topratedMovie = movie_list.sort(function (a, b) {
      return b.vote_average - a.vote_average;
    });

    console.log(topratedMovie);
    topratedMovie.forEach(function (movie) {
      let img_url = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
      let movie_title = movie.title;
      let overview = movie.overview;
      let vote = movie.vote_average;
      let id = movie.id;

      createMovieCard(id, movie_title, img_url, overview, vote);
    });
  } else if (id === "low_rated") {
    // 평점 낮은 순
    let lowratedMovie = movie_list.sort(function (a, b) {
      return a.vote_average - b.vote_average;
    });
    console.log(lowratedMovie);
    lowratedMovie.forEach(function (movie) {
      let img_url = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
      let movie_title = movie.title;
      let overview = movie.overview;
      let vote = movie.vote_average;
      let id = movie.id;
      createMovieCard(id, movie_title, img_url, overview, vote);
    });
  } else if (id === "now_playing") {
    // 최신순
    let nowplayMovie = movie_list.sort(function (a, b) {
      return new Date(b.release_date) - new Date(a.release_date);
    });
    console.log(nowplayMovie);
    nowplayMovie.forEach(function (movie) {
      let img_url = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
      let movie_title = movie.title;
      let overview = movie.overview;
      let vote = movie.vote_average;
      let id = movie.id;
      createMovieCard(id, movie_title, img_url, overview, vote);
    });
  }
}
// top_rated id 찾음
document.getElementById("top_rated").addEventListener("click", function () {
  getMovieDataForId("top_rated");
});
document.getElementById("low_rated").addEventListener("click", function () {
  getMovieDataForId("low_rated");
});
document.getElementById("now_playing").addEventListener("click", function () {
  getMovieDataForId("now_playing");
});

//기본적으로 getMovieData를 호출하여 기본 디폴트 화면을 표시해줌
getMovieData();

// main의 영화 검색 시 해당 위치로 넘어가게
function scrollSearchValue() {
  const introduce = document.getElementById("movie_section");
  window.scrollBy({ top: introduce.getBoundingClientRect().top, behavior: "smooth" });
}

// 서치 함수, 버튼 클릭 이벤트 쪽에서 onclick시 실행되도록 처리
function search() {
  let text = document.getElementById("searchInput").value;
  getMovieData(text);
}

let searchBtn = document.getElementById("search_btn");
searchBtn.onclick = () => {
  search();
  scrollSearchValue();
};

// Enter serach //
document.querySelector(".searchInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // 기본 Enter 키 동작 방지 (예: form 제출)
    const query = event.target.value;
    getMovieData(query);
    scrollSearchValue();
  }
});

// myMovie 페이지로 이동할 수 있는 버튼 이벤트 설정
setToMyMoviesButtonEvent();

const moveToDetail = (event) => {
  if (event.target.classList.contains("saveButton")) return;
  window.location.href = `./detail.html?movie=${encodeURIComponent(event.currentTarget.id)}`;
};

/* 재헌 추가 시작 부분 */
document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.querySelector(".moveToLoginPageButton");
  const signUpButton = document.querySelector(".moveToSignUpPageButton");

  // 로그인 및 회원가입 버튼 이벤트 리스너 설정
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  if (signUpButton) {
    signUpButton.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }
});

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

// 기존 이미지 제거
while (randomImageElement.firstChild) {
  randomImageElement.removeChild(randomImageElement.firstChild);
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

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

async function getMovieData(searchText) {
  console.log("sss", searchText);
  let url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

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
      let movie_list = response["results"];
      console.log(response);
      let temp_html = ``;
      movie_list.forEach((i) => {
        let img_url = "https://image.tmdb.org/t/p/w500" + i["poster_path"];
        let movie_title = i["title"];
        let overview = i["overview"];
        let vote = i["vote_average"];
        let id = i["id"];

        const tempCard = document.createElement("div");
        tempCard.className = "movie-card";
        tempCard.id = id;

        tempCard.innerHTML = `
            <img src="${img_url}" alt="영화이미지">
            <div class="text_area">
                <h3>${movie_title}</h3>
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
        document.getElementById("movie-container").appendChild(tempCard);
      });
    });
  });
}

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
  // Optionally, you can set the color change to happen periodically
  setInterval(picture, 1000); // change color every 3 seconds
});

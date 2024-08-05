// API 호출 옵션 설정
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjJlOWIyZWNkMmI1MDIwN2YzMWU2NzFhMDU3NzRmNSIsIm5iZiI6MTcyMTkxNjYxOC43MTM4NTgsInN1YiI6IjY2YTI1YWMxY2EyMzA4N2I0YWNmODgwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.k8F1VMfOMPodILUqqlXGQXrOEgkbQGiJ8w_vnWFM_nE" // 실제 TMDb API 액세스 토큰으로 대체
  }
};

// URL의 쿼리 스트링에서 영화 ID 값을 추출
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("movie");

// API 호출 및 상세 정보 표시
async function fetchMovieDetails() {
  if (!movieId) {
    document.querySelector(".movie-title").textContent = "유효한 영화 ID가 제공되지 않았습니다.";
    return;
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayMovieDetails(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    document.querySelector(".movie-title").textContent = "데이터를 불러오는 중 오류가 발생했습니다.";
  }
}

// 상세 정보를 화면에 표시하는 함수
function displayMovieDetails(data) {
  document.querySelector(".movie-image").src = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
  document.querySelector(".movie-title").textContent = data.title;
  document.querySelector(
    ".movie-info"
  ).textContent = `${data.release_date} | ${data.runtime}분 | 평점: ${data.vote_average}`;
  document.querySelector(".movie-description").textContent = data.overview;
}

// 데이터 로드 시작
fetchMovieDetails();

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

/* 재헌 추가 시작 */
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

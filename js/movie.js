const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjJlOWIyZWNkMmI1MDIwN2YzMWU2NzFhMDU3NzRmNSIsIm5iZiI6MTcyMTkxNjYxOC43MTM4NTgsInN1YiI6IjY2YTI1YWMxY2EyMzA4N2I0YWNmODgwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.k8F1VMfOMPodILUqqlXGQXrOEgkbQGiJ8w_vnWFM_nE"
  }
};

let movie_list;

function getMovieData(searchText) {
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

        temp_html += `
            <div class="movie-card" id="${id}" onclick="alert('영화 ID: ${id}')">
                <img src="${img_url}" alt="영화이미지">
                <div class="text_area">
                  <h3>${movie_title}</h3>
                  <p>${overview}</p>
                  <span>평점 : ${vote}</span>
                </div>
            </div>
          `;
        document.getElementById("movie-container").innerHTML = temp_html;
      });
    });
  });
}

// selectbox 부분
function getMovieDataForId(id) {
  console.log(id);
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
      temp_html += `
            <div class="movie-card" id="${id}" onclick="alert('영화 ID: ${id}')">
                <img src="${img_url}" alt="영화이미지">
                <div class="text_area">
                  <h3>${movie_title}</h3>
                  <p>${overview}</p>
                  <span>평점 : ${vote}</span>
                </div>
            </div>
          `;
    });
    document.getElementById("movie-container").innerHTML = temp_html;
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
      temp_html += `
            <div class="movie-card" id="${id}" onclick="alert('영화 ID: ${id}')">
                <img src="${img_url}" alt="영화이미지">
                <div class="text_area">
                  <h3>${movie_title}</h3>
                  <p>${overview}</p>
                  <span>평점 : ${vote}</span>
                </div>
            </div>
          `;
    });
    document.getElementById("movie-container").innerHTML = temp_html;
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
      temp_html += `
            <div class="movie-card" id="${id}" onclick="alert('영화 ID: ${id}')">
                <img src="${img_url}" alt="영화이미지">
                <div class="text_area">
                  <h3>${movie_title}</h3>
                  <p>${overview}</p>
                  <span>평점 : ${vote}</span>
                </div>
            </div>
          `;
    });
    document.getElementById("movie-container").innerHTML = temp_html;
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
// 서치 함수, 버튼 클릭 이벤트 쪽에서 onclick시 실행되도록 처리
function search() {
  let text = document.getElementById("searchInput").value;
  getMovieData(text);
}

let searchBtn = document.getElementById("search_btn");
searchBtn.onclick = () => {
  search();
};

// Enter serach //
document.querySelector(".searchInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // 기본 Enter 키 동작 방지 (예: form 제출)
    const query = event.target.value;
    getMovieData(query);
  }
});

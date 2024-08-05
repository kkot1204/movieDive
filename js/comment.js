import { updateReviewMovie } from "./myMovies.js";
// Firebase 앱을 초기화하는 모듈을 가져오기

// Firebase 앱을 초기화하기 위한 함수 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// Firestore DB 및 관련 기능들을 가져오기
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
// 사용자 인증 관련 함수 가져오기
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// Firebase프로젝트의 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyCmulI1n7YvyAtOtQumYNa5IaaPvEddBvQ",
  authDomain: "movieaccount-3d409.firebaseapp.com",
  projectId: "movieaccount-3d409",
  storageBucket: "movieaccount-3d409.appspot.com",
  messagingSenderId: "942641611452",
  appId: "1:942641611452:web:864f3cd1c0918cfe14c6b9",
  measurementId: "G-E97WVRRBKZ"
};

//Firebase앱 초기화
const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);
const auth = getAuth();
let userEmail = null; // 현재 로그인한 사용자의 이메일을 저장할 변수

// 사용자 이메일 불러오기 및 로그인 상태 관리
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmail = user.email; // 사용자가 로그인한 경우, 이메일을 저장
    console.log("로그인 성공:", userEmail); // 로그인 성공 메시지 출력
  } else {
    userEmail = null; // 사용자가 로그인하지 않은 경우
    console.log("로그인 상태가 아닙니다."); // 로그인 상태 메시지 출력
  }
});

// 댓글을 로드하는 함수
async function loadComments() {
  // movieID에 해당하는 댓글만 쿼리
  const commentsQuery = query(
    collection(firestoreDB, "review"),
    where("movieID", "==", movieID) // movieID 필터링
  );

  const querySnapshot = await getDocs(commentsQuery); // 필터링된 댓글 로드

  const commentList = $(".comment_list_wrap ul"); //댓글 목록을 담을 요소 선택
  commentList.empty(); // 이전 댓글을 비움

  querySnapshot.forEach((doc) => {
    // 모든 댓글에 대해 반복
    const data = doc.data(); // 문서 데이터 가져오기
    const commentItem = `
          <li data-id="${doc.id}">
            <div class="comment_info_wrap">
              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Profile Image" />
              <div class="comment_info_nickname">
                <div class="userEmail">${data.userEmail}</div>
                <div class="info_base">${data.timestamp}</div>
              </div>
            </div>
            <div class="comment_text_wrap">${data.content}</div>
            <div class="comment_button">
              ${
                data.userEmail === userEmail
                  ? `<span class="edit-button">수정</span>
                 <span class="delete-button">삭제</span>`
                  : ""
              }
            </div>
          </li>`; //댓글 아이템 HTML 템플릿
    commentList.append(commentItem); // 댓글 목록에 댓글 추가
  });

  // 이벤트 리스너 등록
  attachCommentButtonListeners();
}

// 댓글 버튼에 대한 이벤트 리스너 등록 함수
function attachCommentButtonListeners() {
  $(".edit-button")
    .off("click")
    .on("click", function () {
      const commentId = $(this).closest("li").data("id");
      const currentContent = $(this).closest("li").find(".comment_text_wrap").text();
      editComment(commentId, currentContent);
    });

  $(".delete-button")
    .off("click")
    .on("click", function () {
      const commentId = $(this).closest("li").data("id");
      deleteComment(commentId);
    });
}

$(document).ready(function () {
  loadComments(); // 페이지 로드 시 댓글 불러오기

  $("#commentSubmit").click(async function (event) {
    event.preventDefault();
    let content = $("#commentInput").val();
    let timestamp = new Date().toISOString();

    if (userEmail) {
      // 사용자가 로그인한 경우
      await addDoc(collection(firestoreDB, "review"), {
        content: content,
        userEmail: userEmail, // 로그인한 사용자 이메일
        timestamp: timestamp, // 댓글 작성 시간
        movieID: movieID // movieID 추가
      });

      await updateReviewMovie(movieID, true);

      loadComments(); // 댓글 새로고침
    } else {
      alert("로그인 후 이용해주세요");
    }
  });
});

// 수정 버튼 클릭 시 호출되는 함수
async function editComment(commentId, currentContent) {
  const newContent = prompt("수정할 내용을 입력하세요:", currentContent);
  if (newContent !== null && newContent.trim() !== "" && userEmail) {
    // 입력된 내용이 유효하고 사용자가 로그인한 경우
    const commentRef = doc(firestoreDB, "review", commentId);
    await updateDoc(commentRef, { content: newContent });
    loadComments(); // 댓글 새로고침
  } else {
    alert("로그인 후 이용해주세요");
  }
}

// 댓글 삭제 함수
async function deleteComment(commentId) {
  const confirmDelete = confirm("정말로 삭제하시겠습니까?");
  if (confirmDelete) {
    // 사용자가 삭제를 확인한 경우
    console.log("현재 로그인한 사용자 이메일:", userEmail); // 로그인 상태 확인
    if (userEmail) {
      // 사용자가 로그인한 경우
      const commentRef = doc(firestoreDB, "review", commentId);
      await deleteDoc(commentRef);
      await updateReviewMovie(movieID, false);
      loadComments(); // 댓글 새로고침
    } else {
      alert("로그인 후 이용해주세요");
    }
  }
}

// 테스트용
const params = new URLSearchParams(window.location.search);
const movieID = params.get("movie");
console.log(movieID);

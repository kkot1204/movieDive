import { firestoreDB } from "./firebase-init.js";
// Firebase 앱을 초기화하는 모듈을 가져오기

import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "./firebase-init.js";
import { getAuth, onAuthStateChanged } from "./firebase-init.js";

const auth = getAuth();
let userEmail = null; // 현재 로그인한 사용자의 이메일을 저장할 변수

// 사용자 이메일 불러오기 및 로그인 상태 관리
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmail = user.email;
    console.log("로그인 성공:", userEmail);
  } else {
    userEmail = null;
    console.log("로그인 상태가 아닙니다.");
  }
});

// 댓글을 로드하는 함수 (movieID 필터 추가)
async function loadComments() {
  const params = new URLSearchParams(window.location.search);
  const movieID = params.get("movie"); // URL에서 movieID 불러오기
  const q = query(collection(firestoreDB, "review"), where("movieID", "==", movieID)); // movieID로 쿼리 생성
  const querySnapshot = await getDocs(q); // 필터링된 댓글 로드
  console.log(movieID);

  const commentList = $(".comment_list_wrap ul");
  commentList.empty();

  querySnapshot.forEach((doc) => {
    const data = doc.data();
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
          </li>`;
    commentList.append(commentItem);
  });

  attachCommentButtonListeners();
}

// 댓글 추가 시 movieID 포함
$(document).ready(function () {
  loadComments(); // 페이지 로드 시 댓글 불러오기

  $("#commentSubmit").click(async function (event) {
    event.preventDefault();
    let content = $("#commentInput").val();
    // 현재 시간을 'YYYY-MM-DD HH:mm' 형식으로 변환
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    let day = String(now.getDate()).padStart(2, "0");
    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let timestamp = `${year}-${month}-${day} ${hours}:${minutes}`; // 원하는 형식으로 조합

    const params = new URLSearchParams(window.location.search);
    const movieID = params.get("movie"); // URL에서 movieID 불러오기

    if (userEmail) {
      await addDoc(collection(firestoreDB, "review"), {
        content: content,
        userEmail: userEmail,
        timestamp: timestamp,
        movieID: movieID // 댓글에 movieID 추가
      });
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
  if (confirmDelete && userEmail) {
    const commentRef = doc(firestoreDB, "review", commentId);
    await deleteDoc(commentRef);
    loadComments(); // 댓글 새로고침
  } else {
    alert("로그인 후 이용해주세요");
  }
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

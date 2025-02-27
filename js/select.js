const selectButton = document.querySelector(".selectbutton");
const selectOptions = document.querySelectorAll(".optionitem");

// 클릭한 옵션의 텍스트를 selectbutton 안에 넣음
const handleSelect = function (item) {
  selectButton.innerHTML = item.textContent;
  selectButton.parentNode.classList.remove("active");
};
// 옵션 클릭시 클릭한 옵션을 넘김
selectOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    handleSelect(option);
  });
});
// selectbutton을 클릭시 옵션 목록이 열림/닫힘
selectButton.addEventListener("click", function () {
  if (selectButton.parentNode.classList.contains("active")) {
    selectButton.parentNode.classList.remove("active");
  } else {
    selectButton.parentNode.classList.add("active");
  }
});

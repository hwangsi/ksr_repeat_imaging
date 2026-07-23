/* ============================================================
   사이트 동작 스크립트 — 화면에 보이는 글은 모두 index.html에 있습니다.
   이 파일은 메뉴·탭·모달의 "동작"만 담당하므로 보통 수정할 일이 없습니다.
   ============================================================ */

// ── 부드러운 스크롤 이동 (data-goto="섹션 id" 버튼) ──
document.querySelectorAll("[data-goto]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    closeMenu();
    var target = document.getElementById(btn.getAttribute("data-goto"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ── 모바일 메뉴 열기/닫기 ──
var menuButton = document.querySelector(".menu-button");
var nav = document.querySelector(".nav");
function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", function () {
  var open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open ? "true" : "false");
});

// ── 독자별 탭 & 자료 필터 (두 곳의 버튼을 함께 동기화) ──
var allAudienceButtons = document.querySelectorAll(".audience-tabs button, .report-filters button");
function setAudience(audience) {
  allAudienceButtons.forEach(function (b) {
    var on = b.getAttribute("data-audience") === audience;
    b.classList.toggle("active", on);
    if (b.getAttribute("role") === "tab") b.setAttribute("aria-selected", on ? "true" : "false");
  });
  // 독자별 메시지 카드 전환
  document.querySelectorAll(".message-card").forEach(function (card) {
    card.hidden = card.getAttribute("data-audience") !== audience;
  });
  // 자료 카드 필터링 + 번호·개수 갱신
  var visible = 0;
  document.querySelectorAll(".report-card").forEach(function (card) {
    var show = audience === "모두" || card.getAttribute("data-audiences").split(" ").indexOf(audience) !== -1;
    card.hidden = !show;
    if (show) {
      visible += 1;
      card.querySelector(".report-index").textContent = String(visible).padStart(2, "0");
    }
  });
  document.getElementById("report-count").textContent = visible;
}
allAudienceButtons.forEach(function (btn) {
  btn.addEventListener("click", function () { setAudience(btn.getAttribute("data-audience")); });
});

// ── 상세 모달 열기/닫기 ──
var openModal = null;
function show(modal) {
  openModal = modal;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  var close = modal.querySelector(".modal-close");
  if (close) close.focus();
}
function hide() {
  if (!openModal) return;
  openModal.hidden = true;
  openModal = null;
  document.body.style.overflow = "";
}
document.querySelectorAll("[data-modal]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var modal = document.getElementById(btn.getAttribute("data-modal"));
    if (modal) show(modal);
  });
});
document.querySelectorAll(".modal-backdrop").forEach(function (backdrop) {
  backdrop.addEventListener("mousedown", function (e) {
    if (e.target === backdrop) hide();
  });
  backdrop.querySelectorAll(".modal-close, .modal-done").forEach(function (btn) {
    btn.addEventListener("click", hide);
  });
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") hide();
});

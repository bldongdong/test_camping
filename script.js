const camps = [
  {
    id: "seorak",
    name: "설악산 별빛-캠핑장",
    region: "강원",
    image: "assets/camp01.svg",
    price: "80,000원/박",
    hours: "체크인 15:00 / 체크아웃 11:00",
    facilities: "와이파이, 전기, 샤워장",
    description: "설악산 전망과 산책로를 즐길 수 있는 편안한 오토캠핑장입니다.",
    tags: ["전망", "숲속"],
    rating: "4.8",
    location: "강원 속초",
    reservationSlots: 4,
  },
  {
    id: "sunrise",
    name: "해돋이 오션캠프",
    region: "전라",
    image: "assets/camp02.svg",
    price: "95,000원/박",
    hours: "체크인 14:00 / 체크아웃 11:00",
    facilities: "바베큐장, 화장실, 전기",
    description: "해변 산책과 일몰 감상에 최적화된 바다 캠핑장입니다.",
    tags: ["바다", "감성"],
    rating: "4.7",
    location: "전라 여수",
    reservationSlots: 3,
  },
  {
    id: "greenlake",
    name: "초록호수 캠핑장",
    region: "충청",
    image: "assets/camp03.svg",
    price: "70,000원/박",
    hours: "체크인 13:00 / 체크아웃 12:00",
    facilities: "수영장, 화장실, 취사장",
    description: "호수 위 풍경과 여유로운 가족 여행에 적합합니다.",
    tags: ["호수", "가족"],
    rating: "4.6",
    location: "충청 청주",
    reservationSlots: 5,
  },
  {
    id: "horizon",
    name: "하늘전망 힐링캠프",
    region: "경상",
    image: "assets/camp04.svg",
    price: "85,000원/박",
    hours: "체크인 15:00 / 체크아웃 11:00",
    facilities: "전기, 와이파이, 개별 테이블",
    description: "산과 바다를 동시에 즐길 수 있는 개방감 있는 캠핑장입니다.",
    tags: ["전망", "가족"],
    rating: "4.9",
    location: "경상 부산",
    reservationSlots: 4,
  },
  {
    id: "jeju-dream",
    name: "제주 별빛야영장",
    region: "제주",
    image: "assets/camp05.svg",
    price: "110,000원/박",
    hours: "체크인 15:00 / 체크아웃 10:00",
    facilities: "야외수영장, 샤워장, 전기",
    description: "제주의 맑은 밤하늘과 감성적인 야경을 즐길 수 있습니다.",
    tags: ["바다", "전망"],
    rating: "5.0",
    location: "제주 애월",
    reservationSlots: 2,
  },
  {
    id: "forest-glow",
    name: "포레스트 글로우",
    region: "강원",
    image: "assets/camp06.svg",
    price: "75,000원/박",
    hours: "체크인 14:00 / 체크아웃 11:00",
    facilities: "화장실, 취사장, 와이파이",
    description: "조용한 숲 속에서 힐링 캠핑을 즐기고 싶은 분께 추천합니다.",
    tags: ["숲속", "조용"],
    rating: "4.7",
    location: "강원 평창",
    reservationSlots: 6,
  },
];

const recommendationResult = document.getElementById("recommendation-result");
const campGrid = document.getElementById("camp-grid");
const regionButtons = document.querySelectorAll(".region-btn");
const regionDetail = document.getElementById("region-detail");
const reservationForm = document.getElementById("reservation-form");
const reservationSite = document.getElementById("reservation-site");
const reservationDate = document.getElementById("reservation-date");
const reservationGuests = document.getElementById("reservation-guests");
const reservationSummary = document.getElementById("reservation-summary");
const quizSteps = Array.from(document.querySelectorAll(".question-block"));
const quizDots = Array.from(document.querySelectorAll(".quiz-step"));
const nextButton = document.getElementById("next-question");
const resultButton = document.getElementById("show-result");
const choiceButtons = Array.from(document.querySelectorAll(".choice-btn"));

let selectedRegion = "전국";
let selectedCampId = camps[0].id;
let currentStep = 0;
const answers = [];
const storageKey = "camp-booking-data";

function getBookings() {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : {};
}

function saveBookings(bookings) {
  localStorage.setItem(storageKey, JSON.stringify(bookings));
}

function renderCampCards() {
  const filtered = selectedRegion === "전국" ? camps : camps.filter((camp) => camp.region === selectedRegion);
  campGrid.innerHTML = filtered
    .map(
      (camp) => `
        <article class="camp-card">
          <img src="${camp.image}" alt="${camp.name}" />
          <div class="camp-body">
            <span class="tag">${camp.region} · ★ ${camp.rating}</span>
            <h3>${camp.name}</h3>
            <p>${camp.description}</p>
            <ul class="meta-list">
              <li>요금: ${camp.price}</li>
              <li>이용시간: ${camp.hours}</li>
              <li>편의시설: ${camp.facilities}</li>
            </ul>
          </div>
        </article>
      `
    )
    .join("");
}

function renderRegionDetail() {
  const target = selectedRegion === "전국" ? camps : camps.filter((camp) => camp.region === selectedRegion);
  const items = target.length ? target.map((camp) => `<li>${camp.name} · ${camp.location}</li>`).join("") : "<li>해당 지역 캠핑장이 아직 준비 중입니다.</li>";
  regionDetail.innerHTML = `
    <h3>${selectedRegion} 지역 추천 명소</h3>
    <ul class="meta-list">${items}</ul>
  `;
}

function recommendCamp(regionValue, moodValue, groupValue) {
  const candidates = regionValue === "전국" ? camps : camps.filter((camp) => camp.region === regionValue);
  const scored = candidates
    .map((camp) => {
      let score = 0;
      if (camp.tags.includes(moodValue)) score += 4;
      if (camp.tags.includes("전망") && moodValue === "전망") score += 3;
      if (groupValue === "가족" && camp.tags.includes("가족")) score += 3;
      if (groupValue === "4인" && camp.tags.includes("가족")) score += 2;
      if (groupValue === "2인" && camp.tags.includes("조용")) score += 1;
      if (groupValue === "연인" && camp.tags.includes("감성")) score += 2;
      return { camp, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best) return null;
  return best.camp;
}

function getQuizResult(quizAnswers) {
  const [moodAnswer, vibeAnswer, peopleAnswer] = quizAnswers;
  let region = "전국";
  let mood = "전망";
  let group = "2인";
  let personality = "자유로운 모험가";
  let blurb = "당신은 캠핑의 새로움을 가장 사랑하는 타입입니다.";

  if (moodAnswer === "forest") {
    region = "강원";
    mood = "숲속";
    personality = "숲의 마법사";
    blurb = "잔잔한 숲과 새벽 공기 속에서 마음을 정리하는 타입이네요.";
  } else if (moodAnswer === "sea") {
    region = "전라";
    mood = "바다";
    personality = "바다의 감성 탐험가";
    blurb = "파도 소리와 노을을 좋아하는 감성 충만한 여행자예요.";
  } else if (moodAnswer === "view") {
    region = "경상";
    mood = "전망";
    personality = "하늘을 사랑하는 여행자";
    blurb = "트렌디한 풍경과 탁 트인 전망을 가장 중요하게 생각해요.";
  } else {
    region = "제주";
    mood = "전망";
    personality = "별빛 사냥꾼";
    blurb = "밤하늘 아래서 사색하는 특별한 시간을 좋아하는 타입입니다.";
  }

  if (vibeAnswer === "cozy") {
    group = "가족";
    personality += " + 따뜻한 가족형";
    blurb += " 가족끼리 포근하게 쉬는 시간을 정말 즐기네요.";
  } else if (vibeAnswer === "photo") {
    mood = "전망";
    personality += " + 인생샷 장인";
    blurb += " 예쁜 풍경을 남기는 순간을 제일 사랑해요.";
  } else if (vibeAnswer === "quiet") {
    group = "2인";
    personality += " + 조용한 힐링러";
    blurb += " 한적한 공간에서 혼자만의 여유를 찾는 스타일이에요.";
  } else {
    group = "4인";
    personality += " + 불멍 파티러";
    blurb += " 불멍과 이야기를 즐기는 활기찬 분위기파예요.";
  }

  if (peopleAnswer === "couple") {
    group = "2인";
    personality += " + 연인형";
  } else if (peopleAnswer === "family") {
    group = "가족";
    personality += " + 가족형";
  } else if (peopleAnswer === "friends") {
    group = "4인";
    personality += " + 친구형";
  }

  return { region, mood, group, personality, blurb };
}

function renderRecommendation(result = null) {
  if (!result) {
    recommendationResult.innerHTML = "<p>아래 질문을 선택해 보세요. 당신의 캠핑 성향이 드러납니다.</p>";
    return;
  }

  const recommended = recommendCamp(result.region, result.mood, result.group);
  if (!recommended) {
    recommendationResult.innerHTML = "추천 가능한 캠핑장이 없습니다.";
    return;
  }

  recommendationResult.innerHTML = `
    <h3>${result.personality}</h3>
    <p>${result.blurb}</p>
    <p><strong>${recommended.name}</strong>가 당신의 성향과 가장 잘 어울립니다.</p>
    <p>지역: ${recommended.region} · 분위기: ${result.mood} · 인원: ${result.group}</p>
    <p>요금: ${recommended.price} / 이용시간: ${recommended.hours}</p>
  `;
}

function setActiveStep(stepIndex) {
  quizSteps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });
  quizDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === stepIndex);
  });
  nextButton.classList.toggle("hidden", stepIndex === quizSteps.length - 1);
  resultButton.classList.toggle("hidden", stepIndex !== quizSteps.length - 1);
}

function populateReservationOptions() {
  reservationSite.innerHTML = camps
    .map((camp) => `<option value="${camp.id}" ${camp.id === selectedCampId ? "selected" : ""}>${camp.name}</option>`)
    .join("");
}

function getAvailableSlots(camp) {
  const bookings = getBookings();
  const used = bookings[camp.id] || 0;
  return Math.max(0, camp.reservationSlots - used);
}

function renderReservationStatus() {
  const selectedCamp = camps.find((camp) => camp.id === reservationSite.value) || camps[0];
  selectedCampId = selectedCamp.id;
  const available = getAvailableSlots(selectedCamp);
  const now = new Date();
  reservationSummary.innerHTML = `
    <h3>${selectedCamp.name}</h3>
    <span class="status-pill">현재 시각 ${now.toLocaleTimeString("ko-KR")}</span>
    <p>실시간 예약 가능 수: <strong>${available}석</strong></p>
    <p>위치: ${selectedCamp.location}</p>
    <p>요금: ${selectedCamp.price}</p>
  `;
}

function handleReservation(e) {
  e.preventDefault();
  const selectedCamp = camps.find((camp) => camp.id === reservationSite.value) || camps[0];
  const bookings = getBookings();
  const used = bookings[selectedCamp.id] || 0;
  if (used >= selectedCamp.reservationSlots) {
    reservationSummary.innerHTML = `<h3>${selectedCamp.name}</h3><p>죄송합니다. 오늘은 예약이 마감되었습니다.</p>`;
    return;
  }

  bookings[selectedCamp.id] = used + 1;
  saveBookings(bookings);
  reservationDate.value = reservationDate.value || new Date().toISOString().slice(0, 10);
  reservationGuests.value = reservationGuests.value || 2;
  renderReservationStatus();
  reservationSummary.insertAdjacentHTML(
    "beforeend",
    `<p>예약 신청이 완료되었습니다. ${reservationDate.value} 기준 ${reservationGuests.value}명 예약이 접수됐습니다.</p>`
  );
}

regionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    regionButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedRegion = button.dataset.region;
    renderCampCards();
    renderRegionDetail();
  });
});

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const questionBlock = button.closest(".question-block");
    questionBlock.querySelectorAll(".choice-btn").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    answers[currentStep] = button.dataset.value;
  });
});

nextButton.addEventListener("click", () => {
  if (!answers[currentStep]) {
    recommendationResult.innerHTML = "<p>한 가지 선택지를 골라주세요. 그럼 닮은 캠핑장도 딱 맞게 추천해드릴게요.</p>";
    return;
  }
  currentStep = Math.min(currentStep + 1, quizSteps.length - 1);
  setActiveStep(currentStep);
});

resultButton.addEventListener("click", () => {
  if (!answers[currentStep]) {
    recommendationResult.innerHTML = "<p>마지막 질문도 하나 선택해 주세요.</p>";
    return;
  }
  const result = getQuizResult(answers);
  renderRecommendation(result);
});

reservationForm.addEventListener("submit", handleReservation);
reservationSite.addEventListener("change", renderReservationStatus);

window.addEventListener("DOMContentLoaded", () => {
  populateReservationOptions();
  reservationDate.value = new Date().toISOString().slice(0, 10);
  renderCampCards();
  renderRegionDetail();
  renderRecommendation();
  renderReservationStatus();
  setActiveStep(0);
  setInterval(renderReservationStatus, 10000);
});

const SUPABASE_URL = "https://nublnlxvmppmqkckikho.supabase.co";
const SUPABASE_KEY = "sb_publishable_N14q0E_ZdujqHHnbfOpvug_9WTnvgF-";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("login-message");

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

  if (error) {
    message.textContent = "로그인 실패: " + error.message;
    return;
  }

  message.textContent = "로그인 성공!";
  console.log(data.user);
});
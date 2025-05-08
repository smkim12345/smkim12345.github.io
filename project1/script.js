function changeImage(imgSrc, title, subtitle, description) {
    const mainImg = document.getElementById("mainImage");
    mainImg.classList.add("fade-out");
    setTimeout(() => {
        mainImg.src = imgSrc;
        mainImg.classList.remove("fade-out");
    }, 300);
    document.getElementById("awardTitle").textContent = title;
    document.getElementById("awardSubtitle").textContent = subtitle;
    document.getElementById("awardDescription").textContent = description;
}

// 페이지 로드 시 첫 번째 이미지 정보 설정
window.onload = function () {
    changeImage(
        "img/aw1.jpg",
        "레드닷 어워드 2024",
        "네오룬 콘셉트, 수송 디자인 분야 본상",
        "'수송 디자인(Cars and Motorcycles)' 분야에서 초대형 전동화 SUV '네오룬 콘셉트(NEOLUN·이하 네오룬)'로 본상을 수상했습니다. 네오룬은 '단순함 속의 아름다움'이라는 메시지를 담은 독창적인 디자인으로 고급스러움과 혁신을 동시에 강조하며 제네시스만의 미래 지향적 가치를 보여줍니다."
    );
};
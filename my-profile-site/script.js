// 모바일 메뉴 토글 기능
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// 모바일 메뉴 링크 클릭 시 메뉴 닫기
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// 데스크톱 메뉴 링크 클릭 시 부드러운 스크롤
const navLinks = document.querySelectorAll('nav a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// IntersectionObserver를 사용한 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 스크롤 애니메이션을 적용할 요소들
const animatedElements = document.querySelectorAll(
    'section h2, section > div > h3, .fade-in'
);
animatedElements.forEach(el => {
    el.classList.add('scroll-in');
    observer.observe(el);
});

// 네비게이션 버튼 색상 변경 (활성 섹션 감지)
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-blue-600', 'font-semibold');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-blue-600', 'font-semibold');
        } else {
            link.classList.add('text-slate-600');
        }
    });
});

// 페이지 로드 완료 후 hero 섹션 페이드인
window.addEventListener('load', () => {
    const hero = document.querySelector('section#about');
    if (hero) {
        hero.classList.add('fade-in');
    }
});

// 외부 링크 처리 (선택: 새 탭에서 열기)
const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="https"]');
externalLinks.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

console.log('포트폴리오 사이트 로드 완료! 🎉');

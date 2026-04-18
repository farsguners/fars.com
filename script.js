/* ===== $FARS TOKEN - Main JavaScript ===== */

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
}

// Force hide loading screen after 2.5s max
setTimeout(hideLoadingScreen, 2500);

window.addEventListener('load', () => {
  setTimeout(hideLoadingScreen, 1200);
});

// ===== 3D PARTICLE BACKGROUND (Three.js) =====
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    // Fallback: create CSS particle effect if Three.js not available
    initCSSParticles();
    return;
  }

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorRed = new THREE.Color(0xff2d55);
    const colorBlue = new THREE.Color(0x007aff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      const mixRatio = Math.random();
      const color = colorRed.clone().lerp(colorBlue, mixRatio);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Grid lines
    const gridGeometry = new THREE.BufferGeometry();
    const gridPositions = [];
    const gridSize = 30;
    const gridStep = 3;

    for (let i = -gridSize; i <= gridSize; i += gridStep) {
      gridPositions.push(-gridSize, -8, i, gridSize, -8, i);
      gridPositions.push(i, -8, -gridSize, i, -8, gridSize);
    }

    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x1a1a3a,
      transparent: true,
      opacity: 0.3,
    });
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    scene.add(grid);

    camera.position.z = 15;
    camera.position.y = 2;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 1 + 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch (e) {
    console.warn('Three.js init failed, using CSS fallback:', e);
    initCSSParticles();
  }
}

// ===== CSS PARTICLE FALLBACK =====
function initCSSParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (canvas) canvas.style.display = 'none';

  const container = document.createElement('div');
  container.className = 'css-particles';
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;';

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const isRed = Math.random() > 0.5;
    particle.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${isRed ? '#ff2d55' : '#007aff'};
      opacity:${Math.random() * 0.4 + 0.1};
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation:cssFloat ${Math.random() * 10 + 10}s linear infinite;
    `;
    container.appendChild(particle);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes cssFloat {
      0% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-20px) translateX(10px); }
      50% { transform: translateY(-10px) translateX(-10px); }
      75% { transform: translateY(-30px) translateX(5px); }
      100% { transform: translateY(0) translateX(0); }
    }
  `;
  document.head.appendChild(style);
  document.body.insertBefore(container, document.body.firstChild);
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Active link highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Use the transition-delay already set on the element
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ===== PIE CHART (CSS Conic Gradient) =====
function initPieChart() {
  const pieChart = document.querySelector('.pie-chart');
  if (!pieChart) return;

  const data = [
    { label: 'Community', value: 40, color: '#ff2d55' },
    { label: 'Liquidity', value: 20, color: '#007aff' },
    { label: 'Development', value: 15, color: '#5856d6' },
    { label: 'Marketing', value: 10, color: '#ff9500' },
    { label: 'Team', value: 10, color: '#34c759' },
    { label: 'Reserve', value: 5, color: '#af52de' },
  ];

  let gradient = '';
  let currentAngle = 0;

  data.forEach((item, index) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (item.value / 100) * 360;

    if (index > 0) gradient += ', ';
    gradient += `${item.color} ${startAngle}deg ${endAngle}deg`;

    currentAngle = endAngle;
  });

  pieChart.style.background = `conic-gradient(${gradient})`;
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initSmoothScroll();
  initPieChart();
  initCounters();

  // Delay particle init slightly to not block rendering
  setTimeout(() => {
    initParticles();
  }, 100);
});

// Smooth Scrolling using Lenis (if loaded)
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// Navbar Scroll Effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile Menu
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// GSAP Animations
if (typeof gsap !== 'undefined') {
  // Hero Animation
  const tl = gsap.timeline();
  
  if (document.querySelector('.hero-title')) {
    gsap.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1.2
    });

    tl.to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
  }

  if (document.querySelector('.products-grid')) {
    gsap.from(".product-card", {
      y: 80,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: ".products-grid"
    });
  }

  // Scroll Animations
  const animateOnScroll = document.querySelectorAll('.animate-on-scroll');
  animateOnScroll.forEach((element) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 }, 
      { 
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
        },
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: 'power3.out' 
      }
    );
  });

  // Parallax Images
  if(window.innerWidth > 768) {
    const parallaxImages = document.querySelectorAll('.category-img, .product-img');
    parallaxImages.forEach((img) => {
      gsap.to(img, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }
}

// Three.js Interactive 3D Background
function initThreeJS() {
  const canvasContainer = document.getElementById('canvas-container');
  if (!canvasContainer || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  // Create a 3D Gem / Diamond Object
  const geometry = new THREE.IcosahedronGeometry(1.6, 0);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9, // glass-like
    thickness: 1.5,
    ior: 2.4, // diamond index of refraction
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const mesh = new THREE.Mesh(geometry, material);
  
  // Add a gold wireframe inner shell for a high-end look
  const innerGeometry = new THREE.IcosahedronGeometry(1.4, 1);
  const innerMaterial = new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true, transparent: true, opacity: 0.3 });
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  mesh.add(innerMesh);

  scene.add(mesh);

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 700;
  const posArray = new Float32Array(particlesCount * 3);
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
  
  const goldLight = new THREE.PointLight(0xd4af37, 2);
  goldLight.position.set(-5, -5, 5);
  scene.add(goldLight);

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate main object
    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.002;

    // Rotate particles
    particlesMesh.rotation.y = -elapsedTime * 0.05;

    // Mouse interaction smoothing
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    
    mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
    mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initCustomCursor();
  initMagneticUX();
});

// Custom Cursor & Micro-interactions
function initCustomCursor() {
  if (window.innerWidth <= 768) return; // Skip on mobile
  
  document.body.insertAdjacentHTML('beforeend', '<div class="custom-cursor"></div>');
  const cursor = document.querySelector('.custom-cursor');
  
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out'
    });
  });

  const hoverElements = document.querySelectorAll('a, button, .category-card, .product-card, .btn');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

function initMagneticUX() {
  if (window.innerWidth <= 768) return;
  
  const magneticElements = document.querySelectorAll('.nav-link, .btn, .social-links a');
  
  magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(elem, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    
    elem.addEventListener('mouseleave', () => {
      gsap.to(elem, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

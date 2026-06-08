// Particle System
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() * 60 + 120; // Green-blue range
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    
    // Pulse opacity
    this.opacity = 0.1 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.2 + 0.2;
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];
  
  const count = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `hsla(150, 100%, 60%, ${0.08 * (1 - dist / 120)})`;
        ctx.stroke();
      }
    }
  }
  
  animationId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
  cancelAnimationFrame(animationId);
  initParticles();
  animateParticles();
});

// Progressive Night Animation
let nightProgress = 0;
const darkOverlay = document.querySelector('.dark-overlay');

function updateNightCycle() {
  const hours = new Date().getHours();
  // Simulate night progression: 0 (noon) to 1 (midnight)
  nightProgress = Math.sin((hours - 6) * Math.PI / 12) * 0.5 + 0.5;
  
  // Night overlay intensifies at night
  const nightIntensity = Math.max(0, nightProgress - 0.3) * 1.5;
  darkOverlay.style.opacity = 0.2 + nightIntensity * 0.6;
}

updateNightCycle();
setInterval(updateNightCycle, 60000); // Check every minute

// Hero title cycling animation
const titles = ['Premium Streetwear', 'Designer Pants', 'Urban Collection', 'Tech Wear', 'Luxury Fit'];
let titleIndex = 0;
const heroTitle = document.getElementById('heroTitle');

setInterval(() => {
  titleIndex = (titleIndex + 1) % titles.length;
  heroTitle.style.opacity = '0';
  heroTitle.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    heroTitle.textContent = titles[titleIndex];
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'translateY(0)';
  }, 300);
}, 4000);
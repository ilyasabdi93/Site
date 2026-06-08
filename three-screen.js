// Three.js Background Scene - Floating Clothes
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x00ff88, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0x4488ff, 0.5);
dirLight2.position.set(-5, -5, -5);
scene.add(dirLight2);

// Point light that follows camera
const pointLight = new THREE.PointLight(0x00ff88, 0.5, 20);
scene.add(pointLight);

// Create floating clothing items using geometry
function createShirt(color = 0x00ff88) {
  const group = new THREE.Group();
  
  // Body
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.4, 0.4);
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.6,
    emissive: color,
    emissiveIntensity: 0.05,
    transparent: true,
    opacity: 0.9
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Collar
  const collarGeo = new THREE.TorusGeometry(0.3, 0.08, 8, 16, Math.PI);
  const collarMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.3,
    roughness: 0.4
  });
  const collar = new THREE.Mesh(collarGeo, collarMat);
  collar.position.y = 0.75;
  collar.rotation.x = Math.PI / 2;
  group.add(collar);

  // Sleeves
  const sleeveMat = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.6,
    transparent: true,
    opacity: 0.85
  });

  const sleeveL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.4), sleeveMat);
  sleeveL.position.set(-0.85, 0.3, 0);
  sleeveL.rotation.z = -0.4;
  group.add(sleeveL);

  const sleeveR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.4), sleeveMat);
  sleeveR.position.set(0.85, 0.3, 0);
  sleeveR.rotation.z = 0.4;
  group.add(sleeveR);

  return group;
}

function createPants(color = 0x4488ff) {
  const group = new THREE.Group();
  
  const mat = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.05,
    roughness: 0.7,
    emissive: color,
    emissiveIntensity: 0.05,
    transparent: true,
    opacity: 0.9
  });

  // Waist band
  const waist = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 8, 20), mat);
  waist.position.y = 0.7;
  waist.rotation.x = Math.PI / 2;
  group.add(waist);

  // Left leg
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 1.3, 8), mat);
  legL.position.set(-0.3, -0.1, 0);
  group.add(legL);

  // Right leg
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 1.3, 8), mat);
  legR.position.set(0.3, -0.1, 0);
  group.add(legR);

  // Pockets
  const pocketMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.3
  });
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.05), pocketMat);
  pocket.position.set(0, 0.4, 0.25);
  group.add(pocket);

  return group;
}

function createHoodie(color = 0xff4488) {
  const group = new THREE.Group();
  
  const mat = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.05,
    roughness: 0.7,
    emissive: color,
    emissiveIntensity: 0.05,
    transparent: true,
    opacity: 0.9
  });

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 0.5), mat);
  body.position.y = 0.2;
  group.add(body);

  // Hood
  const hoodMat = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.05,
    roughness: 0.7,
    transparent: true,
    opacity: 0.85
  });
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), hoodMat);
  hood.position.y = 1.0;
  hood.scale.set(1.2, 0.6, 1);
  group.add(hood);

  // Front pocket
  const pocketMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.5
  });
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.05), pocketMat);
  pocket.position.set(0, 0.2, 0.3);
  group.add(pocket);

  // Drawstrings
  const stringMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
  for (let i = -1; i <= 1; i += 2) {
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4), stringMat);
    string.position.set(i * 0.15, 0.7, 0.3);
    group.add(string);
  }

  return group;
}

// Create floating items
const items = [];
const colors = [0x00ff88, 0x4488ff, 0xff4488, 0xffaa00, 0xaa44ff];
const creators = [createShirt, createPants, createHoodie];

for (let i = 0; i < 8; i++) {
  const creator = creators[Math.floor(Math.random() * creators.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const item = creator(color);
  
  item.position.set(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 10 - 3
  );
  
  item.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  
  item.userData = {
    speed: 0.2 + Math.random() * 0.3,
    rotSpeed: 0.005 + Math.random() * 0.01,
    floatPhase: Math.random() * Math.PI * 2,
    floatAmp: 0.2 + Math.random() * 0.3,
    scale: 0.8 + Math.random() * 0.6
  };
  
  item.scale.set(item.userData.scale, item.userData.scale, item.userData.scale);
  scene.add(item);
  items.push(item);
}

// Grid floor effect
const gridHelper = new THREE.GridHelper(15, 20, 0x00ff88, 0x224466);
gridHelper.position.y = -3;
gridHelper.material.opacity = 0.15;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Camera position
camera.position.z = 5;
camera.position.y = 0.5;

// Mouse tracking for parallax
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animateScene(time) {
  requestAnimationFrame(animateScene);
  
  const t = time * 0.001;
  
  // Animate items
  items.forEach((item, i) => {
    item.rotation.x += item.userData.rotSpeed * 0.5;
    item.rotation.y += item.userData.rotSpeed;
    item.position.y += Math.sin(t * item.userData.speed + item.userData.floatPhase) * 0.003;
  });
  
  // Parallax camera
  camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
  camera.position.y += (mouseY * 1 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);
  
  // Rotate grid
  gridHelper.rotation.z = Math.sin(t * 0.1) * 0.05;
  
  // Pulse point light
  pointLight.intensity = 0.3 + Math.sin(t * 0.5) * 0.2;
  pointLight.position.set(
    Math.sin(t * 0.3) * 5,
    Math.cos(t * 0.2) * 3,
    Math.sin(t * 0.4) * 5
  );
  
  renderer.render(scene, camera);
}

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animateScene(0);
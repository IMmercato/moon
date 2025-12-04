import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/+esm";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
document.body.appendChild(renderer.domElement);

const marsGroup = new THREE.Group();

// Mars
const marsGeometry = new THREE.SphereGeometry(10, 50, 50);
const marsMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.9,
    metalness: 0.1
});
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(0, 0, 0);
mars.castShadow = true;
mars.receiveShadow = true;

// Rocket
const rocketGeometry = new THREE.CylinderGeometry(0.8, 1.2, 10, 16);
const rocketMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF0000,
    roughness: 0.3,
    metalness: 0.7
});
const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
rocket.position.set(10, 10, -10);
rocket.rotation.x = Math.PI / -3;
rocket.castShadow = true;

const rocketHeadGeometry = new THREE.ConeGeometry(0.8, 3, 16);
const rocketHeadMaterial = new THREE.MeshStandardMaterial({
    color: 0x00FF00,
    roughness: 0.4,
    metalness: 0.6
});
const rocketHead = new THREE.Mesh(rocketHeadGeometry, rocketHeadMaterial);
rocketHead.position.y = 6.5;
rocket.add(rocketHead);

const rocketFinGeometry = new THREE.BoxGeometry(0.2, 3, 2);
const rocketFinMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    roughness: 0.4,
    metalness: 0.6
});

for (let i = 0; i < 3; i++) {
    const rocketFin = new THREE.Mesh(rocketFinGeometry, rocketFinMaterial);
    const angle = (i * Math.PI * 2) / 3;
    rocketFin.position.x = Math.cos(angle) * 1;
    rocketFin.position.z = Math.sin(angle) * 1;
    rocketFin.position.y = -4;
    rocketFin.rotation.y = angle;
    rocket.add(rocketFin);
}

function placeOnSurface(obejct, lat, lon, height) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(10 + height) * Math.sin(phi) * Math.cos(theta);
    const y = (10 + height) * Math.cos(phi);
    const z = (10 + height) * Math.sin(phi) * Math.sin(theta);
    obejct.position.set(x, y, z);
    obejct.lookAt(x * 2, y * 2, z * 2);
}

// Quadruped
const quadruped = new THREE.Group();

const bodyGeometry = new THREE.BoxGeometry(3, 1, 2);
const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
quadruped.add(body);

const legMaterial = new THREE.MeshStandardMaterial({
    color: 0xFCCB02,
    roughness: 0.3,
    metalness: 0.7
});

const legPositions = [
    [1, -0.8, 1],
    [1, -0.8, -1],
    [-1, -0.8, 1],
    [-1, -0.8, -1]
];

legPositions.forEach(pos => {
    const legUpper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1, 8),
        legMaterial
    );
    legUpper.position.set(pos[0], pos[1], pos[2]);

    const legLower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 1, 8),
        legMaterial
    );
    legLower.position.set(pos[0], pos[1] - 0.8, pos[2]);

    quadruped.add(legUpper);
    quadruped.add(legLower);
});


// Speedy


placeOnSurface(rocket, 30, 45, 5);
placeOnSurface(quadruped, -20, 100, 0);

const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFDE59, 1.0);
directionalLight.position.set(50, 50, -10);
directionalLight.target = mars;
scene.add(directionalLight);

camera.position.set(0, 50, 50);
camera.lookAt(0, 0, 0);

marsGroup.add(mars);
marsGroup.add(rocket);
marsGroup.add(quadruped);
scene.add(marsGroup);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseOverMoon = false;
let mouseOverQuadruped = false;

let targetCameraPos = { x: 0, y: 50, z: 50 };
let currentCameraPos = { x: 0, y: 50, z: 50 };
let targetMarsScale = 1.0;

renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(mars);

    mouseOverMoon = intersects.length > 0;
    mouseOverQuadruped = intersects.length > 0;

    if (mouseOverMoon) {
        targetMarsScale = 1.2;
        targetCameraPos = { x: 0, y: 20, z: 20 };
    } else {
        targetMarsScale = 1.0;
        targetCameraPos = { x: 0, y: 50, z: 50 };
    }
})


function animate() {
    requestAnimationFrame(animate);
    currentCameraPos.x += (targetCameraPos.x - currentCameraPos.x) * 0.05;
    currentCameraPos.y += (targetCameraPos.y - currentCameraPos.y) * 0.05;
    currentCameraPos.z += (targetCameraPos.z - currentCameraPos.z) * 0.05;
    camera.position.set(currentCameraPos.x, currentCameraPos.y, currentCameraPos.z);
    camera.lookAt(0, 0, 0);
    marsGroup.scale.x += (targetMarsScale - marsGroup.scale.x) * 0.05;
    marsGroup.scale.y += (targetMarsScale - marsGroup.scale.y) * 0.05;
    marsGroup.scale.z += (targetMarsScale - marsGroup.scale.z) * 0.05;
    marsGroup.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
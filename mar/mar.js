import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/+esm";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
document.body.appendChild(renderer.domElement);

const marsGroup = new THREE.Group();

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

const rocketGeometry = new THREE.CylinderGeometry(1, 1, 10);
const rocketMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
rocket.position.set(10, 10, -10);
rocket.rotation.x = Math.PI / -3;

const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFDE59, 1.0);
directionalLight.position.set(50, 50, -10);
directionalLight.target = mars;
scene.add(directionalLight);

camera.position.set(0, 50, 50);
camera.lookAt(0, 0, 0);

marsGroup.add(rocket);
marsGroup.add(mars);
scene.add(marsGroup);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseOverMoon = false;

let targetCameraPos = { x: 0, y: 50, z: 50 };
let currentCameraPos = { x: 0, y: 50, z: 50 };
let targetMarsScale = 1.0;

renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(mars);

    mouseOverMoon = intersects.length > 0;

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
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/+esm";

const roverInfo = {
    quadruped: {
        title: "Quadruped Rover",
        description: "A four-legged autonomous rover designed for comples Martian terrain navigation.",
        specs: [
            { label: "Type", value: "Quadruped Walker" },
            { label: "Legs", value: "4 Articulated Legs" },
            { label: "Terrain", value: "Rocky & Steep Surface" },
            { label: "Sensors", value: "Stereo Vision Cameras" },
            { label: "Power", value: "Solar + Battery Hybrid" },
            { label: "Speed", value: "0.5 m/s Average" }
        ],
        features: [
            "Advanced stability control for uneven terrain",
            "Independent leg movement for obstacle traversal",
            "Real-time environment mapping",
            "Autonomous navigation system",
        ]
    },
    speedy: {
        title: "Speedy Rover",
        description: "A wheeled high-speed rover optimized for fast exploration and sample collection across Martian plains.",
        specs: [
            { label: "Type", value: "Wheeled Explorer" },
            { label: "Wheels", value: "6 Independent Wheels" },
            { label: "Terrain", value: "Plains & Flat Surfaces" },
            { label: "Sensors", value: "Multi-Spectral Cameras" },
            { label: "Power", value: "Solar Panel Array" }
        ],
        features: [
            "High-speed long-distance traversal",
            "Sample collection arm system",
            "GPS and inertial navigation"
        ]
    },
    mar: {
        title: "M.A.R. Project",
        description: "Our mission is to make 2 rovers which can work toghether and explore the Martain Surface",
        content: `
            <h3>Mission Objectives</h3>
            <ul>
                <li>Map unexplored regions of Mars</li>
                <li>Collect geological samples</li>
                <li>Study Martian climate patterns</li>
                <li>Search for signs of past water</li>
                <li>Test autonomous navigation systems</li>
            </ul>
            <h3>Project Timeline</h3>
            <p>Phase 1: Design and prototyping (Current)<br>
            Phase 2: Testing in Mars-like environments<br>
            Phase 3: Mission deployment planning</p>
        `
    }
};

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x222222, 50, 200);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a1a);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();

const earthGeometry = new THREE.SphereGeometry();
const earthTexture = new THREE.TextureLoader().load(
    '/img/8k_earth_daymap.jpg',
    () => { renderer.render(scene, camera); },
    undefined,
    (err) => { console.error('Error loading texture', err); }
);
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.9,
    metalness: 0.1
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(20, 0, 0);


const marsGroup = new THREE.Group();

// Mars
const marsGeometry = new THREE.SphereGeometry(10, 64, 64);
const marsTexture = new THREE.TextureLoader().load(
    '/img/8k_mars.jpg',
    () => { renderer.render(scene, camera); },
    undefined,
    (err) => { console.error('Error loading texture', err); }
);
const marsMaterial = new THREE.MeshStandardMaterial({
    map: marsTexture,
    roughness: 0.9,
    metalness: 0.1
});
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(0, 0, 0);
mars.castShadow = true;
mars.receiveShadow = true;


function placeOnSurface(object, lat, lon, height = 0) {
    // lat/lan convertion to radians
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const radius = 10 + height;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    object.position.set(x, y, z);

    const normal = new THREE.Vector3(x, y, z).normalize();
    object.up.copy(normal);
    const tangent = new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta)).normalize();
    object.lookAt(object.position.clone().add(tangent));
}


// Rocket
const rocketGroup = new THREE.Group();

const rocketGeometry = new THREE.CylinderGeometry(0.8, 1.2, 10, 16);
const rocketMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF0000,
    roughness: 0.3,
    metalness: 0.7
});
const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
rocket.castShadow = true;
rocketGroup.add(rocket);

const rocketHeadGeometry = new THREE.ConeGeometry(0.8, 3, 16);
const rocketHeadMaterial = new THREE.MeshStandardMaterial({
    color: 0x30FF30,
    roughness: 0.4,
    metalness: 0.6
});
const rocketHead = new THREE.Mesh(rocketHeadGeometry, rocketHeadMaterial);
rocketHead.position.y = 6.5;
rocketGroup.add(rocketHead);

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
    rocketGroup.add(rocketFin);
}

rocketGroup.position.set(10, 10, -10);
rocketGroup.rotation.x = Math.PI / -3;


// Quadruped
const quadruped = new THREE.Group();

const bodyGeometry = new THREE.BoxGeometry(3, 1, 2);
const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFF00,
    roughness: 0.3,
    metalness: 0.7,
    flatShading: false
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 0.4;
quadruped.add(body);

const mastGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.4);
const mast = new THREE.Mesh(mastGeometry, bodyMaterial);
mast.position.set(0.8, 0.6, 0);
quadruped.add(mast);

const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00FFFF,
    emissive: 0x00FFFF,
    emissiveIntensity: 0.5
});
const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
eyeLeft.position.set(2.2, 0.3, 0.3);
quadruped.add(eyeLeft);
const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
eyeRight.position.set(2.2, 0.3, -0.3);
quadruped.add(eyeRight);

const legMaterial = new THREE.MeshStandardMaterial({
    color: 0xFCCB02,
    roughness: 0.3,
    metalness: 0.7
});

quadruped.legParts = [];

const legPositions = [
    [1, -0.8, 1],
    [1, -0.8, -1],
    [-1, -0.8, 1],
    [-1, -0.8, -1]
];

legPositions.forEach(pos => {
    const legGroup = new THREE.Group();

    const legUpper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1, 8),
        legMaterial
    );
    legUpper.position.set(0, 0, 0);
    legGroup.add(legUpper);

    const legLower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 1, 8),
        legMaterial
    );
    legLower.position.set(0, -1, 0);
    legGroup.add(legLower);

    const paw = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        legMaterial
    );
    paw.position.set(0, -1.8, 0);
    legGroup.add(paw);

    legGroup.position.set(pos[0], pos[1], pos[2]);
    quadruped.add(legGroup);
    quadruped.legParts.push(legGroup);
});


// Speedy
const speedy = new THREE.Group();

const roverBodyGeometry = new THREE.BoxGeometry(2.5, 1, 1.5);
const roverBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x3399FF,
    roughness: 0.5,
    metalness: 0.5
});
const roverBody = new THREE.Mesh(roverBodyGeometry, roverBodyMaterial);
roverBody.position.y = 0.8;
roverBody.castShadow = true;
speedy.add(roverBody);

const panelGeometry = new THREE.BoxGeometry(3, 0.1, 2.5);
const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a3a,
    roughness: 0.2,
    metalness: 0.8,
});
const panel = new THREE.Mesh(panelGeometry, panelMaterial);
panel.position.y = 1.5;
speedy.add(panel);

const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.9,
    metalness: 0.1
});
speedy.wheels = [];

const spokeGeometry = new THREE.BoxGeometry(1, 0.25, 0.05);
const spokeMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    roughness: 0.5,
    metalness: 0.7
});

const wheelPosition = [
    [1, 0.4, 1],
    [1, 0.4, -1],
    [-1, 0.4, 1],
    [-1, 0.4, -1],
    [0, 0.4, 1],
    [0, 0.4, -1]
];

wheelPosition.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.rotation.x = Math.PI / 2;
    for (let i = 0; i < 5; i++) {
        const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
        const angle = (i / 5) * Math.PI * 2;
        spoke.position.set(Math.sin(angle) * 0.2, 0, Math.cos(angle) * 0.02);
        spoke.rotation.y = angle;
        wheel.add(spoke);
    }
    speedy.add(wheel);
    speedy.wheels.push(wheel);
});

const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
const antennaMaterial = new THREE.MeshStandardMaterial({
    color: 0xCCCCCC,
    roughness: 0.3,
    metalness: 0.7
});
const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
antenna.position.set(0, 2, 0);
speedy.add(antenna);

const antennaBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16),
    antennaMaterial
);
antennaBall.position.set(0, 2.7, 0);
speedy.add(antennaBall);


const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.5,
    sizeAttenuation: true
});
const starsVertices = [];
for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 400;
    const y = (Math.random() - 0.5) * 400;
    const z = (Math.random() - 0.5) * 400;
    starsVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


placeOnSurface(quadruped, 0, 60, 0.5);
placeOnSurface(speedy, 100, 30, 0);


// Lighting
const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFDE59, 1.0);
directionalLight.position.set(50, 50, -10);
directionalLight.target = mars;
scene.add(directionalLight);

const fillLight = new THREE.DirectionalLight(0x8899FF, 0.3);
fillLight.position.set(-30, 20, 30);
scene.add(fillLight);

camera.position.set(0, 50, 50);
camera.lookAt(0, 0, 0);

marsGroup.add(mars);
marsGroup.add(quadruped);
marsGroup.add(speedy);
scene.add(rocketGroup);
scene.add(marsGroup);
scene.add(earth);


const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoBody = document.getElementById('info-body');
const loadingScreen = document.getElementById('loading-screen');
const closeInfo = document.getElementById('close-btn')

function showInfo(type) {
    const info = roverInfo[type];
    if (!info) return;

    infoTitle.textContent = info.title;
    let content = `<p>${info.description}</p>`;

    if (info.specs) {
        content += `<h3>Specifications</h3>`;
        info.specs.forEach(spec => {
            content += `<div class="spec-item"><span class="spec-label">${spec.label}:</span><span class="spec-value">${spec.value}</span></div>`;
        });
    }

    if (info.features) {
        content += `<h3>Key Features</h3><ul>`;
        info.features.forEach(feature => {
            content += `<li>${feature}</li>`;
        });
        content += `</ul>`;
    }

    if (info.content) {
        content += info.content;
    }

    infoBody.innerHTML = content;
    infoPanel.classList.add('active');
}

function hideInfo() {
    infoPanel.classList.remove('active');
}


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let zoomTarget = null;
let mouseOverEarth = false;
let mouseOverMars = false;
let mouseOverQuadruped = false;
let mouseOverSpeedy = false;

let targetCameraPos = { x: 0, y: 50, z: 50 };
let currentCameraPos = { x: 0, y: 50, z: 50 };
let targetLookAt = { x: 0, y: 0, z: 0 };
let currentLookAt = { x: 0, y: 0, z: 0 };
let targetZoomScale = 1.0;
let isAnimatingMars = true;

let quadrupedWalkCycle = 0;
const quadrupedWalkSpeed = 0.1;

let speedyWheelRotation = 0;
const speedyWheelSpeed = 0.15;


document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);

    document.getElementById('home').addEventListener('click', (e) => {
        e.preventDefault();
        zoomTarget = null;
        hideInfo();
    });
    document.getElementById('zoom-mars').addEventListener('click', (e) => {
        e.preventDefault();
        const newTarget = zoomTarget === 'mars' ? null : 'mars';
        zoomTarget = newTarget;
        if (newTarget) {
            showInfo('mars');
        } else {
            hideInfo();
        }
        isAnimatingMars = zoomTarget === null || zoomTarget === 'mars';
    });
    document.getElementById('zoom-quadruped').addEventListener('click', (e) => {
        e.preventDefault();
        const newTarget = zoomTarget === 'quadruped' ? null : 'quadruped';
        zoomTarget = newTarget;
        if (newTarget) {
            showInfo('quadruped');
        }
        else {
            hideInfo();
        }
        isAnimatingMars = zoomTarget === null;
    });
    document.getElementById('zoom-speedy').addEventListener('click', (e) => {
        e.preventDefault();
        const newTarget = zoomTarget === 'speedy' ? null : 'speedy';
        zoomTarget = newTarget;
        if (newTarget) {
            showInfo('speedy');
        }
        else {
            hideInfo();
        }
        isAnimatingMars = zoomTarget === null;
    });

    if (closeInfo) {
        closeInfo.addEventListener('click', hideInfo);
    }
});

renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (!zoomTarget) {
        const marsIntersects = raycaster.intersectObject(mars, false);
        const quadrupedIntersects = raycaster.intersectObject(quadruped, true);
        const speedyIntersects = raycaster.intersectObject(speedy, true);

        mouseOverMars = marsIntersects.length > 0;
        mouseOverQuadruped = quadrupedIntersects.length > 0;
        mouseOverSpeedy = speedyIntersects.length > 0;

        if (mouseOverMars) {
            targetZoomScale = 1.2;
            targetCameraPos = { x: 0, y: 20, z: 20 };
            targetLookAt = { x: 0, y: 0, z: 0 };
        } else if (mouseOverQuadruped) {
            const pos = quadruped.position;
            targetCameraPos = { x: pos.x + 5, y: pos.y + 6, z: pos.z + 5 };
            targetZoomScale = 1.2;
            targetLookAt = { x: pos.x, y: pos.y, z: pos.z };
        } else if (mouseOverSpeedy) {
            const pos = speedy.position;
            targetCameraPos = { x: pos.x + 5, y: pos.y + 6, z: pos.z + 5 };
            targetZoomScale = 1.2;
            targetLookAt = { x: pos.x, y: pos.y, z: pos.z };
        } else {
            targetZoomScale = 1.0;
            targetCameraPos = { x: 0, y: 50, z: 50 };
            targetLookAt = { x: 0, y: 0, z: 0 };
        }
    }
});


function animate() {
    requestAnimationFrame(animate);
    if (zoomTarget === 'mars') {
        targetZoomScale = { x: 0, y: 20, z: 20 };
        targetZoomScale = 1.2;
        targetLookAt = { x: 0, y: 0, z: 0 };
    } else if (zoomTarget === 'quadruped') {
        const pos = quadruped.getWorldPosition(new THREE.Vector3());
        const offset = new THREE.Vector3(5, 5, 5);
        targetCameraPos = { x: pos.x + offset.x, y: pos.y + offset.y, z: pos.z + offset.z };
        targetZoomScale = 1.0;
        targetLookAt = { x: pos.x, y: pos.y, z: pos.z };
    } else if (zoomTarget === 'speedy') {
        const pos = speedy.getWorldPosition(new THREE.Vector3());
        const offset = new THREE.Vector3(5, 5, 5);
        targetCameraPos = { x: pos.x + offset.x, y: pos.y + offset.y, z: pos.z + offset.z };
        targetZoomScale = 1.0;
        targetLookAt = { x: pos.x, y: pos.y, z: pos.z };
    }

    currentCameraPos.x += (targetCameraPos.x - currentCameraPos.x) * 0.05;
    currentCameraPos.y += (targetCameraPos.y - currentCameraPos.y) * 0.05;
    currentCameraPos.z += (targetCameraPos.z - currentCameraPos.z) * 0.05;
    camera.position.set(currentCameraPos.x, currentCameraPos.y, currentCameraPos.z);

    if (zoomTarget === 'quadruped') {
        camera.lookAt(quadruped.position);
    } else if (zoomTarget === 'speedy') {
        camera.lookAt(speedy.position);
    } else {
        camera.lookAt(0, 0, 0);
    }

    marsGroup.scale.x += (targetZoomScale - marsGroup.scale.x) * 0.05;
    marsGroup.scale.y += (targetZoomScale - marsGroup.scale.y) * 0.05;
    marsGroup.scale.z += (targetZoomScale - marsGroup.scale.z) * 0.05;
    if (isAnimatingMars) {
        marsGroup.rotation.y += 0.001;
    }
    earth.rotation.y += 0.005;


    quadrupedWalkCycle += quadrupedWalkSpeed;
    if (quadruped.legParts) {
        quadruped.legParts.forEach((legGroup, index) => {
            const legOffset = index * Math.PI / 2;
            const legLift = Math.sin(quadrupedWalkCycle + legOffset) * 0.3;
            legGroup.position.y = -0.8 + legLift;
            if (legGroup.children[0]) {
                legGroup.children[0].rotation.x = legLift * 0.5;
            }
        });
    }

    speedyWheelRotation += speedyWheelSpeed;
    if (speedy.wheels) {
        speedy.wheels.forEach(wheel => {
            wheel.rotation.y = speedyWheelRotation;
        });
    }

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
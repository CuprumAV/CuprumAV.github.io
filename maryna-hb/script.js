// Global variables
let scene, camera, renderer, table, cake, candles = [], photos = [];
let balloons = [], confetti = [];
let currentScene = 1;
let candlesBlown = 0;
let animationId;
let cameraStartTime, zoomStartTime;
let cameraRotating = true, cameraZooming = false;
let controls; // OrbitControls для керування камерою мишкою
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Gallery variables
let galleryScene, galleryCamera, galleryRenderer, galleryControls;
let currentPhotoIndex = 0;
let galleryPhotos = [];
let touchStartX = 0;
let touchEndX = 0;

// Scene 1: Typing Effect
const typingText = "Привіт люба, сьогодні твій день народження, тож я зробив цей сайт для тебе";
const typingElement = document.getElementById('typingText');
const nextBtn = document.getElementById('nextBtn');
let charIndex = 0;

function typeWriter() {
    if (charIndex < typingText.length) {
        typingElement.textContent += typingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 80);
    } else {
        // Show next button with animation
        setTimeout(() => {
            nextBtn.classList.remove('hidden');
        }, 500);
    }
}

// Start typing when page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 1000);
});

// Next button click
nextBtn.addEventListener('click', () => {
    document.getElementById('scene1').classList.remove('active');
    setTimeout(() => {
        document.getElementById('scene2').classList.add('active');
        initScene2();
    }, 1000);
});

// Scene 2: 3D Celebration
function initScene2() {
    const canvas = document.getElementById('celebrationCanvas');

    cameraStartTime = Date.now();

    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 1, 0);

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Setup OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // Відключаємо спочатку для автоматичної анімації
    controls.target.set(0, 1, 0); // Фокусуємося на столі
    controls.enableDamping = true; // Плавність руху
    controls.dampingFactor = 0.05;
    controls.minDistance = 3; // Мінімальна відстань від столу
    controls.maxDistance = 12; // Максимальна відстань від столу
    controls.minPolarAngle = 0.5; // Обмеження кута зверху
    controls.maxPolarAngle = Math.PI / 2.1; // Не можна зайти під стіл

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 1, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create table
    createTable();

    // Create cake
    createCake();

    // Create photo frames
    createPhotoFrames();

    // Create balloons
    createBalloons();

    // Create confetti
    createConfetti();

    // Show instruction after balloons animation
    setTimeout(() => {
        document.getElementById('blowCandlesInstruction').classList.remove('hidden');
        // Зупиняємо обертання через 2 секунди і починаємо наближення
        setTimeout(() => {
            cameraRotating = false;
            cameraZooming = true;
            zoomStartTime = Date.now();
        }, 2000);
    }, 3000);

    // Mouse click handler for candles
    canvas.addEventListener('click', onCanvasClick);

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function createTable() {
    // Table top
    const tableTopGeometry = new THREE.BoxGeometry(4, 0.1, 3);
    const tableTopMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.7
    });
    table = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    table.position.set(0, 1, 0);
    table.castShadow = true;
    table.receiveShadow = true;
    scene.add(table);

    // Table legs
    const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });

    const positions = [
        [-1.8, 0.5, -1.3],
        [1.8, 0.5, -1.3],
        [-1.8, 0.5, 1.3],
        [1.8, 0.5, 1.3]
    ];

    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        scene.add(leg);
    });
}

function createCake() {
    // Cake base layers
    const layers = [
        { radius: 0.8, height: 0.3, y: 1.15, color: 0xffe4e1 },
        { radius: 0.6, height: 0.25, y: 1.45, color: 0xffb6c1 },
        { radius: 0.4, height: 0.2, y: 1.7, color: 0xff69b4 }
    ];

    layers.forEach(layer => {
        const geometry = new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 32);
        const material = new THREE.MeshStandardMaterial({
            color: layer.color,
            roughness: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, layer.y, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    });

    // Candles
    const candlePositions = [
        [0, 0], [-0.15, 0], [0.15, 0],
        [-0.1, 0.15], [0.1, 0.15],
        [-0.1, -0.15], [0.1, -0.15]
    ];

    candlePositions.forEach(([x, z]) => {
        createCandle(x, z);
    });
}

function createCandle(x, z) {
    const candleGroup = new THREE.Group();

    // Candle body
    const bodyGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xfff8dc });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    candleGroup.add(body);

    // Flame
    const flameGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.9
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.y = 0.17;
    flame.scale.y = 1.5;
    candleGroup.add(flame);

    // Flame light
    const flameLight = new THREE.PointLight(0xff6600, 0.5, 2);
    flameLight.position.y = 0.17;
    candleGroup.add(flameLight);

    candleGroup.position.set(x, 1.95, z);
    candleGroup.userData = { lit: true, flame, flameLight };

    scene.add(candleGroup);
    candles.push(candleGroup);
}

function createPhotoFrames() {
    const framePositions = [
        [-1.5, 1.2, -0.8, Math.PI / 6, 'photos/photo1.jpg'],
        [1.5, 1.2, -0.8, -Math.PI / 6, 'photos/photo2.jpg'],
        [-1.5, 1.2, 0.8, Math.PI / 8, 'photos/photo3.jpg'],
        [1.5, 1.2, 0.8, -Math.PI / 8, 'photos/photo4.jpg'],
        [0, 1.2, 0, 0, 'photos/photo5.jpg']
    ];

    const textureLoader = new THREE.TextureLoader();

    framePositions.forEach(([x, y, z, rotation, photoPath]) => {
        // Frame border - збільшено розмір
        const frameGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.03);
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);

        // Photo with real image - квадратне фото без обрізання
        const photoGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.01);
        const photoTexture = textureLoader.load(
            photoPath,
            // onLoad callback (коли фото завантажилось)
            function(texture) {
                console.log('Фото завантажено:', photoPath);
                // Зберігаємо пропорції фото
                const img = texture.image;
                if (img && img.width && img.height) {
                    const aspect = img.width / img.height;
                    if (aspect > 1) {
                        // Горизонтальне фото
                        photo.scale.y = 1 / aspect;
                    } else {
                        // Вертикальне фото
                        photo.scale.x = aspect;
                    }
                }
            },
            // onProgress callback
            undefined,
            // onError callback (якщо фото не знайдено, використовуємо плейсхолдер)
            function(error) {
                console.log('Фото не знайдено, використовую плейсхолдер:', photoPath);
                photo.material.color.set(0xffd700);
                photo.material.emissive.set(0xffd700);
                photo.material.emissiveIntensity = 0.2;
            }
        );

        const photoMaterial = new THREE.MeshStandardMaterial({
            map: photoTexture,
            emissive: 0xffffff,
            emissiveIntensity: 0.1
        });
        const photo = new THREE.Mesh(photoGeometry, photoMaterial);
        photo.position.z = 0.02;

        frame.add(photo);
        frame.position.set(x, y, z);
        frame.rotation.y = rotation;
        frame.castShadow = true;

        scene.add(frame);
        photos.push(frame);
    });
}

function createBalloons() {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

    for (let i = 0; i < 15; i++) {
        const balloonGroup = new THREE.Group();

        // Balloon body
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        geometry.scale(1, 1.2, 1);
        const material = new THREE.MeshStandardMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            roughness: 0.3,
            metalness: 0.1
        });
        const balloon = new THREE.Mesh(geometry, material);
        balloon.castShadow = true;
        balloonGroup.add(balloon);

        // String
        const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 8);
        const stringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.y = -0.7;
        balloonGroup.add(string);

        // Random position
        const angle = (i / 15) * Math.PI * 2;
        const radius = 5 + Math.random() * 3;
        balloonGroup.position.set(
            Math.cos(angle) * radius,
            -2 + Math.random() * 2,
            Math.sin(angle) * radius
        );

        balloonGroup.userData = {
            initialY: balloonGroup.position.y,
            speed: 0.5 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2
        };

        scene.add(balloonGroup);
        balloons.push(balloonGroup);
    }
}

function createConfetti() {
    for (let i = 0; i < 200; i++) {
        const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.01);
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        const piece = new THREE.Mesh(geometry, material);

        piece.position.set(
            (Math.random() - 0.5) * 20,
            10 + Math.random() * 10,
            (Math.random() - 0.5) * 20
        );

        piece.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        piece.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                -0.05 - Math.random() * 0.05,
                (Math.random() - 0.5) * 0.1
            ),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            )
        };

        scene.add(piece);
        confetti.push(piece);
    }
}

function onCanvasClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    candles.forEach(candle => {
        if (!candle.userData.lit) return;

        const intersects = raycaster.intersectObject(candle, true);
        if (intersects.length > 0) {
            blowCandle(candle);
        }
    });
}

function blowCandle(candle) {
    if (!candle.userData.lit) return;

    candle.userData.lit = false;
    candle.userData.flame.visible = false;
    candle.userData.flameLight.visible = false;

    // Create smoke effect
    const smokeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const smokeMaterial = new THREE.MeshBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.5
    });
    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smoke.position.copy(candle.position);
    smoke.position.y += 0.17;
    scene.add(smoke);

    // Animate smoke
    let smokeY = smoke.position.y;
    const smokeInterval = setInterval(() => {
        smokeY += 0.02;
        smoke.position.y = smokeY;
        smoke.material.opacity -= 0.02;
        smoke.scale.multiplyScalar(1.05);

        if (smoke.material.opacity <= 0) {
            scene.remove(smoke);
            clearInterval(smokeInterval);
        }
    }, 30);

    candlesBlown++;

    // Check if all candles are blown
    if (candlesBlown === candles.length) {
        setTimeout(showCelebrationMessage, 2000);
    }
}

function showCelebrationMessage() {
    // Приховуємо інструкцію
    document.getElementById('blowCandlesInstruction').classList.add('hidden');

    // АКТИВУЄМО OrbitControls після задмухування всіх свічок
    if (controls) {
        controls.enabled = true;
        console.log('OrbitControls активовані після задмухування свічок');
    }

    // Створюємо меседж на сцені 2
    const messageDiv = document.createElement('div');
    messageDiv.id = 'celebrationMessage';
    messageDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 3rem;
        text-align: center;
        background: rgba(255, 105, 180, 0.9);
        padding: 40px 60px;
        border-radius: 30px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        z-index: 200;
        animation: messageAppear 1s ease-out;
        max-width: 80%;
        line-height: 1.4;
    `;

    document.getElementById('scene2').appendChild(messageDiv);

    // Додаємо CSS анімацію
    if (!document.getElementById('messageStyle')) {
        const style = document.createElement('style');
        style.id = 'messageStyle';
        style.textContent = `
            @keyframes messageAppear {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                }
            }
            
            @keyframes messageDisappear {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5) rotate(10deg);
                }
            }
            
            @keyframes sparkles {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.2); }
            }
            
            .sparkle {
                position: absolute;
                font-size: 2rem;
                animation: sparkles 1.5s ease-in-out infinite;
                pointer-events: none;
            }
            
            @media (max-width: 768px) {
                #celebrationMessage {
                    font-size: 1.8rem !important;
                    padding: 25px 35px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Анімація тексту
    const finalText = "З днем народження, Марина! Бажаю тобі всього найкращого! 🎉💖";
    let index = 0;

    function typeFinal() {
        if (index < finalText.length) {
            messageDiv.textContent += finalText.charAt(index);
            index++;
            setTimeout(typeFinal, 60);
        } else {
            // Додаємо блискітки навколо меседжу
            createSparkles(messageDiv);

            // Через 5 секунд після завершення тексту - прибираємо меседж і показуємо галерею
            setTimeout(() => {
                messageDiv.style.animation = 'messageDisappear 1s ease-out forwards';
                setTimeout(() => {
                    messageDiv.remove();
                    // Зупиняємо створення блискіток
                    clearInterval(sparkleInterval);

                    // Переходимо до Scene 3 з кнопкою галереї
                    document.getElementById('scene2').classList.remove('active');
                    setTimeout(() => {
                        document.getElementById('scene3').classList.add('active');
                        showGalleryButton();
                    }, 500);
                }, 1000);
            }, 5000);
        }
    }

    setTimeout(typeFinal, 300);
}

// Show gallery button on Scene 3
function showGalleryButton() {
    const galleryBtn = document.getElementById('galleryBtn');
    if (galleryBtn) {
        setTimeout(() => {
            galleryBtn.classList.remove('hidden');
        }, 1000);
    }
}

let sparkleInterval;

function createSparkles(parentElement) {
    const sparkleChars = ['✨', '⭐', '💫', '🌟'];

    sparkleInterval = setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
        sparkle.style.left = (Math.random() * 100) + '%';
        sparkle.style.top = (Math.random() * 100) + '%';
        sparkle.style.animationDelay = (Math.random() * 0.5) + 's';

        parentElement.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 3000);
    }, 200);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    // Animate balloons floating up
    balloons.forEach((balloon, index) => {
        balloon.position.y += balloon.userData.speed * 0.02;
        balloon.position.x += Math.sin(Date.now() * 0.001 + balloon.userData.floatOffset) * 0.01;
        balloon.rotation.y += 0.01;

        // Reset if too high
        if (balloon.position.y > 15) {
            balloon.position.y = -2;
        }
    });

    // Animate confetti falling
    confetti.forEach(piece => {
        piece.position.add(piece.userData.velocity);
        piece.rotation.x += piece.userData.rotationSpeed.x;
        piece.rotation.y += piece.userData.rotationSpeed.y;
        piece.rotation.z += piece.userData.rotationSpeed.z;

        // Reset if fallen too low
        if (piece.position.y < -1) {
            piece.position.y = 10 + Math.random() * 5;
            piece.position.x = (Math.random() - 0.5) * 20;
            piece.position.z = (Math.random() - 0.5) * 20;
        }
    });

    // Animate candle flames
    candles.forEach(candle => {
        if (candle.userData.lit && candle.userData.flame) {
            const flame = candle.userData.flame;
            flame.scale.x = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            flame.scale.z = 1 + Math.cos(Date.now() * 0.01) * 0.1;
        }
    });

    // Camera animation
    if (cameraRotating) {
        // Обертання камери перші 5 секунд
        camera.position.x = Math.sin(Date.now() * 0.0003) * 8;
        camera.position.z = Math.cos(Date.now() * 0.0003) * 8;
        camera.lookAt(0, 1, 0);
    } else if (cameraZooming) {
        // Плавне наближення до столу
        const elapsed = (Date.now() - zoomStartTime) / 1000;
        const duration = 2; // 2 секунди для наближення
        const progress = Math.min(elapsed / duration, 1);

        // Easing function для плавності
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Інтерполяція позиції камери (з 8 до 4 по z, з 3 до 2 по y)
        camera.position.x = 0;
        camera.position.y = 3 - (3 - 2) * easeProgress;
        camera.position.z = 8 - (8 - 4) * easeProgress;

        camera.lookAt(0, 1, 0);

        if (progress >= 1) {
            cameraZooming = false;
            // НЕ активуємо OrbitControls одразу - тільки після задмухування свічок

            // Показуємо підказку про можливість обертання
            setTimeout(() => {
                const rotateHint = document.createElement('div');
                rotateHint.id = 'rotateHint';

                // Різні підказки для мобільних та десктоп
                if (isMobile) {
                    rotateHint.textContent = '👆 Проведи пальцем, щоб оглянути фотографії!';
                } else {
                    rotateHint.textContent = '🖱️ Крути мишкою, щоб оглянути фотографії!';
                }

                rotateHint.style.cssText = `
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: white;
                    font-size: 1.2rem;
                    background: rgba(0, 0, 0, 0.7);
                    padding: 15px 30px;
                    border-radius: 25px;
                    z-index: 100;
                    animation: fadeInOut 4s ease-in-out;
                    pointer-events: none;
                    max-width: 90%;
                    text-align: center;
                `;
                document.getElementById('scene2').appendChild(rotateHint);

                // Прибираємо підказку через 4 секунди
                setTimeout(() => {
                    rotateHint.remove();
                }, 4000);
            }, 500);
        }
    }

    // Оновлюємо controls якщо вони активовані
    if (controls) {
        controls.update();
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (galleryRenderer && galleryCamera) {
        galleryCamera.aspect = window.innerWidth / window.innerHeight;
        galleryCamera.updateProjectionMatrix();
        galleryRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Scene 3: Final Message with Gallery Button
document.addEventListener('DOMContentLoaded', () => {
    const galleryBtn = document.getElementById('galleryBtn');

    if (galleryBtn) {
        galleryBtn.addEventListener('click', () => {
            document.getElementById('scene3').classList.remove('active');
            setTimeout(() => {
                document.getElementById('scene4').classList.add('active');
                initGallery();
            }, 500);
        });
    }
});

// Scene 4: Photo Gallery
function initGallery() {
    const container = document.getElementById('gallery3D');

    // Setup gallery scene
    galleryScene = new THREE.Scene();
    galleryScene.background = new THREE.Color(0x0f0c29);

    // Setup gallery camera
    galleryCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    galleryCamera.position.set(0, 0, 5);

    // Setup gallery renderer
    galleryRenderer = new THREE.WebGLRenderer({ antialias: true });
    galleryRenderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(galleryRenderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    galleryScene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 10, 10);
    galleryScene.add(spotLight);

    // Create photo displays
    createGalleryPhotos();

    // Setup controls
    const prevBtn = document.getElementById('prevPhoto');
    const nextBtn = document.getElementById('nextPhoto');
    const closeBtn = document.getElementById('closeGallery');

    prevBtn.addEventListener('click', () => showPreviousPhoto());
    nextBtn.addEventListener('click', () => showNextPhoto());
    closeBtn.addEventListener('click', closeGallery);

    // Touch support for mobile
    const canvas = galleryRenderer.domElement;
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchend', handleTouchEnd, false);

    // Show mobile hint if on mobile
    if (isMobile) {
        setTimeout(() => {
            const hint = document.getElementById('mobileGalleryHint');
            hint.classList.remove('hidden');
            setTimeout(() => {
                hint.classList.add('hidden');
            }, 4000);
        }, 500);
    }

    // Start gallery animation
    animateGallery();
}

function createGalleryPhotos() {
    const photoUrls = [
        'photos/photo1.jpg',
        'photos/photo2.jpg',
        'photos/photo3.jpg',
        'photos/photo4.jpg',
        'photos/photo5.jpg'
    ];

    const textureLoader = new THREE.TextureLoader();

    photoUrls.forEach((url, index) => {
        // Create photo frame
        const frameGroup = new THREE.Group();

        // Photo plane
        const photoGeometry = new THREE.PlaneGeometry(4, 4);
        const photoTexture = textureLoader.load(
            url,
            (texture) => {
                const img = texture.image;
                if (img && img.width && img.height) {
                    const aspect = img.width / img.height;
                    if (aspect > 1) {
                        photoMesh.scale.y = 1 / aspect;
                    } else {
                        photoMesh.scale.x = aspect;
                    }
                }
            },
            undefined,
            () => {
                // Fallback to colored plane
                photoMesh.material.color.set(0x667eea);
            }
        );

        const photoMaterial = new THREE.MeshStandardMaterial({
            map: photoTexture,
            side: THREE.DoubleSide
        });
        const photoMesh = new THREE.Mesh(photoGeometry, photoMaterial);

        // Frame border
        const borderGeometry = new THREE.PlaneGeometry(4.3, 4.3);
        const borderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.z = -0.01;

        frameGroup.add(border);
        frameGroup.add(photoMesh);

        // Position photos in a circle
        const angle = (index / photoUrls.length) * Math.PI * 2;
        frameGroup.position.x = Math.cos(angle) * 8;
        frameGroup.position.z = Math.sin(angle) * 8;
        frameGroup.rotation.y = -angle;

        frameGroup.userData = { index };

        galleryScene.add(frameGroup);
        galleryPhotos.push(frameGroup);
    });

    updatePhotoCounter();
}

function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
    rotateGalleryTo(currentPhotoIndex);
}

function showPreviousPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    rotateGalleryTo(currentPhotoIndex);
}

function rotateGalleryTo(index) {
    const targetAngle = -(index / galleryPhotos.length) * Math.PI * 2;

    // Smooth rotation animation
    const startRotation = galleryScene.rotation.y;
    const startTime = Date.now();
    const duration = 800; // ms

    function animateRotation() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        galleryScene.rotation.y = startRotation + (targetAngle - startRotation) * easeProgress;

        if (progress < 1) {
            requestAnimationFrame(animateRotation);
        }
    }

    animateRotation();
    updatePhotoCounter();
}

function updatePhotoCounter() {
    const counter = document.getElementById('photoCounter');
    counter.textContent = `${currentPhotoIndex + 1} / ${galleryPhotos.length}`;
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next photo
            showNextPhoto();
        } else {
            // Swipe right - previous photo
            showPreviousPhoto();
        }
    }
}

function closeGallery() {
    document.getElementById('scene4').classList.remove('active');

    // Cleanup
    if (galleryRenderer) {
        galleryRenderer.domElement.remove();
        galleryRenderer.dispose();
        galleryRenderer = null;
    }

    galleryPhotos = [];
    currentPhotoIndex = 0;
}

function animateGallery() {
    if (!document.getElementById('scene4').classList.contains('active')) return;

    requestAnimationFrame(animateGallery);

    // Subtle floating animation for photos
    galleryPhotos.forEach((photo, index) => {
        const offset = Date.now() * 0.001 + index;
        photo.position.y = Math.sin(offset) * 0.1;
    });

    if (galleryRenderer && galleryCamera) {
        galleryRenderer.render(galleryScene, galleryCamera);
    }
}
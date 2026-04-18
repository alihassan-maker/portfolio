document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Hero Animations on Load
    setTimeout(() => {
        const fadeUps = document.querySelectorAll('.fade-up');
        fadeUps.forEach(element => {
            element.classList.add('visible');
        });
    }, 100);

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 5, 5, 0.95)';
                navLinks.style.padding = '2rem 0';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.zIndex = '1001';
            }
        });
    }

    // Form Submission with Web3Forms
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });
                
                const result = await response.json();
                if (response.status == 200) {
                    btn.textContent = 'Message Sent!';
                    btn.style.background = '#27c93f';
                    btn.style.color = '#fff';
                    btn.style.opacity = '1';
                    form.reset();
                } else {
                    console.log(response);
                    btn.textContent = 'Error Sending';
                    btn.style.background = '#ff3366';
                }
            } catch (error) {
                console.log(error);
                btn.textContent = 'Error Sending';
                btn.style.background = '#ff3366';
            }
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.opacity = '1';
            }, 3000);
        });
    }

    // --- THREE.JS BACKGROUND INITIALIZATION ---
    initThreeJSBackground();
});

function initThreeJSBackground() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js is not loaded.');
        return;
    }

    const container = document.getElementById('bg-canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    // Accent colors from CSS
    const color1 = new THREE.Color('#ff3366'); // pink
    const color2 = new THREE.Color('#7c3aed'); // purple
    const color3 = new THREE.Color('#0ea5e9'); // blue

    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Random positions in a sphere-like spread
        posArray[i] = (Math.random() - 0.5) * 100;
        posArray[i+1] = (Math.random() - 0.5) * 100;
        posArray[i+2] = (Math.random() - 0.5) * 100;

        // Randomly assign one of the accent colors
        const randomColorChoice = Math.random();
        let chosenColor = color1;
        if(randomColorChoice > 0.66) chosenColor = color2;
        else if (randomColorChoice > 0.33) chosenColor = color3;

        colorsArray[i] = chosenColor.r;
        colorsArray[i+1] = chosenColor.g;
        colorsArray[i+2] = chosenColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Particle material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create a 3D Wireframe shape for the center
    const geometry = new THREE.IcosahedronGeometry(12, 1);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x7c3aed, 
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const shapeMesh = new THREE.Mesh(geometry, material);
    scene.add(shapeMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Rotate particles slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Rotate center shape
        shapeMesh.rotation.y = elapsedTime * 0.1;
        shapeMesh.rotation.x = elapsedTime * 0.1;

        // Mouse Parallax effect
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
        
        // Slight camera movement based on mouse
        camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

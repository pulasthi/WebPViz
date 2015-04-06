if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer, particles, geometry, material, i, h, color, sprite, size;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = (window.innerHeight - 51) / 2;

function init() {
    container = document.getElementById('viz-container');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / (window.innerHeight - 51), 2, 2000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    geometry = new THREE.Geometry();

    sprite = THREE.ImageUtils.loadTexture("/assets/textures/sprites/disc.png");

    for (i = 0; i < 10000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = 2000 * Math.random() - 1000;
        vertex.y = 2000 * Math.random() - 1000;
        vertex.z = 2000 * Math.random() - 1000;

        geometry.vertices.push(vertex);
    }

    material = new THREE.PointCloudMaterial({
        size: 35,
        sizeAttenuation: false,
        map: sprite,
        alphaTest: 0.5,
        transparent: true
    });
    material.color.setHSL(1.0, 0.3, 0.7);

    particles = new THREE.PointCloud(geometry, material);
    scene.add(particles);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, (window.innerHeight - 51));
    container.appendChild(renderer.domElement);

    stats = new Stats();
    document.getElementById('webgl-stats').appendChild(stats.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = (window.innerHeight - 51) / 2;

    camera.aspect = window.innerWidth / (window.innerHeight - 51);
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, (window.innerHeight - 51));
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
    if (event.touches.length == 1) {
        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

//

function animate() {
    requestAnimationFrame(animate);

    render();
    stats.update();
}

function render() {
    var time = Date.now() * 0.00005;

    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( -mouseY - camera.position.y ) * 0.05;

    camera.lookAt(scene.position);

    h = ( 351 * ( 1.0 + time ) % 351 ) / 351;
    material.color.setHSL(h, 0.5, 0.5);

    renderer.render(scene, camera);
}

function visualize(id){
    init();
    animate();
}
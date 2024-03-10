import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Group
const group = new THREE.Group();
scene.add(group);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/navosMatcap.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
let text1;
let text2;
let text3;
let text4;
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Material
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // Text
  const textGeometry = new TextGeometry("N", {
    font: font,
    size: 0.5,
    height: 0.05,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  text1 = new THREE.Mesh(textGeometry, material);
  text2 = new THREE.Mesh(textGeometry, material);
  text3 = new THREE.Mesh(textGeometry, material);
  text4 = new THREE.Mesh(textGeometry, material);

  text2.position.x = 0.17;
  text2.position.z = -0.17;
  text2.rotation.y = Math.PI * 0.5;

  text3.position.x = -0.17;
  text3.position.z = -0.17;
  text3.rotation.y = Math.PI * -0.5;

  text4.position.z = -0.34;
  text4.rotation.y = Math.PI * 1;

  group.add(text1, text2, text3, text4);

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
  const delayInterval = 0.25;

  tl.to(text1.position, { duration: 1, delay: delayInterval, z: 0.5 }, 0);
  tl.to(text2.position, { duration: 1, delay: delayInterval, x: 0.5 }, 0);
  tl.to(text3.position, { duration: 1, delay: delayInterval, x: -0.5 }, 0);
  tl.to(text4.position, { duration: 1, delay: delayInterval, z: -0.84 }, 0);

  tl.to(group.rotation, { duration: 1, delay: delayInterval, y: 6.29 }, 1.5);

  tl.to(text1.position, { duration: 1, delay: delayInterval, z: 0 }, 2);
  tl.to(
    text2.position,
    { duration: 1, delay: delayInterval, x: 0.17, z: -0.17 },
    2
  );
  tl.to(
    text3.position,
    { duration: 1, delay: delayInterval, x: -0.17, z: -0.17 },
    2
  );
  tl.to(text4.position, { duration: 1, delay: delayInterval, z: -0.34 }, 2);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();


const tick = () => {
  const elapsedTime = clock.getElapsedTime();


  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

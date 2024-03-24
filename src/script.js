import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Group
//Create group so all N's can be moved simultaneously
const group = new THREE.Group();
scene.add(group);

/**
 * Textures
 */

//Instantiate a TextureLoader instance
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(
  "textures/matcaps/navosMatcap.png",
  () => {
    console.log("loading finished");
  },
  () => {
    console.log("loading progressing");
  },
  () => {
    console.log("loading error");
  }
);
//Matcap properties of a material need to be encoded in sRGB colorSpace
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
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture }); //Using MeshMatcapMaterial for it's great performance

  // Text
  const textGeometry = new TextGeometry("N", {
    font: font,
    size: 0.5,
    height: 0.05,
    curveSegments: 12, //reduce as low poly as possible
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5, //reduce as low poly as possible
  });
  //Centre the text
  textGeometry.center();

  text1 = new THREE.Mesh(textGeometry, material);
  text2 = new THREE.Mesh(textGeometry, material);
  text3 = new THREE.Mesh(textGeometry, material);
  text4 = new THREE.Mesh(textGeometry, material);

  //Position N's so they begin as a square
  text2.position.x = 0.17;
  text2.position.z = -0.17;
  text2.rotation.y = Math.PI * 0.5; //90 degrees to the left

  text3.position.x = -0.17;
  text3.position.z = -0.17;
  text3.rotation.y = Math.PI * -0.5; //90 degrees to the right

  text4.position.z = -0.34;
  text4.rotation.y = Math.PI * 1; //180 degrees so reversed 

  group.add(text1, text2, text3, text4);

  //Create GSAP timeline to act as a container
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
  const delayInterval = 0.25;

  //Setting up tweens for the N's
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

  // click handlers for controlling the tween instance
  document.querySelector("#play").onclick = () => tl.play();
  document.querySelector("#pause").onclick = () => tl.pause();
  document.querySelector("#resume").onclick = () => tl.resume();
  document.querySelector("#reverse").onclick = () => tl.reverse();
  document.querySelector("#restart").onclick = () => tl.restart();
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Handles window resizing
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

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // GSAP function to update animation automatically
  window.requestAnimationFrame(tick);
};

tick();

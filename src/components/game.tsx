import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const createCube = () => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, specular: 0x555555, shininess: 30 });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
};
const createFloor = () => {
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  floor.receiveShadow = true;
  return floor;
};

const setupScene = () => {
  const scene = new THREE.Scene();
  const cube = createCube();
  const floor = createFloor();

  scene.add(cube);
  scene.add(floor);

  return { scene, cube };
};

const setupLight = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // soft white light
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(3, 10, 2);
  light.castShadow = true;
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;

  scene.add(light);
};

const setupControls = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, moveSpeed: number) => {
  const controls = new PointerLockControls(camera, renderer.domElement);
  const keys = { w: false, a: false, s: false, d: false };

  document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW':
        keys.w = true;
        break;
      case 'KeyA':
        keys.a = true;
        break;
      case 'KeyS':
        keys.s = true;
        break;
      case 'KeyD':
        keys.d = true;
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyW':
        keys.w = false;
        break;
      case 'KeyA':
        keys.a = false;
        break;
      case 'KeyS':
        keys.s = false;
        break;
      case 'KeyD':
        keys.d = false;
        break;
    }
  });

  return { controls, keys };
};


export const Game: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows in the renderer
    ref.current.appendChild(renderer.domElement);
    camera.position.z = 5;

    const { scene } = setupScene();
    setupLight(scene); // Setup the light with shadows

    const moveSpeed = 0.1;
    const { controls: pointerLockControls, keys } = setupControls(camera, renderer, moveSpeed); // Update here

    scene.add(pointerLockControls.getObject());
    ref.current.addEventListener('click', () => {
      pointerLockControls.lock(); // Update here
    });

    const animate = () => {
      if (keys.w) pointerLockControls.moveForward(moveSpeed);
      if (keys.s) pointerLockControls.moveForward(-moveSpeed);
      if (keys.a) pointerLockControls.moveRight(-moveSpeed);
      if (keys.d) pointerLockControls.moveRight(moveSpeed);

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={ref} />;
};

export default Game;

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const createCube = () => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  // cube.receiveShadow = true;
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
  light.position.set(0, 10, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;

  scene.add(light);
};

const setupControls = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, moveSpeed: number) => {
  const controls = new PointerLockControls(camera, renderer.domElement);
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyW') controls.moveForward(moveSpeed);
    if (event.code === 'KeyS') controls.moveForward(-moveSpeed);
    if (event.code === 'KeyA') controls.moveRight(-moveSpeed);
    if (event.code === 'KeyD') controls.moveRight(moveSpeed);
  });
  return controls;
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
    const controls = setupControls(camera, renderer, moveSpeed);

    scene.add(controls.getObject());
    ref.current.addEventListener('click', () => {
      controls.lock();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={ref} />;
};

export default Game;

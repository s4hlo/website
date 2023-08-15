import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const setupScene = () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  return { scene, cube };
};

const setupFloor = (scene: THREE.Scene) => {
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -5;
  scene.add(floor);
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
    ref.current.appendChild(renderer.domElement);
    camera.position.z = 5;

    const { scene } = setupScene();
    setupFloor(scene);

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

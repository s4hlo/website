import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const Game: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    scene.add(floor);


    const moveSpeed = 0.1;

    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyW') camera.position.z -= moveSpeed; // Forward
      if (event.code === 'KeyS') camera.position.z += moveSpeed; // Backward
      if (event.code === 'KeyA') camera.position.x -= moveSpeed; // Left
      if (event.code === 'KeyD') camera.position.x += moveSpeed; // Right
    });

    document.addEventListener('mousemove', (event) => {
      camera.rotation.y -= event.movementX * 0.002;
      camera.rotation.x -= event.movementY * 0.002;
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
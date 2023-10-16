import * as THREE from 'three';

function main() {
  const canvas = document.querySelector('#c');
  console.log(canvas);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });

  const sizes = {
    width: 600,
    height: 600,
  };

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  scene.add(camera);

  // Object
  const geom = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 'red',
  });
  const mesh = new THREE.Mesh(geom, material);
  scene.add(mesh);

  // Setup
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
}

main();

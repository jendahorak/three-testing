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

function earthSystem() {
  const sizes = {
    width: 600,
    height: 600,
  };
  const canvas = document.querySelector('#c');
  console.log(canvas);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  scene.add(camera);

  const objects = [];

  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);

  sunMesh.scale.set(5, 5, 5); // make the sun large

  // Setup
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
}

main();

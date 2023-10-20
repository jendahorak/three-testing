// import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// let camera, scene, renderer;

// class App {
//   init() {
//     camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
//     camera.position.z = 4;

//     scene = new Scene();

//     const geometry = new BoxGeometry();
//     const material = new MeshBasicMaterial();

//     const mesh = new Mesh(geometry, material);
//     scene.add(mesh);

//     const canvas = document.querySelector('#c');
//     renderer = new WebGLRenderer({ antialias: true, canvas });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//     window.addEventListener('resize', onWindowResize, false);

//     const controls = new OrbitControls(camera, renderer.domElement);

//     animate();
//   }
// }

// function onWindowResize() {
//   const canvas = document.querySelector('#c');
//   camera.aspect = canvas.clientWidth / canvas.clientHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
// }

// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }

// const app = new App();
// app.init();

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();
  controls.enableDamping = true;

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  makeInstance(geometry, 0x44aa88, 0);
  makeInstance(geometry, 0x8844aa, -2);
  makeInstance(geometry, 0xaa8844, 2);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  let renderRequested = false;

  function render() {
    renderRequested = false;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
  }
  render();

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }

  // controls.addEventListener('change', render);
  controls.addEventListener('change', requestRenderIfNotRequested);
  // window.addEventListener('resize', render);
  window.addEventListener('resize', requestRenderIfNotRequested);
}

main();

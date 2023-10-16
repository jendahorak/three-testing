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
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });

  // CAMERA
  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  // SCENE
  const scene = new THREE.Scene();

  // LIGHT
  {
    const color = 0xffffff;
    const intensity = 500;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  // OBJECTS

  // an array of objects who's rotation to update
  const objects = [];

  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xff0000 });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5);
  scene.add(sunMesh);
  objects.push(sunMesh);

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

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      obj.rotation.y = time;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

earthSystem();

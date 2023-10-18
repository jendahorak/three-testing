import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import { MinMaxGUIHelper } from '../../utils/mimMaxGUIHelper';
import checkerImg from '/checker.png';

function init() {
  const view1Elem = document.querySelector('#view1');
  const view2Elem = document.querySelector('#view2');

  // RENDERER
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });

  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    // return the aspect
    return width / height;
  }

  // SCENE
  const scene = new THREE.Scene();

  // POINT LIGHT
  {
    const color = 0xffffff;
    const intensity = 150;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 10, 0);
    scene.add(light);
  }

  // Ambient Light
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }

  // CAMERA
  // const fov = 45;
  // const aspect = 2; // the canvas default
  // const near = 0.1;
  // const far = 100;
  // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.set(0, 10, 20);

  const left = -1;
  const right = 1;
  const top = 1;
  const bottom = -1;
  const onear = 1;
  const ofar = 50;
  const ocamera = new THREE.OrthographicCamera(left, right, top, bottom, onear, ofar);
  ocamera.zoom = 0.2;

  const cameraHelper = new THREE.CameraHelper(ocamera);
  scene.add(cameraHelper);

  // ORBIT CONTROLS
  const controls = new OrbitControls(ocamera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  // -- second orbit controls
  const camera2 = new THREE.PerspectiveCamera(
    60, // fov
    2, // aspect
    0.1, // near
    500, // far
  );

  camera2.position.set(0, 50, 30);
  camera2.lookAt(0, 100, 100);

  const controls2 = new OrbitControls(camera2, view2Elem);
  controls2.target.set(0, 5, 0);
  controls2.update();

  // GUI
  const gui = new GUI();

  gui.add(ocamera, 'zoom', 0.01, 1, 0.01).listen();
  // gui.add(camera, 'fov', 1, 100);
  // const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  // gui.add(minMaxGUIHelper, 'min', 0.1, 100, 0.1).name('near');
  // gui.add(minMaxGUIHelper, 'max', 0.1, 100, 0.1).name('far');

  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const numSpheres = 10;
    for (let i = 0; i < numSpheres; ++i) {
      const sphereMat = new THREE.MeshPhongMaterial();
      sphereMat.color.setHSL(i * 0.73, 1, 0.5);
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, i * sphereRadius * -2.2);
      scene.add(mesh);
    }
  }

  // PLANE
  {
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load(checkerImg);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

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

    resizeRendererToDisplaySize(renderer);
    renderer.setScissorTest(true);

    // the original view
    {
      const aspect = setScissorForElement(canvas);
      ocamera.left = -aspect;
      ocamera.right = aspect;
      ocamera.updateProjectionMatrix();
      cameraHelper.update();

      cameraHelper.visible = false;

      renderer.render(scene, ocamera);
    }

    // render from the 2nd camera
    {
      const aspect = setScissorForElement(view2Elem);

      // adjust the camera for this aspect
      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();

      // draw the camera helper in the 2nd view
      cameraHelper.visible = true;

      // scene.background.set(0x000040);

      renderer.render(scene, camera2);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

init();

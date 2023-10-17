import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  // INIT GUI
  const gui = new GUI();

  // CAMERA
  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  // SCENE
  const scene = new THREE.Scene();

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  // PLANE
  {
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    // Then you can place the asset in a special public directory under your project root. Assets in this directory will be served at root path / during dev, and copied to the root of the dist directory as-is.
    const texture = loader.load('/checker.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  // CUBe
  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);

    const cubeMatParams = {
      cubeMeshColor: mesh.material.color.getHex(),
    };

    const cubeMeshFolder = gui.addFolder('Cube Folder');

    cubeMeshFolder.addColor(cubeMatParams, 'cubeMeshColor').onChange((val) => {
      // console.log('meshVal', val);
      // console.log('cubeMeshColor', cubeMatParams.cubeMeshColor);
      mesh.material.color.set(val);
    });
  }

  // SPHERE
  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }

  // function addLightToGUI(gui, scene, light, name, colors) {
  //   const lightFolder = gui.addFolder(name);
  //   lightFolder.add(light, 'intensity', 0, 1).name('Light Intensity');
  //   lightFolder.addColor(colors, 'skyColor').onChange((val) => light.color.set(val));
  //   if (colors.groundColor) {
  //     lightFolder.addColor(colors, 'groundColor').onChange((val) => light.groundColor.set(val));
  //   }
  //   scene.add(light);
  // }

  // // Ambient Light
  // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // addLightToGUI(gui, scene, ambientLight, 'Ambient Light', { : ambientLight.color });

  // // Hemisphere Light
  // const hemisphereLightColors = {
  //   skyColor: 0xb1e1ff, // light blue
  //   groundColor: 0xb97a20, // brownish orange
  // };
  // const hemisphereLight = new THREE.HemisphereLight(hemisphereLightColors.skyColor, hemisphereLightColors.groundColor, 1);
  // addLightToGUI(gui, scene, hemisphereLight, 'Hemisphere Light', hemisphereLightColors);

  const lightingFolder = gui.addFolder('Lighting Folder');

  // Ambient Light
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    lightingFolder.add(light, 'intensity', 0, 1).name('Light Intesity');
    lightingFolder.addColor({ alColor: light.color.getHex() }, 'alColor').onChange((val) => light.color.set(val));
  }

  // TODO - abstract the functionality of adding stuff to the gui to the function

  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    lightingFolder.add(light, 'intensity', 0, 1).name('Light Intesity');
    lightingFolder.addColor({ skyColor: light.color.getHex() }, 'skyColor').onChange((val) => {
      light.color.set(val);
    });
    lightingFolder.addColor({ groundColor: light.groundColor.getHex() }, 'groundColor').onChange((val) => {
      light.groundColor.set(val);
    });
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

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

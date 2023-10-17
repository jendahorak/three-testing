import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import checkerImg from '/checker.png';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  RectAreaLightUniformsLib.init();
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

  // CUBe
  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
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
    const sphereMat = new THREE.MeshStandardMaterial({ color: '#CA8' });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }

  const lightingFolder = gui.addFolder('Lighting Folder');

  // Ambient Light
  // {
  //   const color = 0xffffff;
  //   const intensity = 1;
  //   const light = new THREE.AmbientLight(color, intensity);
  //   scene.add(light);

  //   lightingFolder.add(light, 'intensity', 0, 1).name('Light Intesity');
  //   lightingFolder.addColor({ alColor: light.color.getHex() }, 'alColor').onChange((val) => light.color.set(val));
  // }

  // // TODO - abstract the functionality of adding stuff to the gui to the function
  // Hemisphere light
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

  // // Directional Light
  // {
  //   const color = 0xffffff;
  //   const intensity = 2;
  //   const light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(10, 0, -10);
  //   light.target.position.set(0, 5, 0);
  //   scene.add(light);
  //   scene.add(light.target);

  //   lightingFolder.addColor({ directionalColor: light.color.getHex() }, 'directionalColor').onChange((val) => {
  //     light.color.set(val);
  //   });

  //   const helper = new THREE.DirectionalLightHelper(light);
  //   scene.add(helper);

  //   function updateLight() {
  //     light.target.updateMatrixWorld();
  //     helper.update();
  //   }

  //   function makeXYZGUI(gui, vector3, name, onChangeFn) {
  //     const folder = gui.addFolder(name);
  //     folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  //     folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  //     folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  //     folder.open();
  //   }

  //   makeXYZGUI(gui, light.position, 'position', updateLight);
  //   makeXYZGUI(gui, light.target.position, 'target', updateLight);
  // }
  // Point Light
  const pointLightFolder = gui.addFolder('Point Light');

  {
    const color = 0xffffff;
    const intensity = 150;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 10, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    function updateLight() {
      helper.update();
    }

    function makeXYZGUI(gui, vector3, overfolder, onChangeFn) {
      // const folder = gui.addFolder(name);
      const folder = overfolder;
      folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
      folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
      folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
      folder.open();
    }

    pointLightFolder.add(light, 'intensity', 0, 250, 0.01);
    pointLightFolder.add(light, 'distance', 0, 40).onChange(updateLight);

    makeXYZGUI(gui, light.position, pointLightFolder, updateLight);
  }

  class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
  }

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }
  function makeXYZGUI(gui, vector3, folder, onChangeFn) {
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

  const spotLightFolder = gui.addFolder('Spot Light');

  // // SpotLight
  // {
  //   const color = 0xffffff;
  //   const intensity = 150;
  //   const light = new THREE.SpotLight(color, intensity);
  //   scene.add(light);
  //   scene.add(light.target);

  //   const helper = new THREE.SpotLightHelper(light);
  //   scene.add(helper);

  //   function updateLight() {
  //     light.target.updateMatrixWorld();
  //     helper.update();
  //   }

  //   function makeXYZGUI(gui, vector3, folder, onChangeFn) {
  //     folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  //     folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  //     folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  //     folder.open();
  //   }

  //   spotLightFolder.add(light, 'penumbra', 0, 1, 0.01);

  //   makeXYZGUI(gui, light.position, spotLightFolder, updateLight);
  //   makeXYZGUI(gui, light.target.position, spotLightFolder, updateLight);

  //   spotLightFolder.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
  // }

  // Rect area light
  // {
  //   const color = 0xffffff;
  //   const intensity = 5;
  //   const width = 12;
  //   const height = 4;
  //   const light = new THREE.RectAreaLight(color, intensity, width, height);
  //   light.position.set(0, 10, 0);
  //   light.rotation.x = THREE.MathUtils.degToRad(-90);
  //   scene.add(light);

  //   const helper = new RectAreaLightHelper(light);
  //   light.add(helper);

  //   // gui
  //   const rectAreaLightFolder = gui.addFolder('RectAreaLight');
  //   rectAreaLightFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');

  //   rectAreaLightFolder.add(light, 'intensity', 0, 10, 0.01);
  //   rectAreaLightFolder.add(light, 'width', 0, 20);
  //   rectAreaLightFolder.add(light, 'height', 0, 20);
  //   rectAreaLightFolder.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
  //   rectAreaLightFolder.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation');
  //   rectAreaLightFolder.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation');
  // }

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

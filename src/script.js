// when making change to production:
// 0. delete subtree gh-pages
// 1. $ npm run build (updates dist directory with compiled files for production)
// 2. Do regular git add -A, commit, push 
// 3. $ git subtree push --prefix dist origin gh-pages

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//----------------------------------Debug UI---------------------------------->>

// const gui = new dat.GUI();

//-----------------------------------Canvas----------------------------------->>

const canvas = document.querySelector('canvas.webgl');

//-----------------------------------Scene----------------------------------->>

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(10, 20);
// scene.add(gridHelper)

// Skybox
const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxTexture = skyboxLoader.load([
  './spaceBox/px.png',
  './spaceBox/nx.png',
  './spaceBox/py.png',
  './spaceBox/ny.png',
  './spaceBox/pz.png',
  './spaceBox/nz.png'
])

scene.background = skyboxTexture;

//--------------------------------Textures--------------------------------//

  // Loading Manager Setup
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

  // Star
// const starsTexture = textureLoader.load('./particles/black/star_01.png')

  // Mossy
const mossyColorTexture = textureLoader.load('./mossy/Rock_Moss_001_basecolor.jpg');
const mossyAoTexture = textureLoader.load('./mossy/Rock_Moss_001_ambientOcclusion.jpg');
const mossyHeightTexture = textureLoader.load('./mossy/Rock_Moss_001_height.png');
const mossyNormalTexture = textureLoader.load('./mossy/Rock_Moss_001_normal.jpg');
const mossyRoughnessTexture = textureLoader.load('./mossy/Rock_Moss_001_roughness.jpg');

//-----------------------------------Font----------------------------------->>
const group = new THREE.Group();
const fontLoader = new THREE.FontLoader();

fontLoader.load(
  './fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new THREE.TextGeometry(
      'vibe-3d.space',
      {
        font: font,
        size: .6,
        height: 0.3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .7,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 1,
        wireframe: false
      }
    )
    
    textGeometry.center();

    const textNormalMaterial = new THREE.MeshNormalMaterial()

    const text = new THREE.Mesh(textGeometry, textNormalMaterial);
    text.position.y = 2;
    text.rotateX(- Math.PI / 21)
    text.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(text.geometry.attributes.uv.array, 2)
    );

    group.add(text);
    scene.add(group);
    

    // debugger
    // const textFolder = gui.addFolder("Text");
    // textFolder.add(textMatcapMaterial, 'mossyness', 0, 1, .01);
    // textFolder.add(textMatcapMaterial, 'roughness', 0, 1, .01);
    // const parameters = {
    //   color: 0xff0000
    // }
    // textFolder.addColor(parameters, 'color')
    //   .onChange(() => {
    //     textMatcapMaterial.color.set(parameters.color)
    //   })
  }
)

//---------------------------------Geometries--------------------------------->>

const planetGeometry = new THREE.SphereGeometry(4, 32, 32);

//---------------------------------Materials--------------------------------->>

const planetMaterial = new THREE.MeshStandardMaterial({
  map: mossyColorTexture,
  normalMap: mossyNormalTexture,
  aoMap: mossyAoTexture,
  aoMapIntensity: 5,
  displacementMap: mossyHeightTexture,
  roughnessMap: mossyRoughnessTexture
});

//-----------------------------------Meshes----------------------------------->>

const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.y = -4;
planet.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(planet.geometry.attributes.uv.array, 2)
);
scene.add(planet);

//---------------------------------Particles--------------------------------->>

const starsGeometry = new THREE.BufferGeometry();
const count = 500;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}

starsGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  // map: starsTexture
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

//-----------------------------------Lights----------------------------------->>

const ambientLight = new THREE.AmbientLight(0xffffff, .7);
ambientLight.position.set(2,3,5);
// scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.set(0, 4, 0);
scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

//-----------------------------------Sizes----------------------------------->>
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//-----------------------------------Camera----------------------------------->>

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 10;
scene.add(camera);

//----------------------------------Controls---------------------------------->>

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//----------------------------------Renderer---------------------------------->>

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//----------------------------------Raycaster---------------------------------->>

// const raycaster = new THREE.Raycaster();
// let currentIntersect = null;
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);

//-----------------------------------Mouse----------------------------------->>

// const mouse = new THREE.Vector2();

// window.addEventListener('mousemove', (event) => {
//   mouse.x = event.clientX / sizes.width * 2 - 1;
//   mouse.y = - (event.clientY / sizes.height) * 2 + 1;
// })

// window.addEventListener('click', () => {
//   if (currentIntersect) {
//     console.log("HI")
//   }
// })

//----------------------------------Animate---------------------------------->>

// window.addEventListener('mousemove', (e) => {
//   mouse.x = e.clientX / sizes.width * 2 - 1;
//   mouse.y = - (e.clientY / sizes.width * 2 - 1);
//   console.log('mouse')
// })


const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // raycaster.setFromCamera(mouse, camera);

  // const intersects = raycaster.intersectObject(group);

  // if (intersects.length) {
  //   if (!currentIntersect) {
  //     console.log('mouse enter')
  //   }
  //   currentIntersect = intersects
  // } else {
  //   if (currentIntersect) {
  //     console.log('mouse leave')
  //   }

  //   currentIntersect = null;
  // }
  
  // Update objects
  stars.rotateY(0.001)

  group.position.y = Math.sin(elapsedTime) / 4;
  
  planet.rotateY(.0005);
  // Update Orbital Controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
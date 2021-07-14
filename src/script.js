// when making change to production:
// 1. $ npm run build (updates dist directory with compiled files for production)
// 2. Do regular git add -A, commit, push 
// 3. $ git subtree push --prefix dist origin gh-pages

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Material } from 'three'

//--------------------------------Debug UI--------------------------------//

const gui = new dat.GUI();

const parameters = {
  color: 0x412f2f
};

gui
  .addColor(parameters, 'color')
  .onChange(() => {
    floorMaterial.color.set(parameters.color);
  });

//--------------------------------Textures--------------------------------//

  // Loading Manager Setup
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = () => {
  console.log('onStart');
}

loadingManager.onLoad = () => {
  console.log('onLoad');
}

loadingManager.onProgress = () => {
  console.log('onProgress');
}
loadingManager.onError = () => {
  console.log('onError');
  console.log('onError');
}

  // Floor Textures
const floorColorTexture = textureLoader.load('/floor/Wood_Floor_009_basecolor.jpg');
const floorAmbientOcclusionTexture = textureLoader.load('/floor/Wood_Floor_009_ambientOcclusion.jpg');
const floorNormalTexture = textureLoader.load('/floor/Wood_Floor_009_normal.jpg');
const floorRoughnessTexture = textureLoader.load('/floor/Wood_Floor_009_roughness.jpg');

  // Ceiling Textures
const ceilingColorTexture = textureLoader.load('/ceiling/Ceiling_Drop_Tiles_001_basecolor.jpg');
const ceilingAmbientOcclusionTexture = textureLoader.load('/ceiling/Ceiling_Drop_Tiles_001_ambientOcclusion.jpg');
const ceilingHeightTexture = textureLoader.load('/ceiling/Ceiling_Drop_Tiles_001_height.png')
const ceilingRoughnessTexture = textureLoader.load('/ceiling/Ceiling_Drop_Tiles_001_roughness.jpg');
const ceilingNormalTexture = textureLoader.load('/ceiling/Ceiling_Drop_Tiles_001_normal.jpg');

  // Wall Textures
const wallColorTexture = textureLoader.load('/carrara_marble/Marble_Carrara_002_COLOR.jpg');
const wallAmbientOcclusionTexture = textureLoader.load('/carrara_marble/Marble_Carrara_002_OCC.jpg');
const wallNormalTexture = textureLoader.load('/carrara_marble/Marble_Carrara_002_NORM.jpg');
const wallRoughnessTexture = textureLoader.load('/carrara_marble/Marble_Carrara_002_ROUGH.jpg');

  // Window Textures
const windowColorTexture = textureLoader.load('/window/Window_001_basecolor.jpg');
const windowAmbientOcclusionTexture = textureLoader.load('/window/Window_001_ambientOcclusion.jpg');
const windowNormalTexture = textureLoader.load('/window/Window_001_normal.jpg');
const windowRoughnessTexture = textureLoader.load('/window/Window_001_roughness.jpg');
const windowMetallicTexture = textureLoader.load('/window/Window_001_metallic.jpg');
const windowHeightTexture = textureLoader.load('/window/Window_001_height.png');
const windowOpacityTexture = textureLoader.load('/window/Window_001_opacity.jpg');

//-----------------------------------Font----------------------------------->>

const fontLoader = new THREE.FontLoader();

fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new THREE.TextGeometry(
      'vibe-3d.space',
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )

    const textMaterial = new THREE.MeshStandardMaterial({
      normalMap: floorNormalTexture

    });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    
    scene.add(text);
  }
)

//-----------------------------------Canvas----------------------------------->>

const canvas = document.querySelector('canvas.webgl');

//-----------------------------------Scene----------------------------------->>

const scene = new THREE.Scene();
const gridHelper = new THREE.GridHelper(10, 20);
// scene.add(gridHelper)

//---------------------------------Geometries--------------------------------->>

const floorGeometry = new THREE.PlaneGeometry(12, 11.5);
const wallGeometry = new THREE.PlaneGeometry(10, 5);
const sideWindowGeometry = new THREE.PlaneGeometry(5, 5);
const mainWindowGeometry = new THREE.PlaneGeometry(5, 5);

//---------------------------------Materials--------------------------------->>

  // Floor Materials
const floorMaterial = new THREE.MeshStandardMaterial(
  { 
    // specular: new THREE.Color(0xff0000),
    map: floorColorTexture,
    normalMap: floorNormalTexture,
    roughnessMap: floorRoughnessTexture,
    aoMap: floorAmbientOcclusionTexture,
    aoMapIntensity: 10,
    // displacementMap: floorHeightTexture,
    // displacementScale: .1,
    side: THREE.DoubleSide
  });

gui
  .add(floorMaterial, 'metalness').min(0).max(1).step(.0001);
  
gui
  .add(floorMaterial, 'roughness').min(0).max(1).step(.0001);

  // Ceiling Materials
const ceilingMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  map: ceilingColorTexture,
  normalMap: ceilingNormalTexture,
  roughnessMap: ceilingRoughnessTexture,
  aoMap: ceilingAmbientOcclusionTexture,
  aoMapIntensity: 2
});

  // Walls Materials
const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallColorTexture,
  side: THREE.DoubleSide,
  normalMap: wallNormalTexture,
  aoMap: wallAmbientOcclusionTexture,
  aoMapIntensity: 1,
  roughnessMap: wallRoughnessTexture
});

  // Skybox
const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxTexture = skyboxLoader.load([
  '/spaceBox/px.png',
  '/spaceBox/nx.png',
  '/spaceBox/py.png',
  '/spaceBox/ny.png',
  '/spaceBox/pz.png',
  '/spaceBox/nz.png'
])

scene.background = skyboxTexture;

  // Window Materials
const sideWindowMaterial = new THREE.MeshStandardMaterial({
  map: windowColorTexture,
  side: THREE.DoubleSide,
  normalMap: windowNormalTexture,
  aoMap: windowAmbientOcclusionTexture,
  aoMapIntensity: 5,
  metalnessMap: windowMetallicTexture,
  opacity: 100,
  roughnessMap: windowRoughnessTexture,
  alphaMap: windowOpacityTexture,
});

const mainWindowMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  // opacity: 100,
  metalnessMap: windowMetallicTexture,
  roughness: 100,
  // envMap: skyboxTexture,
  // normalMap: windowNormalTexture
});
console.log(skyboxTexture)
//-----------------------------------Meshes----------------------------------->>

  // Floor Meshes
const floor = new THREE.Mesh(floorGeometry, wallMaterial);
floor.geometry.setAttribute(
  'uv2', 
  new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.position.set(0, 0, -.75);
floor.rotateX(Math.PI/2);

  // Ceiling Meshes
const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
ceiling.position.set(0, 5, -.75);
ceiling.rotateX(Math.PI / 2);
ceiling.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

  // Wall Meshes
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(-5, 2.5, 0);
wall1.rotateY(Math.PI / 2);
wall1.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall2.position.set(5, 2.5, 0);
wall2.rotateY(Math.PI / 2);

  // Window Meshes
const sideWindow = new THREE.Mesh(sideWindowGeometry, sideWindowMaterial);
sideWindow.position.set(-4.95, 3.5, 0);
sideWindow.rotateY(Math.PI / 2);
sideWindow.scale.set(.5, .25);

const mainWindow = new THREE.Mesh(mainWindowGeometry, mainWindowMaterial);
mainWindow.position.set(0, 2.5, -6.5);

  // Adding meshes to the room Group
const room = new THREE.Group();
room.add(floor);
room.add(wall1);
room.add(wall2);
room.add(ceiling);
room.add(mainWindow);
// scene.add(room);

//-----------------------------------Lights----------------------------------->>

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.position.set(2,5,5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(1, 3, 1);
scene.add(pointLight);

//-----------------------------------Sizes----------------------------------->>
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//-----------------------------------Camera----------------------------------->>

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 5
scene.add(camera)

//----------------------------------Controls---------------------------------->>

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//----------------------------------Renderer---------------------------------->>

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//----------------------------------Animate---------------------------------->>

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
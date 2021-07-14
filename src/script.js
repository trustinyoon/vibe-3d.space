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




//--------------------------------Textures--------------------------------//

  // Loading Manager Setup
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

  // Matcap
const matcapTexture = textureLoader.load('/matcaps/5.png')

  // Normal
const normalTexture = textureLoader.load('/normal.jpg')

  // Ice
const iceColorTexture = textureLoader.load('/ice/Ice_001_COLOR.jpg');
const iceNormalTexture = textureLoader.load('/ice/Ice_001_NRM.jpg');
const iceOccTexture = textureLoader.load('/ice/Ice_001_OCC.jpg');
const iceSpecTexture = textureLoader.load('/ice/Ice_001_SPEC.jpg');
const iceHeightTexture = textureLoader.load('/ice/Ice_001_DISP.png');

  // Metal
const metalColorTexture = textureLoader.load('/metal/Metal_Plate_Sci-Fi_001_basecolor.jpg');
const metalAoTexture = textureLoader.load('/metal/Metal_Plate_Sci-Fi_001_ambientOcclusion.jpg');
const metalHeightTexture = textureLoader.load('/metal/Metal_Plate_Sci-Fi_001_height.png');
const metalMetallicTexture = textureLoader.load('/metal/Metal_Plate_Sci-Fi_001_metallic.jpg');
const metalNormalTexture = textureLoader.load('/metal/Metal_Plate_Sci-Fi_001_normal.jpg');
const metalRoughnessTexture = textureLoader.load('/metal/Metal_Plate_Sci-Fi_001_roughness.jpg');

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

//-----------------------------------Font----------------------------------->>

const fontLoader = new THREE.FontLoader();

fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
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

    const textMatcapMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture
    });

    const textNormalMaterial = new THREE.MeshNormalMaterial({
      normalMap: normalTexture
    })

    const text = new THREE.Mesh(textGeometry, textNormalMaterial);
    text.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(text.geometry.attributes.uv.array, 2)
    );
    console.log(text)
    scene.add(text);

    // debugger
    const textFolder = gui.addFolder("Text");
    // textFolder.add(textMatcapMaterial, 'metalness', 0, 1, .01);
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

//-----------------------------------Canvas----------------------------------->>

const canvas = document.querySelector('canvas.webgl');

//-----------------------------------Scene----------------------------------->>

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(10, 20);
scene.add(gridHelper)

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

//---------------------------------Geometries--------------------------------->>



//---------------------------------Materials--------------------------------->>



//-----------------------------------Meshes----------------------------------->>


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
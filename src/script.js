import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/3.png')

/* Font */

const fontLoader = new FontLoader()
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Borbekov Bekzhan', {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    })
    const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
    })

    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // )
    // textGeometry.computeBoundingBox()
    // console.log(textGeometry.boundingBox)
    textGeometry.center()
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const triangleGeometry = new THREE.TetrahedronGeometry(1, 0)
    console.time()
    for (let i = 0; i < 100; i++) {
        // CUBE
        const cube = new THREE.Mesh(cubeGeometry, material)
        cube.position.x = (Math.random() - 0.5) * 20
        cube.position.y = (Math.random() - 0.5) * 20
        cube.position.z = (Math.random() - 0.5) * 20

        cube.rotation.x = Math.random() * Math.PI

        const scale = Math.random()
        cube.scale.set(scale, scale, scale)

        // OctahedronGeometry
        const triangle = new THREE.Mesh(triangleGeometry, material)
        triangle.position.x = (Math.random() - 0.5) * 20
        triangle.position.y = (Math.random() - 0.5) * 20
        triangle.position.z = (Math.random() - 0.5) * 20

        triangle.rotation.x = Math.random() * Math.PI

        triangle.scale.set(scale, scale, scale)

        scene.add(cube, triangle)
    }
    console.timeEnd()
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.x = 1
camera.position.y = -1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

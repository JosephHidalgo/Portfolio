import './style.css'
import { initScene } from './scene.js'
import { initScrollController } from './scroll.js'
import { initCarousel } from './carousel.js'

// Inicializar la escena 3D
const { scene, camera, renderer, cube } = initScene()

// Inicializar el controlador de scroll
initScrollController(cube)

// Inicializar el carrusel de proyectos
initCarousel()

// Animación
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

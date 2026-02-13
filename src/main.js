import './style.css'
import { initScene } from './scene.js'
import { initScrollController } from './scroll.js'
import { initCarousel } from './carousel.js'

const { scene, camera, renderer, cube } = initScene()

initScrollController(cube, scene)

initCarousel()

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.remove('loading')
  }, 100)
})

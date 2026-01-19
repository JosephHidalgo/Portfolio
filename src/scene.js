import * as THREE from 'three'

export function initScene() {
  // Configurar la escena
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0a)

  // Configurar la cámara
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 5)

  // Configurar el renderer
  const canvas = document.getElementById('canvas-3d')
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    alpha: true 
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Crear el cubo 
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x87CEEB, metalness: 0, roughness: 0.8 }), // Derecha - Celeste vivo
    new THREE.MeshStandardMaterial({ color: 0xFFB6C1, metalness: 0, roughness: 0.8 }), // Izquierda - Rosa vivo
    new THREE.MeshStandardMaterial({ color: 0x98D8C8, metalness: 0, roughness: 0.8 }), // Arriba - Turquesa pastel
    new THREE.MeshStandardMaterial({ color: 0xFFE66D, metalness: 0, roughness: 0.8 }), // Abajo - Amarillo vivo
    new THREE.MeshStandardMaterial({ color: 0xB4E7CE, metalness: 0, roughness: 0.8 }), // Frente - Menta vivo
    new THREE.MeshStandardMaterial({ color: 0xC4A1FF, metalness: 0, roughness: 0.8 })  // Atrás - Lila vivo
  ]

  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const cube = new THREE.Mesh(geometry, materials)
  
  // Posición inicial responsive
  const isMobile = window.innerWidth <= 768
  cube.position.set(
    isMobile ? 1 : -2.5,    
    isMobile ? -5.5 : 0,    
    0
  )
  scene.add(cube)

  const edges = new THREE.EdgesGeometry(geometry)
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
  const wireframe = new THREE.LineSegments(edges, lineMaterial)
  cube.add(wireframe)

  // Iluminación
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight1.position.set(5, 5, 5)
  scene.add(directionalLight1)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
  directionalLight2.position.set(-5, -5, -5)
  scene.add(directionalLight2)

  // Luz puntual para efectos dinámicos
  const pointLight = new THREE.PointLight(0x4a90e2, 1, 100)
  pointLight.position.set(0, 0, 5)
  scene.add(pointLight)

  // Partículas de fondo
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 500
  const positions = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  })

  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  // Manejar resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  return { scene, camera, renderer, cube, particles, pointLight }
}

import * as THREE from 'three'

export function initScene() {
  // Configurar la escena
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0a)

  // Configurar la cámara con FOV menor para mejor zoom
  const camera = new THREE.PerspectiveCamera(
    60,  // FOV reducido de 75 a 60
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
    new THREE.MeshStandardMaterial({ color: 0x5A8BB0, metalness: 0, roughness: 0.8, transparent: true, opacity: 1 }), // Derecha - Celeste oscuro
    new THREE.MeshStandardMaterial({ color: 0xB37F88, metalness: 0, roughness: 0.8, transparent: true, opacity: 1 }), // Izquierda - Rosa oscuro
    new THREE.MeshStandardMaterial({ color: 0x6A968C, metalness: 0, roughness: 0.8, transparent: true, opacity: 1 }), // Arriba - Turquesa oscuro
    new THREE.MeshStandardMaterial({ color: 0xB3A04C, metalness: 0, roughness: 0.8, transparent: true, opacity: 1 }), // Abajo - Amarillo oscuro
    new THREE.MeshStandardMaterial({ color: 0x7DA190, metalness: 0, roughness: 0.8, transparent: true, opacity: 1 }), // Frente - Menta oscuro
    new THREE.MeshStandardMaterial({ color: 0x8870B3, metalness: 0, roughness: 0.8, transparent: true, opacity: 1 })  // Atrás - Lila oscuro
  ]

  const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6)
  const cube = new THREE.Mesh(geometry, materials)
  
  // Posición inicial responsive
  const isMobile = window.innerWidth <= 768
  cube.position.set(
    isMobile ? 0 : -2.5,    
    isMobile ? -1.1 : 0,    
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

  // Partículas de fondo (espacio)
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

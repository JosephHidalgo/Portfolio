import gsap from 'gsap'
import * as THREE from 'three'

export function initScrollController(cube, scene) {
  let currentSection = 0
  const sections = document.querySelectorAll('.face-section')
  const totalSections = sections.length

  const rotations = [
    { x: 0, y: 0 },                    // Intro - rotación automática
    { x: 0, y: 0 },                    // Frente (About Me)
    { x: 0, y: Math.PI / 2 },          // Derecha (Skills)
    { x: 0, y: Math.PI },              // Atrás (Proyectos)
    { x: 0, y: -Math.PI / 2 },         // Izquierda (Formación)
    { x: -Math.PI / 2, y: 0 }          // Arriba (Contacto - Final)
  ]

  // Colores de fondo correspondientes a cada cara del cubo
  const backgroundColors = [
    'rgba(10, 10, 10, 0)',      // Intro - Transparente
    'rgba(125, 161, 144, 1)', // Frente - Menta oscuro
    'rgba(90, 139, 176, 1)',  // Derecha - Celeste oscuro
    'rgba(136, 112, 179, 1)', // Atrás - Lila oscuro
    'rgba(179, 127, 136, 1)', // Izquierda - Rosa oscuro
    'rgba(106, 150, 140, 1)'  // Arriba - Turquesa oscuro
  ]

  // Crear overlay de color de fondo (ahora opcional, puede ser más sutil)
  const colorOverlay = document.createElement('div')
  colorOverlay.id = 'color-overlay'
  colorOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    background: rgba(10, 10, 10, 1);
    transition: background 1.5s ease;
  `
  document.body.insertBefore(colorOverlay, document.getElementById('content'))

  let autoRotate = true
  let rotationAnimations = []
  
  // Iniciar rotación automática en los 3 ejes
  function startAutoRotation() {
    if (rotationAnimations.length === 0) {
      autoRotate = true
      
      const animY = gsap.to(cube.rotation, {
        y: '+=6.28319',
        duration: 10,
        repeat: -1,
        ease: 'none'
      })
      
      // Rotación en eje X (vertical)
      const animX = gsap.to(cube.rotation, {
        x: '+=6.28319',
        duration: 15,
        repeat: -1,
        ease: 'none'
      })
      
      // Rotación en eje Z (profundidad)
      const animZ = gsap.to(cube.rotation, {
        z: '+=6.28319',
        duration: 20,
        repeat: -1,
        ease: 'none'
      })
      
      rotationAnimations = [animX, animY, animZ]
    }
  }
  
  // Detener rotación automática
  function stopAutoRotation() {
    autoRotate = false
    rotationAnimations.forEach(anim => {
      if (anim) anim.kill()
    })
    rotationAnimations = []
  }
  
  // Iniciar rotación al cargar
  startAutoRotation()

  // Función para cambiar de sección
  function goToSection(index, direction = 1) {
    if (index < 0 || index >= totalSections) return

    const previousSection = currentSection
    currentSection = index
    
    // Detener rotación automática cuando salimos de la intro (index 0)
    if (index > 0 && autoRotate) {
      stopAutoRotation()
    }
    
    // Reiniciar rotación automática si volvemos a la intro
    if (index === 0 && !autoRotate) {
      startAutoRotation()
    }

    // Direcciones de animación para cada transición (intercaladas)
    const vw = window.innerWidth
    const vh = window.innerHeight
    
    // Definir direcciones específicas para cada transición
    // Solo necesitamos la dirección de entrada, la anterior se queda fija
    const transitionDirections = [
      { x: 0, y: vh },        // 0 -> 1: entra desde abajo (sube)
      { x: vw, y: 0 },        // 1 -> 2: entra desde la derecha
      { x: 0, y: -vh },       // 2 -> 3: entra desde arriba (baja)
      { x: -vw, y: 0 },       // 3 -> 4: entra desde la izquierda
      { x: 0, y: vh },        // 4 -> 5: entra desde abajo (sube)
    ]
    
    let slideIn
    
    if (direction > 0) {
      // Avanzando: usar las direcciones definidas
      const transitionIndex = Math.min(previousSection, transitionDirections.length - 1)
      slideIn = transitionDirections[transitionIndex]
    } else {
      // Retrocediendo: invertir las direcciones
      const transitionIndex = Math.min(index, transitionDirections.length - 1)
      slideIn = { 
        x: -transitionDirections[transitionIndex].x, 
        y: -transitionDirections[transitionIndex].y 
      }
    }

    // La sección anterior se mantiene visible y fija en su posición
    if (previousSection !== index) {
      // Asegurar que la sección anterior esté en su posición original
      gsap.set(sections[previousSection], { x: 0, y: 0, opacity: 1 })
      sections[previousSection].style.zIndex = '1'
    }

    // Mostrar sección actual con z-index mayor para que se sobreponga
    sections[index].classList.add('active')
    sections[index].style.zIndex = '2'
    gsap.set(sections[index], { opacity: 1 })
    
    // Cambiar el color del overlay (opcional, puede eliminarse)
    setTimeout(() => {
      colorOverlay.style.background = backgroundColors[index]
    }, 400)

    // Posicionar toda la sección fuera de la pantalla y animarla
    gsap.set(sections[index], { 
      x: slideIn.x, 
      y: slideIn.y,
      opacity: 1
    })
    
    const currentContent = sections[index].querySelector('.face-content, .intro-content')
    if (currentContent) {
      currentContent.classList.add('show-content')
    }
    
    // Animar la sección completa (con su fondo) deslizándose
    gsap.to(sections[index], {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        // Ocultar la sección anterior INMEDIATAMENTE cuando la animación termina
        if (previousSection !== index) {
          sections[previousSection].classList.remove('active')
          gsap.set(sections[previousSection], { opacity: 0 })
          const previousContent = sections[previousSection].querySelector('.face-content, .intro-content')
          if (previousContent) {
            previousContent.classList.remove('show-content')
          }
        }
      }
    })

    // Animar el cubo a la rotación correspondiente
    const targetRotation = rotations[index]
    
    if (index > 0) {
      gsap.to(cube.rotation, {
        x: targetRotation.x,
        y: targetRotation.y,
        z: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      })
    }

    const isMobile = window.innerWidth <= 768

    // Animar posición y escala del cubo con zoom dramático
    if (index === 0) {
      // Estado inicial - cubo alejado y más pequeño
      gsap.to(cube.position, {
        x: isMobile ? 0 : -2.5,
        y: isMobile ? -1 : 0,
        z: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      })
      gsap.to(cube.scale, {
        x: isMobile ? 1 : 1.5,
        y: isMobile ? 1 : 1.5,
        z: isMobile ? 1 : 1.5,
        duration: 1,
        ease: 'power2.out'
      })
      // Hacer cubo visible
      gsap.to(cube.material, {
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: function() {
          cube.material.forEach(mat => {
            mat.opacity = this.progress()
            mat.transparent = this.progress() < 1
          })
        }
      })
    } else {
      // Zoom EXTREMO - el cubo llena TODA la pantalla
      const zoomScale = isMobile ? 5.5 : 6.5  
      const zPosition = isMobile ? 3 : 3.8     // Acercar MÁS el cubo a la cámara
      
      gsap.to(cube.position, {
        x: 0,
        y: 0,
        z: zPosition,
        duration: index === 1 ? 2 : 1.5,
        ease: 'power2.inOut'
      })
      gsap.to(cube.scale, {
        x: zoomScale,
        y: zoomScale,
        z: zoomScale,
        duration: index === 1 ? 2 : 1,
        ease: 'power2.out'
      })
      // Hacer cubo visible durante transición, luego casi invisible
      gsap.to(cube.material, {
        opacity: 0.5,
        duration: 0.8,
        ease: 'power2.in',
        onStart: function() {
          cube.material.forEach(mat => mat.transparent = true)
        },
        onUpdate: function() {
          const currentOpacity = 1 - (this.progress() * 0.5)
          cube.material.forEach(mat => {
            mat.opacity = currentOpacity
          })
        },
        onComplete: function() {
          // Después de la transición, hacer casi invisible
          gsap.to(cube.material, {
            opacity: 0.03,
            duration: 1.2,
            delay: 0.3,
            onUpdate: function() {
              const finalOpacity = 0.5 - (this.progress() * 0.47)
              cube.material.forEach(mat => {
                mat.opacity = finalOpacity
              })
            }
          })
        }
      })
    }
  }

  // Detección de scroll
  let isScrolling = false
  let scrollTimeout

  window.addEventListener('wheel', (e) => {
    if (isScrolling) return

    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      isScrolling = false
    }, 100)

    if (Math.abs(e.deltaY) > 10) {
      isScrolling = true

      if (e.deltaY > 0 && currentSection < totalSections - 1) {
        goToSection(currentSection + 1, 1)
      } else if (e.deltaY < 0 && currentSection > 0) {
        goToSection(currentSection - 1, -1)
      }

      setTimeout(() => {
        isScrolling = false
      }, 1000)
    }
  }, { passive: true })

  // Navegación con teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && currentSection < totalSections - 1) {
      goToSection(currentSection + 1, 1)
    } else if (e.key === 'ArrowUp' && currentSection > 0) {
      goToSection(currentSection - 1, -1)
    }
  })

  // Navegación táctil para móviles
  let touchStartY = 0
  let touchEndY = 0

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY
  }, { passive: true })

  window.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY - touchEndY

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSection < totalSections - 1) {
        goToSection(currentSection + 1, 1)
      } else if (diff < 0 && currentSection > 0) {
        goToSection(currentSection - 1, -1)
      }
    }
  }, { passive: true })

  
  // Inicializar la primera sección
  sections[0].classList.add('active')
  sections[0].style.zIndex = '2'
  gsap.set(sections[0], { x: 0, y: 0, opacity: 1 })
  
  // Asegurar que todas las demás secciones estén completamente ocultas
  sections.forEach((section, i) => {
    if (i !== 0) {
      section.classList.remove('active')
      gsap.set(section, { opacity: 0 })
    }
  })
  
  const initialContent = sections[0].querySelector('.intro-content')
  if (initialContent) {
    initialContent.classList.add('show-content')
  }
  
  currentSection = 0
  
  // Iniciar la rotación automática
  startAutoRotation()
}

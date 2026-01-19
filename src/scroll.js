import gsap from 'gsap'

export function initScrollController(cube) {
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
  function goToSection(index) {
    if (index < 0 || index >= totalSections) return

    currentSection = index
    
    if (index > 0) {
      stopAutoRotation()
    }

    sections.forEach(section => {
      section.classList.remove('active')
      const faceContent = section.querySelector('.face-content, .intro-content')
      if (faceContent) {
        faceContent.classList.remove('show-content')
      }
    })

    // Mostrar sección actual
    sections[index].classList.add('active')
    
    // Mostrar contenido después de la animación del cubo
    const currentContent = sections[index].querySelector('.face-content, .intro-content')
    if (currentContent) {
      setTimeout(() => {
        currentContent.classList.add('show-content')
      }, index === 1 ? 2000 : 1500)
    }

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

    // Animar posición y escala del cubo
    if (index === 0) {
      gsap.to(cube.position, {
        x: isMobile ? 0 : -2.5,
        y: isMobile ? 0 : 0,
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
    } else {
      gsap.to(cube.position, {
        x: 0,
        y: isMobile ? 1 : 0,
        z: 0,
        duration: index === 1 ? 2 : 1.5,
        ease: 'power2.inOut'
      })
      gsap.to(cube.scale, {
        x: isMobile ? 1.3 : 1.5,
        y: isMobile ? 1.3 : 1.5,
        z: isMobile ? 1.3 : 1.5,
        duration: index === 1 ? 2 : 1,
        ease: 'power2.out'
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
        goToSection(currentSection + 1)
      } else if (e.deltaY < 0 && currentSection > 0) {
        goToSection(currentSection - 1)
      }

      setTimeout(() => {
        isScrolling = false
      }, 1000)
    }
  }, { passive: true })

  // Navegación con teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && currentSection < totalSections - 1) {
      goToSection(currentSection + 1)
    } else if (e.key === 'ArrowUp' && currentSection > 0) {
      goToSection(currentSection - 1)
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
        goToSection(currentSection + 1)
      } else if (diff < 0 && currentSection > 0) {
        goToSection(currentSection - 1)
      }
    }
  }, { passive: true })

  
  goToSection(0)
  
  const initialContent = sections[0].querySelector('.intro-content')
  if (initialContent) {
    setTimeout(() => {
      initialContent.classList.add('show-content')
    }, 300)
  }
}

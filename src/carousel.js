export function initCarousel() {
  let currentIndex = 0
  const cards = document.querySelectorAll('.project-card')
  const prevBtn = document.querySelector('.carousel-btn.prev')
  const nextBtn = document.querySelector('.carousel-btn.next')
  const totalCards = cards.length
  let isAnimating = false

  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev')
    if (i === 0) {
      card.classList.add('active')
    }
  })

  function showCard(newIndex, direction) {
    if (isAnimating || newIndex === currentIndex) return
    isAnimating = true

    const outgoing = cards[currentIndex]
    const incoming = cards[newIndex]

    const enterFrom = direction === 'next'
      ? 'translateX(100%) scale(0.9)'
      : 'translateX(-100%) scale(0.9)'
    const exitTo = direction === 'next'
      ? 'translateX(-100%) scale(0.9)'
      : 'translateX(100%) scale(0.9)'

    incoming.style.transition = 'none'
    incoming.style.transform = enterFrom
    incoming.style.opacity = '0'
    incoming.classList.add('active')

    // Forzar reflow para aplicar posición inmediata
    void incoming.offsetHeight

    // Re-habilitar transición y animar entrada
    incoming.style.transition = ''
    incoming.style.transform = 'translateX(0) scale(1)'
    incoming.style.opacity = '1'

    // Animar salida de la tarjeta actual
    outgoing.style.transform = exitTo
    outgoing.style.opacity = '0'

    // Limpieza después de la animación
    setTimeout(() => {
      outgoing.classList.remove('active')
      outgoing.style.transform = ''
      outgoing.style.opacity = ''
      outgoing.style.transition = ''
      incoming.style.transform = ''
      incoming.style.opacity = ''
      incoming.style.transition = ''
      currentIndex = newIndex
      isAnimating = false
    }, 600)
  }

  // Navegar al siguiente proyecto (infinito)
  function nextCard() {
    const newIndex = (currentIndex + 1) % totalCards
    showCard(newIndex, 'next')
  }

  // Navegar al proyecto anterior (infinito)
  function prevCard() {
    const newIndex = (currentIndex - 1 + totalCards) % totalCards
    showCard(newIndex, 'prev')
  }

  // Event listeners para los botones
  if (prevBtn) {
    prevBtn.addEventListener('click', prevCard)
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextCard)
  }

  // Navegación con teclado
  function handleKeyboard(e) {
    const projectsSection = document.querySelector('[data-face="back"]')
    if (!projectsSection || !projectsSection.classList.contains('active')) {
      return
    }

    if (e.key === 'ArrowLeft') {
      e.stopPropagation()
      prevCard()
    } else if (e.key === 'ArrowRight') {
      e.stopPropagation()
      nextCard()
    }
  }

  window.addEventListener('keydown', handleKeyboard)

  let touchStartX = 0

  const carouselContainer = document.querySelector('.carousel-container')
  
  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
    }, { passive: true })

    carouselContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextCard()
        } else {
          prevCard()
        }
      }
    }, { passive: true })
  }
}

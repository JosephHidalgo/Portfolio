export function initCarousel() {
  let currentIndex = 0
  const cards = document.querySelectorAll('.project-card')
  const prevBtn = document.querySelector('.carousel-btn.prev')
  const nextBtn = document.querySelector('.carousel-btn.next')
  const totalCards = cards.length

  function showCard(index) {
    if (index < 0) index = totalCards - 1
    if (index >= totalCards) index = 0
    
    currentIndex = index

    // Actualizar tarjetas
    cards.forEach((card, i) => {
      card.classList.remove('active', 'prev')
      
      if (i === currentIndex) {
        card.classList.add('active')
      } else if (i < currentIndex) {
        card.classList.add('prev')
      }
    })
  }

  // Navegar al siguiente proyecto
  function nextCard() {
    showCard(currentIndex + 1)
  }

  // Navegar al proyecto anterior
  function prevCard() {
    showCard(currentIndex - 1)
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
  let touchEndX = 0

  const carouselContainer = document.querySelector('.carousel-container')
  
  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
    }, { passive: true })

    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX
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

  showCard(0)
}

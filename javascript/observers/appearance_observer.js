export class AppearanceObserver {
  constructor (delegate, element = null) {
    this.delegate = delegate
    this.element = element || delegate
    this.started = false
    this.intersecting = false

    this.intersectionObserver = new IntersectionObserver(this.intersect)
  }

  start () {
    if (!this.started) {
      this.started = true
      this.intersectionObserver.observe(this.element)
      this.observeVisibility()
    }
  }

  stop () {
    if (this.started) {
      this.started = false
      this.intersectionObserver.unobserve(this.element)
      this.unobserveVisibility()
    }
  }

  observeVisibility = () => {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  unobserveVisibility = () => {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    )
  }

  intersect = entries => {
    entries.forEach(entry => {
      if (entry.target === this.element) {
        if (entry.isIntersecting && document.visibilityState === 'visible') {
          this.intersecting = true
          this.delegate.appearedInViewport()
        } else {
          this.intersecting = false
          this.delegate.disappearedFromViewport()
        }
      }
    })
  }

  handleVisibilityChange = event => {
    if (document.visibilityState === 'visible' && this.intersecting) {
      this.delegate.appearedInViewport()
    } else {
      this.delegate.disappearedFromViewport()
    }
  }
}

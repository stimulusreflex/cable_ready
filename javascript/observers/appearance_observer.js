export class AppearanceObserver {
  constructor (delegate, element = null) {
    this.delegate = delegate
    this.element = element || delegate
    this.started = false

    this.intersectionObserver = new IntersectionObserver(this.intersect)
  }

  start () {
    if (!this.started) {
      this.started = true
      this.intersectionObserver.observe(this.element)
    }
  }

  stop () {
    if (this.started) {
      this.started = false
      this.intersectionObserver.unobserve(this.element)
    }
  }

  intersect = entries => {
    entries.forEach(entry => {
      if (entry.target === this.element) {
        if (entry.isIntersecting) {
          this.delegate.appearedInViewport()
        } else {
          this.delegate.disappearedFromViewport()
        }
      }
    })
  }
}

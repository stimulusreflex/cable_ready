export const registerInnerUpdates = () => {
  document.addEventListener('stimulus-reflex:before', event => {
    recursiveMarkUpdatesForElements(event.detail.element)
  })

  document.addEventListener('stimulus-reflex:after', event => {
    setTimeout(() => {
      recursiveUnmarkUpdatesForElements(event.detail.element)
    })
  })

  document.addEventListener('turbo:submit-start', event => {
    recursiveMarkUpdatesForElements(event.target)
  })

  document.addEventListener('turbo:submit-end', event => {
    setTimeout(() => {
      recursiveUnmarkUpdatesForElements(event.target)
    })
  })
}

const recursiveMarkUpdatesForElements = leaf => {
  const closestUpdatesFor = leaf && leaf.parentElement.closest('updates-for')
  if (closestUpdatesFor) {
    closestUpdatesFor.setAttribute('performing-inner-update', '')
    recursiveMarkUpdatesForElements(closestUpdatesFor)
  }
}

const recursiveUnmarkUpdatesForElements = leaf => {
  const closestUpdatesFor = leaf && leaf.parentElement.closest('updates-for')
  if (closestUpdatesFor) {
    closestUpdatesFor.removeAttribute('performing-inner-update')
    recursiveUnmarkUpdatesForElements(closestUpdatesFor)
  }
}

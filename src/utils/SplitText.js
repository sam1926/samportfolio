/**
 * Lightweight char splitter — wraps each character of an element's
 * text content in a <span class="char"> so GSAP can animate them.
 * Returns the array of span elements.
 */
export function SplitText(el) {
  const text = el.textContent || ''
  el.textContent = ''
  el.style.overflow = 'hidden'

  const chars = text.split('').map((char) => {
    const span = document.createElement('span')
    span.className = 'char'
    span.textContent = char === ' ' ? '\u00A0' : char
    span.style.display = 'inline-block'
    el.appendChild(span)
    return span
  })

  return chars
}

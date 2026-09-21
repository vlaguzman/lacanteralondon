const navbar = document.getElementById('navbar')
const navToggle = document.getElementById('navToggle')
const navMenu = document.getElementById('navMenu')

const SCROLL_THRESHOLD = 40

function updateNavbarOnScroll() {
  navbar.classList.toggle('navbar--solid', window.scrollY > SCROLL_THRESHOLD)
}

window.addEventListener('scroll', updateNavbarOnScroll, { passive: true })
updateNavbarOnScroll()

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('navbar__menu--open')
  navToggle.setAttribute('aria-expanded', String(isOpen))
})

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('navbar__menu--open')
    navToggle.setAttribute('aria-expanded', 'false')
  })
})

document.getElementById('year').textContent = new Date().getFullYear()

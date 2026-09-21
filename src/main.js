import { translations } from './i18n.js'

const navbar = document.getElementById('navbar')
const navToggle = document.getElementById('navToggle')
const navMenu = document.getElementById('navMenu')
const langButtons = document.querySelectorAll('[data-lang]')
const metaDescription = document.querySelector('meta[name="description"]')

const SCROLL_THRESHOLD = 40
const LANG_STORAGE_KEY = 'lacantera-lang'

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

function applyLanguage(lang) {
  const dict = translations[lang]
  if (!dict) return

  document.documentElement.lang = lang

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = dict[el.getAttribute('data-i18n')]
    if (value !== undefined) el.textContent = value
  })

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = dict[el.getAttribute('data-i18n-aria')]
    if (value !== undefined) el.setAttribute('aria-label', value)
  })

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const value = dict[el.getAttribute('data-i18n-alt')]
    if (value !== undefined) el.setAttribute('alt', value)
  })

  if (metaDescription) {
    const value = dict[metaDescription.getAttribute('data-i18n-content')]
    if (value !== undefined) metaDescription.setAttribute('content', value)
  }

  langButtons.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang))
  })

  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    // localStorage unavailable (private mode, etc.) — language just won't persist
  }
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang))
})

let savedLang = null
try {
  savedLang = localStorage.getItem(LANG_STORAGE_KEY)
} catch {
  // ignore
}

applyLanguage(savedLang === 'es' ? 'es' : 'en')

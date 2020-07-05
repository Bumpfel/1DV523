const activeLink = document.querySelector(`a[href='${window.location.pathname}']`)
if (activeLink) {
  activeLink.classList.add('activeLink')
}

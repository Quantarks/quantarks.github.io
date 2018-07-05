(function () {
  // check if dark theme
  if (window.localStorage.isDarkTheme === 'true') {
    toggleDarkTheme()
  }
})()

function toggleDarkTheme () {
  document.querySelector('html')
    .classList.toggle('dark')

  window.localStorage.setItem('isDarkTheme', document.querySelector('html').classList.contains('dark'))
}

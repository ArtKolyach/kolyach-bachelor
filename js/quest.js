function render() {
  const app = document.getElementById('app');
  app.textContent = 'Каркас работает';
}
window.addEventListener('load', render);
window.addEventListener('hashchange', render);

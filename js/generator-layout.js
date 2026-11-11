document.querySelectorAll('[data-controls-toggle]').forEach(toggle => {
  const controls = document.getElementById(toggle.getAttribute('aria-controls'));
  const layout = toggle.closest('.generator-layout');

  toggle.addEventListener('click', () => {
    controls.hidden = !controls.hidden;
    layout.classList.toggle('controls-hidden', controls.hidden);
    toggle.setAttribute('aria-expanded', String(!controls.hidden));
  });

  toggle.hidden = false;
});

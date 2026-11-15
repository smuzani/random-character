(() => {
  const header = document.querySelector('[data-generator-page]');
  const toolbar = document.querySelector('.generator-toolbar');
  const controls = document.getElementById('generator-controls');
  const layout = toolbar.closest('.generator-layout');
  const siteRoot = new URL('../', document.currentScript.src);
  const links = [
    ['create', 'Create', 'index.html'],
    ['dialogue', 'Dialogue', siteRoot.protocol === 'file:' ? 'dialogue/index.html' : 'dialogue/'],
    ['about', 'About', 'whatisthis.html'],
    ['roadmap', 'Roadmap', 'roadmap.html'],
  ];

  header.innerHTML = `
    <div class="header-container">
      <a class="site-brand" href="${new URL('index.html', siteRoot)}" aria-label="Random Character Generator">RCG</a>
      <nav class="main-nav" aria-label="Main navigation">
        ${links.map(([page, label, path]) =>
          `<a href="${new URL(path, siteRoot)}"${page === header.dataset.generatorPage ? ' aria-current="page"' : ''}>${label}</a>`
        ).join('')}
      </nav>
      <button id="open-account" class="header-account" type="button" aria-haspopup="dialog" aria-controls="account-dialog" hidden>
        <span id="account-label">Account</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'generator-toggle';
  toggle.setAttribute('aria-controls', controls.id);
  toggle.setAttribute('aria-expanded', String(!controls.hidden));
  toggle.setAttribute('aria-label', controls.getAttribute('aria-label'));
  toggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  toggle.addEventListener('click', () => {
    controls.hidden = !controls.hidden;
    layout.classList.toggle('controls-hidden', controls.hidden);
    toggle.setAttribute('aria-expanded', String(!controls.hidden));
  });
  toolbar.prepend(toggle);
})();

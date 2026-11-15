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
  // Phosphor Icons (MIT), regular Caret Down and Sidebar Simple.
  toggle.innerHTML = `
    <svg class="generator-toggle-caret" width="22" height="22" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
    </svg>
    <svg class="generator-toggle-sidebar" width="22" height="22" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z"/>
    </svg>`;
  toggle.addEventListener('click', () => {
    controls.hidden = !controls.hidden;
    layout.classList.toggle('controls-hidden', controls.hidden);
    toggle.setAttribute('aria-expanded', String(!controls.hidden));
  });
  toolbar.prepend(toggle);
})();

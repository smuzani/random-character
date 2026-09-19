// Read the rendered sheet: the text banks contain random choices, so sharing
// must never call the generator or characterSections() again.
(function () {
  'use strict';
  const byId = id => document.getElementById(id);
  const text = node => node.textContent.trim();

  function characterText() {
    const out = [text(byId('display-name'))];
    const concept = byId('display-concept');
    if (!concept.classList.contains('hidden') && text(concept)) out.push(text(concept));
    out.push('');
    document.querySelectorAll('.portrait-stats .stat-block').forEach(function (stat) {
      out.push(text(stat.querySelector('.stat-label')) + ': ' + text(stat.querySelector('.stat-value')));
    });
    document.querySelectorAll('.sheet-content .sheet-section').forEach(function (section) {
      if (section.classList.contains('hidden') || section.style.display === 'none') return;
      const lines = [];
      Array.from(section.children).forEach(function (child) {
        if (child.tagName === 'UL') {
          child.querySelectorAll('li').forEach(li => { if (text(li)) lines.push('- ' + text(li)); });
        } else if (child.tagName === 'P' && text(child)) {
          lines.push(text(child));
        } else if (child.tagName === 'DETAILS' && !child.classList.contains('hidden')) {
          lines.push('', text(child.querySelector('summary')));
          child.querySelectorAll('li').forEach(li => { if (text(li)) lines.push('- ' + text(li)); });
        }
      });
      if (lines.length) out.push('', text(section.querySelector('h3')), ...lines);
    });
    return out.join('\n') + '\n';
  }

  function fallbackCopy(value) {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    const focus = document.activeElement;
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { /* Report the clipboard failure below. */ }
    field.remove();
    if (focus) focus.focus();
    return copied;
  }

  const button = byId('share-character');
  // iPadOS can identify as a Mac. Touch alone must not enable sharing on desktop PCs.
  const mobile = (navigator.userAgentData && navigator.userAgentData.mobile) ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const nativeShare = mobile && window.isSecureContext && typeof navigator.share === 'function';
  button.title = nativeShare ? 'Share character' : 'Copy character text';
  let statusTimer;
  let busy = false;
  button.addEventListener('click', async function () {
    if (busy) return;
    busy = true;
    clearTimeout(statusTimer);
    const status = byId('export-status');
    status.textContent = '';
    try {
      const value = characterText();
      const data = { text: value };
      if (nativeShare) {
        try {
          if (!navigator.canShare || navigator.canShare(data)) {
            await navigator.share(data);
            return;
          }
        } catch (error) {
          // Dismissing the share sheet must not silently copy to the clipboard.
          if (error.name === 'AbortError') return;
          // Unsupported or blocked sharing falls back to copying the same text.
        }
      }
      let copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(value); copied = true; } catch (_) { /* Try the local fallback. */ }
      }
      if (!copied) copied = fallbackCopy(value);
      status.textContent = copied ? 'Copied.' : 'Could not copy. Select and copy the character text.';
      if (copied) statusTimer = setTimeout(() => { status.textContent = ''; }, 2500);
    } finally {
      busy = false;
    }
  });

}());

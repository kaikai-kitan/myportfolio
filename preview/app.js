(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const $ = (selector) => document.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const fallbackAudience = owns(data.audiences, data.defaultAudience) ? data.defaultAudience : Object.keys(data.audiences)[0];
  const requested = params.get('for');
  let audienceKey = requested && owns(data.audiences, requested) ? requested : fallbackAudience;
  const editorMode = params.get('edit') === '1';
  const escapeHTML = (text = '') => String(text).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);
  function safeLink(value, image = false) {
    if (!value) return '';
    try {
      const url = new URL(value, location.href);
      if (image) return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
      return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  }
  const orderedIds = (order, collection) => [...new Set(Array.isArray(order) ? order : [])].filter(id => owns(collection, id));
  const resolveProject = id => ({ ...data.projects[id], ...(data.audiences[audienceKey].projectOverrides?.[id] || {}) });
  const tags = (items = []) => `<ul class="tags">${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
  const artPath = project => `assets/${['physical','web','yatai'].includes(project.kind) ? project.kind : 'physical'}.svg`;
  function artwork(project, className) {
    const source = safeLink(project.image, true);
    return `<div class="${className}"><img src="${escapeHTML(source || artPath(project))}" alt="${escapeHTML(source ? (project.imageAlt || project.title) : '')}" loading="lazy">${source ? '' : '<span class="visual-label">VISUAL STUDY</span><span class="visual-note">イメージ見本 / 実際の作品画像に差し替え</span>'}</div>`;
  }
  function renderAudience(updateURL = false) {
    const audience = data.audiences[audienceKey];
    $('#hero-title').replaceChildren(...audience.title.map(line => { const span = document.createElement('span'); span.textContent = line; return span; }));
    $('#hero-eyebrow').textContent = audience.eyebrow;
    $('#hero-lead').textContent = audience.lead;
    $('#hero-focus').textContent = audience.focus;
    $('#about-description').textContent = audience.introduction || data.person.introduction;
    $('#vision').textContent = audience.vision || data.person.vision;
    const projectIds = orderedIds(audience.projectOrder, data.projects);
    $('#projects').innerHTML = projectIds.map((id, index) => {
      const project = resolveProject(id);
      return `<article class="project-card ${index === 0 ? 'featured' : ''}" data-kind="${escapeHTML(project.kind)}">${artwork(project, 'project-visual')}<div class="project-info"><p class="project-eyebrow"><span class="project-index">${String(index + 1).padStart(2, '0')}</span>${escapeHTML(project.category)}</p><h3>${escapeHTML(project.title)}</h3><p class="project-summary">${escapeHTML(project.summary)}</p>${tags(project.tags)}<button class="project-open" type="button" data-project="${escapeHTML(id)}" aria-label="${escapeHTML(project.title)}の制作プロセスを見る">制作プロセスを見る <span aria-hidden="true">↗</span></button></div></article>`;
    }).join('');
    $('#skills').innerHTML = orderedIds(audience.skillOrder, data.skills).map((id, index) => {
      const skill = data.skills[id];
      return `<article class="skill-card"><span class="skill-number">${String(index + 1).padStart(2, '0')} /</span><h4>${escapeHTML(skill.title)}</h4><p class="skill-english">${escapeHTML(skill.english)}</p><p>${escapeHTML(skill.text)}</p>${tags(skill.tools)}</article>`;
    }).join('');
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set('for', audienceKey);
      history.replaceState(null, '', url);
    }
    $('#audience-select').value = audienceKey;
    const viewerURL = new URL(location.href);
    viewerURL.searchParams.set('for', audienceKey);
    viewerURL.searchParams.delete('edit');
    viewerURL.hash = '';
    $('#view-link').href = viewerURL.href;
    document.title = `${data.person.name} — Portfolio`;
    const description = document.querySelector('meta[name="description"]');
    description.content = `${data.person.name}のポートフォリオ。${audience.lead}`;
    document.querySelector('meta[property="og:description"]').content = description.content;
    requestAnimationFrame(updateScroll);
  }
  const person = data.person;
  $('#person-name').textContent = person.name;
  $('#affiliation').textContent = person.affiliation;
  $('#about-affiliation').textContent = person.affiliation;
  $('#about-description').textContent = person.introduction;
  $('#vision').textContent = person.vision;
  $('#field-story').textContent = person.story;
  $('#github-link').href = safeLink(person.github);
  const email = String(person.email).replace(/[\r\n]/g, '');
  const mailto = `mailto:${email}`;
  $('#contact-link').href = mailto;
  $('#contact-email').href = mailto;
  $('#contact-email').textContent = email;
  if (safeLink(person.portrait, true)) {
    const img = document.createElement('img'); img.src = safeLink(person.portrait, true); img.alt = `${person.name}のプロフィール写真`; img.loading = 'lazy';
    $('#portrait').replaceChildren(img);
  }
  $('#template-badge').hidden = !data.template;
  $('#works-note').hidden = !data.template;
  if (!data.template) document.querySelector('meta[name="robots"]').remove();

  const dialog = $('#project-dialog');
  let previousFocus = null;
  const contentOrHint = (content, hint) => content ? `<p>${escapeHTML(content)}</p>` : `<p class="placeholder">${escapeHTML(hint)}</p>`;
  function openProject(id) {
    if (!owns(data.projects, id)) return;
    const project = resolveProject(id);
    previousFocus = document.activeElement;
    const meta = [ ['制作期間', project.period], ['チーム・体制', project.team], ['担当範囲', project.role], ['使用ツール', (project.tools || []).join(' / ')] ];
    const steps = [
      ['01 / CONTEXT', '課題と目的', project.problem, '誰が、どんな場面で困っていたのか。対象と解決したかった課題を2〜3行で記入します。'],
      ['02 / INTENTION', '設計の意図', project.intention, 'なぜこの仕組み・形・技術を選んだのか。比較した案や判断の理由を記入します。'],
      ['03 / PROCESS', '試作と工夫', project.process, '試作 → 検証 → 改善の流れと、自分が担当した具体的な工夫を記入します。'],
      ['04 / OUTCOME', '成果と結果', project.outcome, '確認できる結果、利用者の反応、検証で分かったことを記入します。数値は根拠があるものだけを記載します。'],
      ['05 / LEARNING', '学びと次の一歩', project.learning, 'うまくいったこと、残った課題、次にどう改善したいかを簡潔に記入します。']
    ];
    const processImages = (project.processImages || []).filter(item => safeLink(item.src, true));
    const supporting = processImages.length ? processImages.map(item => `<figure><img src="${escapeHTML(safeLink(item.src, true))}" alt="${escapeHTML(item.alt || '')}" loading="lazy"><figcaption>${escapeHTML(item.caption || '')}</figcaption></figure>`).join('') : '<div class="process-placeholder"><span aria-hidden="true">＋</span><small>アイデアスケッチ・設計図</small></div><div class="process-placeholder"><span aria-hidden="true">＋</span><small>試作品・検証の様子</small></div>';
    $('#detail-content').innerHTML = `<p class="eyebrow">${escapeHTML(project.category)}</p><h2 id="detail-title">${escapeHTML(project.title)}</h2><p class="detail-summary">${escapeHTML(project.summary)}</p>${artwork(project, 'detail-visual')}<dl class="detail-meta">${meta.map(([label,value]) => `<div><dt>${label}</dt><dd${value ? '' : ' class="placeholder"'}>${escapeHTML(value || '内容を追加予定')}</dd></div>`).join('')}</dl>${steps.map(([english, label, content, hint], index) => `<section class="detail-story"><h3><small>${english}</small>${label}</h3>${contentOrHint(content, hint)}</section>${index === 2 ? `<div class="process-images">${supporting}</div>` : ''}`).join('')}${safeLink(project.link) ? `<div class="detail-external"><a class="text-link" href="${escapeHTML(safeLink(project.link))}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.linkLabel || '関連リンク')} <span aria-hidden="true">↗</span></a></div>` : ''}`;
    dialog.showModal(); dialog.scrollTop = 0; document.body.classList.add('modal-open'); $('#close-dialog').focus();
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-project]');
    if (trigger && !dialog.open) openProject(trigger.dataset.project);
  });
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  });

  $('#audience-select').innerHTML = Object.entries(data.audiences).map(([key, audience]) => `<option value="${escapeHTML(key)}">${escapeHTML(audience.company ? `${audience.company} / ${audience.label}` : audience.label)}</option>`).join('');
  $('#editor-panel').hidden = !editorMode;
  $('#audience-select').addEventListener('change', event => {
    audienceKey = event.target.value; renderAudience(true);
    $('#editor-status').textContent = `${data.audiences[audienceKey].label}の構成に変更しました。`;
  });
  function toggleEditor(expanded) {
    $('#editor-toggle').setAttribute('aria-expanded', String(expanded));
    $('#editor-body').hidden = !expanded;
    $('#editor-indicator').textContent = expanded ? '−' : '＋';
  }
  $('#editor-toggle').addEventListener('click', () => toggleEditor($('#editor-toggle').getAttribute('aria-expanded') !== 'true'));
  if (matchMedia('(max-width:700px)').matches) toggleEditor(false);
  $('#copy-link').addEventListener('click', async () => {
    const url = $('#view-link').href;
    try { await navigator.clipboard.writeText(url); $('#editor-status').textContent = '閲覧用URLをコピーしました。'; }
    catch { $('#editor-status').textContent = `コピーできませんでした。「閲覧用表示」のURLをお使いください：${url}`; }
  });
  window.addEventListener('popstate', () => {
    const key = new URLSearchParams(location.search).get('for');
    const nextKey = key && owns(data.audiences, key) ? key : fallbackAudience;
    if (nextKey !== audienceKey) { audienceKey = nextKey; renderAudience(); }
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let framePending = false;
  function updateScroll() {
    framePending = false;
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.transform = `scaleX(${maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0})`;
    const field = $('#field').getBoundingClientRect();
    const track = $('.cart-track');
    const trackWidth = track.clientWidth;
    const travel = Math.max(0, trackWidth - 190);
    const position = reducedMotion.matches ? .64 : Math.max(0, Math.min(1, (innerHeight - field.top) / (innerHeight + field.height)));
    $('#cart').style.transform = `translateX(${20 + travel * position}px)`;
  }
  function scheduleScroll() { if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); } }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  window.addEventListener('load', scheduleScroll);
  reducedMotion.addEventListener('change', scheduleScroll);
  renderAudience();
})();

(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const $ = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const escape = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);
  const safeURL = value => {
    if (!value) return '';
    try { const url = new URL(value, location.href); return ['https:','http:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };
  const missing = (value, hint = '記入待ち') => value ? escape(value) : `<span class="missing">${escape(hint)}</span>`;
  const imageIcon = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="8" y="11" width="48" height="42" rx="2"/><circle cx="24" cy="24" r="5"/><path d="m9 46 14-12 9 7 10-14 14 19"/></svg>';
  const validIds = (order, collection) => [...new Set(order || [])].filter(id => owns(collection, id));
  const defaultKey = owns(data.audiences, data.defaultAudience) ? data.defaultAudience : Object.keys(data.audiences)[0];
  const readKey = () => {
    const key = new URLSearchParams(location.search).get('for');
    return key && owns(data.audiences, key) ? key : defaultKey;
  };
  let audienceKey = readKey();
  let featuredOverride = new URLSearchParams(location.search).get('featured');
  const audienceProjectIds = () => validIds([data.audiences[audienceKey].featuredProject, ...(data.audiences[audienceKey].galleryOrder || [])], data.projects);
  const selectedFeatured = () => {
    const ids = audienceProjectIds();
    return ids.includes(featuredOverride) ? featuredOverride : ids[0];
  };
  const resolveProject = id => ({ ...data.projects[id], ...(data.audiences[audienceKey].projectOverrides?.[id] || {}) });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let skillObserver;

  function projectMarkup(project, index) {
    const image = safeURL(project.image);
    const artwork = image
      ? `<img class="project-image" src="${escape(image)}" alt="${escape(project.imageAlt || project.title)}" loading="lazy">`
      : `<div class="project-placeholder">${imageIcon}<p>${escape(project.imageCaption || '作品の写真・画像')}</p><small>PHOTO PLACEHOLDER</small></div>`;
    const meta = [
      ['制作期間', project.period], ['体制・人数', project.team],
      ['担当範囲', project.role], ['使用技術', (project.tools || []).join(' / ')], ['成果', project.outcome]
    ];
    const detailRows = [
      ['課題・目的', project.problem, '対象と解決したかった課題を記入します。'],
      ['設計の意図', project.intention, 'この技術・仕組みを選んだ理由を記入します。'],
      ['制作・検証の過程', project.process, '試作、検証、改善の流れを記入します。'],
      ['学び・次の改善', project.learning, '得られた知見と今後の改善点を記入します。']
    ];
    const images = (project.processImages || []).filter(item => safeURL(item.src));
    const processImages = images.length
      ? images.map(item => `<figure><img src="${escape(safeURL(item.src))}" alt="${escape(item.alt || '')}" loading="lazy"><figcaption>${escape(item.caption || '')}</figcaption></figure>`).join('')
      : '<div class="process-placeholder">設計図・スケッチを追加</div><div class="process-placeholder">試作品・検証時の写真を追加</div>';
    return `<article class="project ${index % 2 ? 'reverse' : ''}" aria-labelledby="project-title-${index}"><div class="wrap"><div class="project-layout"><figure class="project-figure">${artwork}<figcaption>${escape(project.imageCaption || '作品画像')}</figcaption></figure><div class="project-copy"><p class="project-kicker"><span class="project-number">${typeof index === 'number' ? String(index + 1).padStart(2,'0') : 'DETAIL'}</span>${escape(project.category)}</p><h3 id="project-title-${index}">${escape(project.title)}</h3><p class="project-summary">${missing(project.summary, '概要を記入予定：何を、誰のためにつくったかを説明します。')}</p><dl class="project-meta">${meta.map(([label,value]) => `<div><dt>${label}</dt><dd>${missing(value)}</dd></div>`).join('')}</dl>${safeURL(project.link) ? `<a class="project-source" href="${escape(safeURL(project.link))}" target="_blank" rel="noopener noreferrer">${escape(project.linkLabel || '関連リンク')} ↗</a>` : ''}</div></div><details class="project-details"><summary>${escape(project.title)}：制作過程・補足資料を読む</summary><div class="detail-body">${detailRows.map(([label,value,hint]) => `<div class="detail-row"><h4>${label}</h4><p>${missing(value, hint)}</p></div>`).join('')}<div class="process-images">${processImages}</div></div></details></div></article>${storyMarkup(project, index)}`;
  }
  function storyMarkup(project, index) {
    const story = project.behindScenes;
    if (!story) return '';
    const steps = [
      ['起', '課題・失敗', story.problem, '実際に直面した問題や失敗、その状況を記入します。'],
      ['承・転', '対応・解決', story.solution, '原因の調査、試した方法、自分が行った対応を記入します。'],
      ['結', '得られた教訓', story.lesson, '結果と、その後の設計や運営に活かしたことを記入します。']
    ];
    return `<section class="behind-scenes" aria-labelledby="story-title-${index}"><div class="wrap"><div class="behind-heading"><span class="behind-label">裏メニュー</span><div><h3 id="story-title-${index}">${escape(story.title || '開発中の課題と解決策')}</h3><p>${escape(project.title)}${story.title ? '' : ' ／ エピソードを記入予定'}</p></div></div><div class="story-grid">${steps.map(([step,label,value,hint]) => `<div class="story-step"><h4><span>${step}</span>${label}</h4><p>${missing(value,hint)}</p></div>`).join('')}</div></div></section>`;
  }

  function renderSkills(audience) {
    skillObserver?.disconnect();
    let index = 0;
    const labels = ['未設定', '学習中', '制作経験あり', '自力で設計・改善'];
    $('#skill-board').innerHTML = validIds(audience.skillOrder, data.skills).map(id => {
      const group = { ...data.skills[id], ...(audience.skillOverrides?.[id] || {}) };
      return group.items.map(skill => {
        const level = Number.isInteger(skill.level) && skill.level >= 1 && skill.level <= 3 ? skill.level : 0;
        const accessible = level ? `熟達度 ${level}/3：${labels[level]}` : '熟達度は未設定';
        return `<article class="skill-plaque" style="--delay:${(index++ % 6) * 75}ms"><span class="skill-category">${escape(group.category)}</span><h3 class="skill-name ${(skill.name.length > 15 || skill.name.includes('\n')) ? 'long' : ''}">${escape(skill.name)}</h3><div class="lemons" role="img" aria-label="${accessible}">${[1,2,3].map(i => `<span aria-hidden="true" class="lemon ${i > level ? 'empty' : ''}">🍋</span>`).join('')}</div><p class="skill-level">${level ? labels[level] : '熟達度：未設定'}</p><p class="skill-evidence">${escape(skill.evidence || '使用例を記入予定')}</p></article>`;
      }).join('');
    }).join('');
    if (!reduced.matches && 'IntersectionObserver' in window) {
      const plaques = all('.skill-plaque');
      plaques.forEach(plaque => plaque.classList.add('waiting'));
      skillObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('waiting');
        entry.target.classList.add('revealed');
        skillObserver.unobserve(entry.target);
      }), { threshold: .12 });
      plaques.forEach(plaque => skillObserver.observe(plaque));
    }
  }

  function renderAudience(updateURL = false) {
    const audience = data.audiences[audienceKey];
    $('#introduction').textContent = audience.introduction || data.person.introduction;
    const facts = [
      ['所属', `${data.person.affiliation}${data.person.grade ? ' / ' + data.person.grade : ''}`],
      ['研究', audience.research || data.person.research],
      ['関心領域', audience.interests || data.person.interests]
    ];
    $('#profile-facts').innerHTML = facts.map(([label,value]) => `<div><dt>${label}</dt><dd>${missing(value,'研究テーマを記入予定')}</dd></div>`).join('');
    const featuredId = selectedFeatured();
    const availableIds = audienceProjectIds();
    $('#projects').innerHTML = featuredId ? projectMarkup(resolveProject(featuredId), 0) : '<p class="wrap empty-gallery">メイン実績を設定してください。</p>';
    const galleryIds = availableIds.filter(id => id !== featuredId);
    $('#gallery-grid').innerHTML = galleryIds.length ? galleryIds.map(id => galleryMarkup(resolveProject(id), id)).join('') : '<p class="empty-gallery">その他の実績は準備中です。</p>';
    $('#featured-select').innerHTML = availableIds.map(id => `<option value="${escape(id)}">${escape(resolveProject(id).title)}</option>`).join('');
    $('#featured-select').value = featuredId || '';
    renderSkills(audience);
    if (updateURL) {
      const url = new URL(location.href); url.searchParams.set('for',audienceKey);
      if (featuredOverride && availableIds.includes(featuredOverride)) url.searchParams.set('featured',featuredOverride); else url.searchParams.delete('featured');
      history.replaceState(null,'',url);
    }
    $('#audience-select').value = audienceKey;
    const viewer = new URL(location.href);
    viewer.searchParams.set('for',audienceKey); viewer.searchParams.delete('edit'); viewer.hash = '';
    if (featuredOverride && availableIds.includes(featuredOverride)) viewer.searchParams.set('featured',featuredOverride); else viewer.searchParams.delete('featured');
    $('#view-link').href = viewer.href;
  }

  function galleryMarkup(project, id) {
    const image = safeURL(project.image);
    const visual = image
      ? `<img class="project-image" src="${escape(image)}" alt="${escape(project.imageAlt || project.title)}" loading="lazy">`
      : `<div class="project-placeholder">${imageIcon}<p>${escape(project.imageCaption || '作品画像')}</p></div>`;
    return `<article class="gallery-card">${visual}<div class="gallery-copy"><p class="gallery-category">${escape(project.category)}</p><h3>${escape(project.title)}</h3><p>${missing(project.summary,'作品・活動の概要を記入予定です。')}</p><button class="gallery-open" type="button" data-gallery-project="${escape(id)}" aria-label="${escape(project.title)}の詳細を見る">詳しく見る <span aria-hidden="true">↗</span></button></div></article>`;
  }
  function renderHobbies() {
    $('#hobbies-grid').innerHTML = (data.hobbies || []).map(hobby => `<article class="hobby-card">${safeURL(hobby.image) ? `<img class="hobby-image" src="${escape(safeURL(hobby.image))}" alt="${escape(hobby.imageAlt || hobby.title)}" loading="lazy">` : `<div class="hobby-placeholder">${imageIcon}<span>趣味の写真</span></div>`}<div><h3>${escape(hobby.title)}</h3><p>${missing(hobby.description,'好きなこと・普段の活動について記入予定です。')}</p></div></article>`).join('') || '<p class="empty-gallery">趣味の紹介は準備中です。</p>';
  }
  const galleryDialog = $('#gallery-dialog');
  let galleryTrigger;
  $('#gallery-grid').addEventListener('click', event => {
    const trigger = event.target.closest('[data-gallery-project]');
    if (!trigger || galleryDialog.open || !audienceProjectIds().includes(trigger.dataset.galleryProject)) return;
    galleryTrigger = trigger;
    $('#gallery-detail').innerHTML = projectMarkup(resolveProject(trigger.dataset.galleryProject), 'detail');
    galleryDialog.showModal(); galleryDialog.scrollTop = 0;
    document.body.classList.add('dialog-open'); $('#close-gallery').focus();
  });
  $('#close-gallery').addEventListener('click', () => galleryDialog.close());
  galleryDialog.addEventListener('click', event => {
    if (event.target !== galleryDialog) return;
    const rect = galleryDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) galleryDialog.close();
  });
  galleryDialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (galleryTrigger?.isConnected) galleryTrigger.focus({preventScroll:true});
  });

  function renderChapters() {
    $('#chapters').innerHTML = data.chapters.map((chapter,index) => `<article class="chapter"><div class="chapter-photo">${safeURL(chapter.image) ? `<img src="${escape(safeURL(chapter.image))}" alt="${escape(chapter.alt || chapter.caption)}" loading="lazy">` : `<div class="chapter-placeholder">${imageIcon}<span>PHOTO ${String(index+1).padStart(2,'0')}</span></div>`}</div><span class="chapter-number">${String(index+1).padStart(2,'0')}</span><div class="chapter-content"><p class="chapter-label">${escape(chapter.label)}</p><h3>${escape(chapter.title)}</h3><p class="chapter-caption">${escape(chapter.caption)}</p><button class="chapter-toggle" type="button" aria-expanded="false" aria-controls="chapter-detail-${index}">${escape(chapter.label)}の詳細 <span aria-hidden="true">＋</span></button><div class="chapter-detail" id="chapter-detail-${index}" tabindex="0" hidden>${escape(chapter.detail || '写真にまつわる活動内容・自分の役割・具体的なエピソードを記入予定です。')}</div></div></article>`).join('');
    const canHover = matchMedia('(hover:hover) and (pointer:fine)');
    all('.chapter').forEach(chapter => {
      let pinned = false;
      let suppressHover = false;
      const button = chapter.querySelector('button');
      const detail = chapter.querySelector('.chapter-detail');
      function expand(open) {
        chapter.classList.toggle('expanded',open);
        button.setAttribute('aria-expanded',String(open));
        button.querySelector('span').textContent = open ? '−' : '＋';
        detail.hidden = !open;
      }
      chapter.addEventListener('pointerenter', () => { if (canHover.matches && !suppressHover) expand(true); });
      chapter.addEventListener('pointerleave', () => { suppressHover = false; if (!pinned) expand(false); });
      chapter.addEventListener('focusout', event => { if (!pinned && !chapter.contains(event.relatedTarget)) expand(false); });
      button.addEventListener('click', () => { pinned = !pinned; suppressHover = !pinned; expand(pinned); });
    });
  }

  $('#entrance-title').replaceChildren(...data.entrance.title.map(line => { const span = document.createElement('span'); span.textContent = line; return span; }));
  const curtainImage = safeURL(data.entrance.curtainImage);
  if (curtainImage) {
    $('#curtain').classList.add('custom-curtain');
    $('#curtain').style.backgroundImage = `url(${JSON.stringify(curtainImage)})`;
  }
  if (safeURL(data.entrance.welcomeImage)) {
    $('#welcome-image').src = safeURL(data.entrance.welcomeImage);
    $('#welcome-image').alt = data.entrance.welcomeAlt;
    $('#welcome-photo-note').hidden = true;
  }
  $('#welcome-name').textContent = data.person.name;
  $('#welcome-affiliation').textContent = data.person.affiliation;
  $('#person-name').textContent = data.person.name;
  $('#person-reading').textContent = data.person.reading;
  $('#person-roman').textContent = data.person.roman;
  $('#contact-email').textContent = data.person.email;
  $('#contact-email').href = `mailto:${data.person.email.replace(/[\r\n]/g,'')}`;
  $('#github-link').href = safeURL(data.person.github);
  if (safeURL(data.person.resume)) $('#resume-action').innerHTML = `<a href="${escape(safeURL(data.person.resume))}" download>PDF版レジュメをダウンロード ↓</a>`;
  ['#template-badge','#skills-note','#works-note'].forEach(selector => { $(selector).hidden = !data.template; });

  $('#audience-select').innerHTML = Object.entries(data.audiences).map(([id,audience]) => `<option value="${escape(id)}">${escape(audience.company ? `${audience.company} / ${audience.label}` : audience.label)}</option>`).join('');
  $('#editor-panel').hidden = new URLSearchParams(location.search).get('edit') !== '1';
  $('#editor-toggle').addEventListener('click', () => {
    const open = $('#editor-toggle').getAttribute('aria-expanded') !== 'true';
    $('#editor-toggle').setAttribute('aria-expanded',String(open)); $('#editor-body').hidden = !open;
    $('#editor-indicator').textContent = open ? '−' : '＋';
  });
  $('#audience-select').addEventListener('change', event => {
    audienceKey = event.target.value; featuredOverride = null; renderAudience(true);
    $('#editor-status').textContent = `${data.audiences[audienceKey].label}の構成に変更しました。`;
  });
  $('#featured-select').addEventListener('change', event => {
    featuredOverride = event.target.value; renderAudience(true);
    $('#editor-status').textContent = `${resolveProject(selectedFeatured()).title}をメイン実績に設定しました。`;
  });
  $('#copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#view-link').href); $('#editor-status').textContent = '閲覧用URLをコピーしました。'; }
    catch { $('#editor-status').textContent = `「閲覧用表示」のリンクをご利用ください：${$('#view-link').href}`; }
  });
  window.addEventListener('popstate', () => {
    const next = readKey();
    const nextFeatured = new URLSearchParams(location.search).get('featured');
    if (next !== audienceKey || nextFeatured !== featuredOverride) {
      audienceKey = next; featuredOverride = nextFeatured; renderAudience();
    }
  });

  // 暖簾は最初のクリックだけで開く。スクロール量には連動させない。
  let entered = false;
  let curtainTimer;
  const curtain = $('#curtain');
  const openButton = $('#open-curtain');
  $('.welcome-scene').inert = true;
  function finishEntrance() {
    clearTimeout(curtainTimer);
    curtain.hidden = true;
    $('.welcome-scene').inert = false;
    // 開いている間に別セクションへ進んだ場合、フォーカスを入口へ戻さない。
    if ($('.entrance').getBoundingClientRect().bottom > innerHeight * .4) $('#welcome-next').focus({preventScroll:true});
  }
  function enter() {
    if (entered) return;
    entered = true;
    openButton.disabled = true;
    $('.entrance').classList.add('is-entered');
    curtain.classList.add('is-opening');
    curtain.inert = true;
    if (reduced.matches) finishEntrance();
    else curtainTimer = setTimeout(finishEntrance, 1150);
  }
  openButton.addEventListener('click',enter);
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      skillObserver?.disconnect(); all('.skill-plaque').forEach(plaque => plaque.classList.remove('waiting'));
      if (entered && !curtain.hidden) finishEntrance();
    }
  });
  renderChapters();
  renderHobbies();
  renderAudience();
})();

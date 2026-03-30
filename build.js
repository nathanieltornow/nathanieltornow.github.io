const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const cv = yaml.load(fs.readFileSync(path.join(__dirname, 'cv.yaml'), 'utf8'));

function authors(list) {
  return list.map(a =>
    a === cv.name ? `<span class="me">${a}</span>` : a
  ).join(', ');
}

function pubLinks(pub) {
  const parts = [];
  if (pub.url) parts.push(`<a href="${pub.url}">paper</a>`);
  if (pub.preprint) parts.push(`<a href="${pub.preprint}">preprint</a>`);
  if (pub.slides) parts.push(`<a href="${pub.slides}">slides</a>`);
  // if (pub.video) parts.push(`<a href="${pub.video}">video</a>`);
  if (pub.code) parts.push(`<a href="${pub.code}">code</a>`);
  return parts.length ? ` [${parts.join(', ')}]` : '';
}

const publicationsHtml = cv.publications.map(p => `
      <li>
        <div class="pub-row">
          <span class="pub-venue">${p.venue}</span>
          <div>
            <span class="pub-title">${p.title}</span>
            <br>${authors(p.authors)}
            <br><span class="secondary">${pubLinks(p).trim()}</span>${p.note ? `\n            <br><span class="award">${p.note}</span>` : ''}
          </div>
        </div>
      </li>`).join('\n');

const experienceHtml = cv.experience.filter(e => e.selected !== false).map(e => `
      <li>
        <div class="entry-header">
          <span><strong>${e.position}</strong>, ${e.organization}</span>
          <span class="secondary">${e.period}</span>
        </div>${e.details ? '\n        <div class="secondary">' + e.details.join('; ') + '</div>' : ''}
      </li>`).join('\n');

const educationHtml = cv.education.map(e => {
  let sub = '';
  if (e.note) sub += `\n        <div class="secondary">${e.note}</div>`;
  if (e.thesis) {
    const thesisText = e.thesisUrl
      ? `Thesis: <a href="${e.thesisUrl}">${e.thesis}</a>`
      : `Thesis: ${e.thesis}`;
    sub += `\n        <div class="secondary">${thesisText}</div>`;
  }
  return `
      <li>
        <div class="entry-header">
          <span><strong>${e.degree}</strong>, ${e.institution}</span>
          <span class="secondary">${e.period}</span>
        </div>${sub}
      </li>`;
}).join('\n');

const linksHtml = [
  `<a href="mailto:${cv.email}">${cv.email}</a>`,
  ...cv.links.map(l => `<a href="${l.url}">${l.label}</a>`)
].join(' / ');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${cv.name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.7;
      color: #1a1a1a;
      background: #fafafa;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 4rem 1.5rem 3rem;
    }

    /* Header */
    header { margin-bottom: 3rem; }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
    }

    .header-text { flex: 1; }

    .avatar {
      width: 160px;
      height: 160px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }


    h1 {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }

    .about {
      color: #444;
      margin-bottom: 1rem;
    }

    .about a { color: #444; }
    .about a:hover { color: #1a1a1a; }

    .cv-link {
      font-size: 13px;
      font-weight: 500;
      margin-top: 0.5rem;
      display: inline-block;
    }

    .links {
      font-size: 13px;
      color: #666;
    }

    .links a { color: #666; }
    .links a:hover { color: #1a1a1a; }

    /* Sections */
    section { margin-bottom: 2.5rem; }

    h2 {
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #999;
      margin-bottom: 1rem;
      padding-bottom: 0.4rem;
      border-bottom: 1px solid #e5e5e5;
    }

    ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    /* Links */
    a {
      color: #1a1a1a;
      text-decoration-line: underline;
      text-decoration-thickness: 0.06em;
      text-decoration-color: rgba(26, 26, 26, 0.38);
      text-underline-offset: 2px;
    }

    a:hover { text-decoration: underline; }

    /* Publications */
    .pub-row {
      display: flex;
      gap: 1rem;
      align-items: baseline;
    }

    .pub-venue {
      flex-shrink: 0;
      font-weight: 700;
      font-size: 13px;
      min-width: 5.5rem;
      color: #1a1a1a;
    }

    .award {
      font-size: 14px;
      font-weight: 700;
      color: #3f6f8e;
    }
    .pub-title { font-weight: 500; }
    .me { text-decoration: underline; text-underline-offset: 2px; }

    /* Entry layout */
    .entry-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .secondary { color: #666; font-size: 13px; }

    /* Footer */
    footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e5e5;
      font-size: 12px;
      color: #999;
    }

    @media (max-width: 600px) {
      body { font-size: 13px; }
      .container { padding: 2rem 1.25rem; }
      h1 { font-size: 1.3rem; }
      .header-row { flex-direction: column-reverse; gap: 1rem; }
      .avatar { width: 80px; height: 80px; }
      .entry-header { flex-direction: column; gap: 0; }
      .pub-row { flex-direction: column; gap: 0.25rem; }
      .pub-venue { min-width: auto; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-row">
        <div class="header-text">
          <h1>${cv.name}</h1>
          <p class="about">${cv.about.trim()}</p>
          <div class="links">${linksHtml}</div>
          <span class="cv-link">[<a href="cv.pdf">CV</a>]</span>
        </div>
        <img class="avatar" src="avatar.png" alt="${cv.name}">
      </div>
    </header>

    <section>
      <h2>Publications</h2>
      <ul>
${publicationsHtml}
      </ul>
    </section>

    <section>
      <h2>Education</h2>
      <ul>
${educationHtml}
      </ul>
    </section>

    <section>
      <h2>Selected Experience</h2>
      <ul>
${experienceHtml}
      </ul>
    </section>

    <footer>${cv.name}</footer>
  </div>
</body>
</html>`;

const dist = path.join(__dirname, 'dist');
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), html);

const staticDir = path.join(__dirname, 'static');
if (fs.existsSync(staticDir)) {
  for (const file of fs.readdirSync(staticDir)) {
    fs.copyFileSync(path.join(staticDir, file), path.join(dist, file));
  }
}

console.log('Built dist/index.html');

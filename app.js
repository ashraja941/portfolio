const data = JSON.parse(document.getElementById('profile-data').textContent);

function typeHeaders() {
  document.querySelectorAll('section h2').forEach(h => {
    const text = h.dataset.typed || h.textContent;
    h.textContent = '';
    new Typed(h, { strings: [text], typeSpeed: 40, showCursor: false });
  });
}

function buildIntro() {
  const c = document.getElementById('intro-content');
  const nameEl = document.createElement('h1');
  nameEl.id = 'full-name';
  c.appendChild(nameEl);
  new Typed(nameEl, { strings: [data.full_name], typeSpeed: 60 });

  const tag = document.createElement('p');
  tag.textContent = data.tagline;
  c.appendChild(tag);

  const bio = document.createElement('p');
  bio.textContent = data.bio;
  c.appendChild(bio);

  const loc = document.createElement('p');
  loc.textContent = data.location;
  c.appendChild(loc);
}

function buildExperience() {
  const container = document.getElementById('experience-content');
  data.jobs.forEach(job => {
    const div = document.createElement('div');
    div.className = 'job';
    const title = document.createElement('h3');
    title.textContent = `${job.title} @ ${job.company}`;
    div.appendChild(title);
    const dates = document.createElement('p');
    dates.textContent = `${job.start_date} - ${job.end_date}`;
    div.appendChild(dates);
    const ul = document.createElement('ul');
    job.bullets.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      ul.appendChild(li);
    });
    div.appendChild(ul);
    container.appendChild(div);
  });
}

function buildProjects() {
  const container = document.getElementById('projects-content');
  data.projects.forEach(pr => {
    const card = document.createElement('div');
    card.className = 'project';
    const title = document.createElement('h3');
    title.textContent = pr.name;
    card.appendChild(title);
    const p = document.createElement('p');
    p.textContent = pr.summary;
    card.appendChild(p);
    const links = document.createElement('p');
    links.innerHTML = `<a href="${pr.repo_url}">repo</a> | <a href="${pr.live_url}">live</a>`;
    card.appendChild(links);
    container.appendChild(card);
  });
}

function buildSkills() {
  const container = document.getElementById('skills-content');
  for (const [cat, vals] of Object.entries(data.skills)) {
    const div = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = cat;
    div.appendChild(title);
    const span = document.createElement('p');
    span.textContent = vals.join(', ');
    div.appendChild(span);
    container.appendChild(div);
  }
}

function buildEducation() {
  const container = document.getElementById('education-content');
  data.schools.forEach(s => {
    const div = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = `${s.degree} ${s.field}`;
    div.appendChild(title);
    const inst = document.createElement('p');
    inst.textContent = `${s.institution} - ${s.location}`;
    div.appendChild(inst);
    const grad = document.createElement('p');
    grad.textContent = `Class of ${s.grad_year}`;
    div.appendChild(grad);
    container.appendChild(div);
  });
}

function buildContact() {
  const c = document.getElementById('contact-content');
  const email = document.createElement('button');
  email.textContent = data.contact.email;
  email.addEventListener('click', () => {
    navigator.clipboard.writeText(data.contact.email);
    email.style.color = 'var(--accent1)';
  });
  c.appendChild(email);
  const links = document.createElement('p');
  links.innerHTML = `<a href="${data.contact.linkedin_url}">LinkedIn</a> | <a href="${data.contact.github_url}">GitHub</a>`;
  c.appendChild(links);
}

buildIntro();
buildExperience();
buildProjects();
buildSkills();
buildEducation();
buildContact();
typeHeaders();

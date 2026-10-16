(() => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();


/* Fixed prompt + command-only typewriter. Only the command and output erase character-by-character. */
(() => {
  const screen = document.getElementById('terminalScreen');
  if (!screen) return;

  const sequence = [
    ['whoami', ['Md Kamrujjaman — NiloySec', 'OSINT Researcher · CSE Student at DUET']],
    ['cat profile.txt', ['Focus: Open-source intelligence and digital investigations', 'Approach: Find · Assess · Verify · Report']],
    ['ls capabilities/', ['reverse-image-research/  digital-footprint-analysis/', 'username-research/  geolocation/  source-verification/']],
    ['cat methodology.txt', ['Collect public sources → cross-check evidence → document findings', 'Verified facts are separated from assumptions.']],
    ['ls projects/', ['selected-case-studies/  investigation-workflows/', 'Confidential client information is not published.']],
    ['cat tools.txt', ['Browser-based research · Reverse image search · Public-source verification', 'Python · Git & GitHub · Web technologies']],
    ['whoami --contact', ['LinkedIn: linkedin.com/in/n1l0y', 'Fiverr: fiverr.com/niloysec · GitHub: github.com/NiloySec']]
  ];

  let generation = 0;
  let timerId = null;
  const sleep = ms => new Promise(resolve => { timerId = setTimeout(resolve, ms); });

  async function typeText(el, text, id, delay = 48) {
    el.textContent = '';
    for (const ch of text) {
      if (id !== generation) return false;
      el.textContent += ch;
      await sleep(delay);
    }
    return id === generation;
  }

  async function eraseText(el, id, delay = 12) {
    while (el.textContent.length) {
      if (id !== generation) return false;
      el.textContent = el.textContent.slice(0, -1);
      await sleep(delay);
    }
    return id === generation;
  }

  async function run() {
    const id = ++generation;
    if (timerId) clearTimeout(timerId);

    // One stable command row and a separate output area inside the same terminal box.
    screen.replaceChildren();
    const commandRow = document.createElement('div');
    commandRow.className = 'terminal-line terminal-command';
    const prompt = document.createElement('span');
    prompt.className = 'terminal-fixed-prompt';
    prompt.textContent = 'root@niloysec:~$ ';
    const command = document.createElement('span');
    command.className = 'terminal-command-text';
    commandRow.append(prompt, command);

    const output = document.createElement('div');
    output.className = 'terminal-output-group';
    screen.append(commandRow, output);

    while (id === generation) {
      for (const [cmd, lines] of sequence) {
        if (id !== generation) return;
        output.replaceChildren();
        if (!(await typeText(command, cmd, id, 52))) return;

        await sleep(260);
        for (const lineText of lines) {
          if (id !== generation) return;
          const line = document.createElement('div');
          line.className = 'terminal-line terminal-output';
          output.appendChild(line);
          if (!(await typeText(line, lineText, id, 17))) return;
        }

        await sleep(1000);
        for (const line of Array.from(output.children)) {
          if (!(await eraseText(line, id, 10))) return;
        }
        output.replaceChildren();
        if (!(await eraseText(command, id, 10))) return;
        await sleep(220);
      }
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    screen.replaceChildren();
    const row = document.createElement('div');
    row.className = 'terminal-line terminal-command';
    row.textContent = 'root@niloysec:~$ whoami';
    const out = document.createElement('div');
    out.className = 'terminal-line terminal-output';
    out.textContent = 'Md Kamrujjaman — NiloySec';
    screen.append(row, out);
  } else {
    run();
  }
})();

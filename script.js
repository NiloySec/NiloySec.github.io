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


/* One upper terminal area: command and output type, erase character-by-character, then next command. */
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

  async function typeText(el, text, id, delay = 42) {
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
    const command = document.createElement('div');
    command.className = 'terminal-line terminal-command';
    const output = document.createElement('div');
    output.className = 'terminal-output-group';
    screen.replaceChildren(command, output);

    while (id === generation) {
      for (const [cmd, lines] of sequence) {
        if (id !== generation) return;
        output.replaceChildren();
        if (!(await typeText(command, 'root@niloysec:~$ ' + cmd, id))) return;
        await sleep(220);

        for (const lineText of lines) {
          const line = document.createElement('div');
          line.className = 'terminal-line terminal-output';
          output.appendChild(line);
          if (!(await typeText(line, lineText, id, 18))) return;
        }

        await sleep(850);
        // Erase output and command from the same upper terminal, one character at a time.
        for (const line of Array.from(output.children)) {
          if (!(await eraseText(line, id))) return;
        }
        output.replaceChildren();
        if (!(await eraseText(command, id))) return;
        await sleep(180);
      }
    }
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    run();
  } else {
    screen.textContent = 'OSINT research · digital investigations · evidence-led reporting';
  }
})();

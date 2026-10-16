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


/* NiloySec navy/mint typewriter terminal: relevant OSINT portfolio commands only. */
(() => {
  const screen = document.getElementById('terminalScreen');
  const commandView = document.getElementById('terminalAutoCommand');
  if (!screen || !commandView) return;

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

  function clearOutput() {
    screen.replaceChildren();
    screen.scrollTop = 0;
  }
  function addOutput(text, className = 'terminal-output') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.textContent = text;
    screen.appendChild(line);
  }
  async function typeInto(el, text, id, delay = 48) {
    el.textContent = '';
    for (const ch of text) {
      if (id !== generation) return false;
      el.textContent += ch;
      await sleep(delay);
    }
    return id === generation;
  }
  async function typeOutputLine(text, id) {
    const line = document.createElement('div');
    line.className = 'terminal-line terminal-output';
    line.textContent = '';
    screen.appendChild(line);
    for (const ch of text) {
      if (id !== generation) return false;
      line.textContent += ch;
      await sleep(16);
    }
    return id === generation;
  }
  async function start() {
    const id = ++generation;
    if (timerId) clearTimeout(timerId);
    while (id === generation) {
      for (const [command, lines] of sequence) {
        if (id !== generation) return;
        clearOutput();
        commandView.textContent = '';
        if (!(await typeInto(commandView, command, id, 48))) return;
        addOutput('root@niloysec:~$ ' + command, 'terminal-command');
        commandView.textContent = '';
        await sleep(180);
        for (const line of lines) {
          if (id !== generation) return;
          if (!(await typeOutputLine(line, id))) return;
        }
        await sleep(1600);
      }
    }
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    start();
  } else {
    addOutput('OSINT research · digital investigations · evidence-led reporting', 'terminal-muted');
  }
})();

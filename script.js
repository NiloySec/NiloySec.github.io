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


/* Reliable single-screen terminal animation: type command, type output, erase output, erase command. */
(() => {
  const screen = document.getElementById('terminalScreen');
  if (!screen) return;

  const sequence = [
    ['whoami', ['Md Kamrujjaman — NiloySec']],
    ['cat profile.txt', ['OSINT Researcher · CSE Student at DUET']],
    ['ls capabilities/', ['reverse-image-research/', 'digital-footprint-analysis/', 'username-research/ · geolocation/']],
    ['cat methodology.txt', ['Find · Assess · Verify · Report']],
    ['ls projects/', ['selected-case-studies/ · investigation-workflows/']],
    ['cat tools.txt', ['Public-source research · Reverse image search · Python · Git']],
    ['whoami --contact', ['LinkedIn: linkedin.com/in/n1l0y', 'Fiverr: fiverr.com/niloysec']]
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
  async function eraseText(el, id, delay = 13) {
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
    output.className = 'terminal-line terminal-output';
    screen.replaceChildren(command, output);

    while (id === generation) {
      for (const [cmd, lines] of sequence) {
        if (id !== generation) return;
        output.textContent = '';
        if (!(await typeText(command, 'root@niloysec:~$ ' + cmd, id))) return;
        await sleep(300);

        // Keep each output line within the one upper terminal box; no second prompt.
        for (let i = 0; i < lines.length; i++) {
          if (id !== generation) return;
          if (i > 0) {
            const extra = document.createElement('div');
            extra.className = 'terminal-line terminal-output';
            screen.appendChild(extra);
            if (!(await typeText(extra, lines[i], id, 18))) return;
          } else {
            if (!(await typeText(output, lines[i], id, 18))) return;
          }
        }
        await sleep(1200);

        // Character-by-character erase, then the next command replaces the same screen.
        for (const line of Array.from(screen.children).slice(1)) {
          if (!(await eraseText(line, id, 12))) return;
        }
        screen.replaceChildren(command, output);
        output.textContent = '';
        if (!(await eraseText(command, id, 12))) return;
        await sleep(220);
      }
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    screen.replaceChildren();
    const command = document.createElement('div');
    command.className = 'terminal-line terminal-command';
    command.textContent = 'root@niloysec:~$ whoami';
    const output = document.createElement('div');
    output.className = 'terminal-line terminal-output';
    output.textContent = 'Md Kamrujjaman — NiloySec';
    screen.append(command, output);
  } else {
    run();
  }
})();

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


/* One-at-a-time auto terminal. Each command replaces the previous screen completely. */
(() => {
  const screen = document.getElementById('terminalScreen');
  const commandView = document.getElementById('terminalAutoCommand');
  const clearBtn = document.getElementById('terminalClear');
  const replayBtn = document.getElementById('terminalReplay');
  if (!screen || !commandView || !clearBtn || !replayBtn) return;

  const sequence = [
    ['whoami', ['Md Kamrujjaman — NiloySec', 'OSINT researcher · CSE student at DUET']],
    ['date', [new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })]],
    ['pwd', ['/home/visitor/niloysec']],
    ['ls', ['about/   skills/   projects/   contact/']],
    ['skills', ['OSINT Research · Digital Footprint Analysis', 'Reverse Image Research · Geolocation']],
    ['help', ['whoami | date | pwd | ls | skills | about | projects | contact']],
    ['contact', ['LinkedIn: linkedin.com/in/n1l0y', 'Fiverr: fiverr.com/niloysec']]
  ];

  let generation = 0;
  let timerId = null;
  const sleep = ms => new Promise(resolve => { timerId = setTimeout(resolve, ms); });

  function resetOutput() {
    screen.replaceChildren();
    screen.scrollTop = 0;
  }
  function output(text, type = 'terminal-output') {
    const row = document.createElement('div');
    row.className = 'terminal-line ' + type;
    row.textContent = text;
    screen.appendChild(row);
  }
  async function type(text, current) {
    commandView.textContent = '';
    for (const ch of text) {
      if (current !== generation) return false;
      commandView.textContent += ch;
      await sleep(80);
    }
    return current === generation;
  }
  async function start() {
    generation++;
    const current = generation;
    if (timerId) clearTimeout(timerId);
    commandView.textContent = '';
    resetOutput();

    while (current === generation) {
      for (const [command, lines] of sequence) {
        if (current !== generation) return;
        // Clear absolutely everything from the prior command before showing the next.
        resetOutput();
        commandView.textContent = '';
        if (!(await type(command, current))) return;
        output('root@niloysec:~$ ' + command, 'terminal-command');
        commandView.textContent = '';
        await sleep(250);
        for (const line of lines) {
          if (current !== generation) return;
          output(line);
        }
        // Only this one command and its output stay visible during the pause.
        await sleep(1900);
      }
      if (current !== generation) return;
      resetOutput();
      output('Restarting terminal session…', 'terminal-muted');
      await sleep(800);
    }
  }

  clearBtn.addEventListener('click', () => {
    generation++;
    if (timerId) clearTimeout(timerId);
    resetOutput();
    commandView.textContent = '';
  });
  replayBtn.addEventListener('click', start);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    output('Motion reduction enabled. Press REPLAY to start the terminal.', 'terminal-muted');
  } else {
    start();
  }
})();

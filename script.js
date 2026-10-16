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


/* Minimal one-at-a-time browser terminal sample. No buttons, no shell execution. */
(() => {
  const screen = document.getElementById('terminalScreen');
  const commandView = document.getElementById('terminalAutoCommand');
  if (!screen || !commandView) return;

  const sequence = [
    ['whoami', ['Md Kamrujjaman — NiloySec']],
    ['date', [new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })]],
    ['pwd', ['/home/visitor/niloysec']],
    ['skills', ['OSINT Research · Digital Footprint Analysis']],
    ['contact', ['LinkedIn: linkedin.com/in/n1l0y · Fiverr: fiverr.com/niloysec']]
  ];

  let runId = 0;
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
  async function typeCommand(command, id) {
    commandView.textContent = '';
    for (const char of command) {
      if (id !== runId) return false;
      commandView.textContent += char;
      await sleep(85);
    }
    return id === runId;
  }
  async function start() {
    const id = ++runId;
    if (timerId) clearTimeout(timerId);
    while (id === runId) {
      for (const [command, output] of sequence) {
        if (id !== runId) return;
        clearOutput();
        commandView.textContent = '';
        if (!(await typeCommand(command, id))) return;
        addOutput('root@niloysec:~$ ' + command, 'terminal-command');
        commandView.textContent = '';
        await sleep(250);
        output.forEach(line => addOutput(line));
        await sleep(1700);
      }
    }
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    start();
  } else {
    addOutput('Auto terminal · motion reduced by browser preference', 'terminal-muted');
  }
})();

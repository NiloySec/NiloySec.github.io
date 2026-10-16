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


/* Safe browser-only auto-terminal: displays an allowlisted scripted session; never executes a real shell. */
(() => {
  const screen = document.getElementById('terminalScreen');
  const commandView = document.getElementById('terminalAutoCommand');
  const clear = document.getElementById('terminalClear');
  const replay = document.getElementById('terminalReplay');
  if (!screen || !commandView || !clear || !replay) return;

  const session = [
    { command: 'whoami', output: ['Md Kamrujjaman — NiloySec', 'OSINT researcher · CSE student at DUET'] },
    { command: 'date', output: [new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })] },
    { command: 'pwd', output: ['/home/visitor/niloysec'] },
    { command: 'ls', output: ['about/  skills/  projects/  contact/  case-study.pdf', '(Virtual entries only; simulated workspace.)'] },
    { command: 'skills', output: ['OSINT Research', 'Digital Footprint Analysis', 'Reverse Image Research', 'Username & Social Research', 'Geolocation Research', 'Evidence-based Reporting'] },
    { command: 'help', output: ['Available commands: whoami · about · skills · projects · date · pwd · ls · contact · help · clear'] },
    { command: 'contact', output: ['LinkedIn: linkedin.com/in/n1l0y', 'Fiverr: fiverr.com/niloysec', 'GitHub: github.com/NiloySec'] }
  ];

  let runId = 0;
  let timer = null;
  const wait = ms => new Promise(resolve => { timer = setTimeout(resolve, ms); });

  function addLine(text, className = 'terminal-output') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.textContent = text;
    screen.appendChild(line);
    screen.scrollTop = screen.scrollHeight;
  }

  async function typeCommand(command, id) {
    commandView.textContent = '';
    for (const char of command) {
      if (id !== runId) return false;
      commandView.textContent += char;
      await wait(62);
    }
    return id === runId;
  }

  async function play() {
    runId += 1;
    const id = runId;
    if (timer) clearTimeout(timer);
    screen.replaceChildren();
    addLine('NiloySec Interactive Terminal v1.0 · Safe browser simulation', 'terminal-muted');
    addLine('Automated demonstration · commands are shown one at a time', 'terminal-muted');
    await wait(700);

    while (id === runId) {
      for (const item of session) {
        if (!(await typeCommand(item.command, id))) return;
        addLine('root@niloysec:~$ ' + item.command, 'terminal-command');
        commandView.textContent = '';
        await wait(350);
        for (const line of item.output) {
          if (id !== runId) return;
          addLine(line);
          await wait(180);
        }
        await wait(900);
      }
      if (id !== runId) return;
      addLine('Session cycle complete · replaying shortly…', 'terminal-muted');
      await wait(1800);
    }
  }

  clear.addEventListener('click', () => {
    runId += 1;
    if (timer) clearTimeout(timer);
    screen.replaceChildren();
    commandView.textContent = '';
  });
  replay.addEventListener('click', play);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    play();
  } else {
    addLine('Motion is reduced by your browser preference.', 'terminal-muted');
    addLine('Press REPLAY to run the terminal demonstration.', 'terminal-muted');
  }
})();

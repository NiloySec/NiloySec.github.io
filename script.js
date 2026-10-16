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


/* Fixed prompt forever. Only the command suffix and output text type/erase. */
(() => {
  const screen = document.getElementById('terminalScreen');
  if (!screen) return;

  const promptText = 'root@niloysec:~$ ';
  const sequence = [
    ['whoami', ['Md Kamrujjaman — NiloySec']],
    ['cat profile.txt', ['OSINT Researcher · CSE Student at DUET']],
    ['ls capabilities/', ['reverse-image-research/', 'digital-footprint-analysis/', 'username-research/ · geolocation/']],
    ['cat methodology.txt', ['Find · Assess · Verify · Report']],
    ['ls projects/', ['Selected case studies · Investigation workflows']],
    ['cat tools.txt', ['Public-source research · Reverse image search · Python · Git']],
    ['whoami --contact', ['LinkedIn: linkedin.com/in/n1l0y', 'Fiverr: fiverr.com/niloysec']]
  ];

  let runId = 0;
  let timer = null;
  const sleep = ms => new Promise(resolve => { timer = setTimeout(resolve, ms); });

  async function typeInto(el, text, id, delay = 48) {
    el.textContent = '';
    for (const char of text) {
      if (id !== runId) return false;
      el.textContent += char;
      await sleep(delay);
    }
    return id === runId;
  }

  async function eraseFrom(el, id, delay = 13) {
    while (el.textContent.length > 0) {
      if (id !== runId) return false;
      el.textContent = el.textContent.slice(0, -1);
      await sleep(delay);
    }
    return id === runId;
  }

  async function run() {
    const id = ++runId;
    if (timer) clearTimeout(timer);

    screen.replaceChildren();

    // This prompt node is created once and never edited or removed.
    const commandRow = document.createElement('div');
    commandRow.className = 'terminal-line terminal-command';

    const prompt = document.createElement('span');
    prompt.className = 'terminal-fixed-prompt';
    prompt.textContent = promptText;

    const command = document.createElement('span');
    command.className = 'terminal-command-text';

    commandRow.append(prompt, command);

    const outputArea = document.createElement('div');
    outputArea.className = 'terminal-output-group';

    screen.append(commandRow, outputArea);

    while (id === runId) {
      for (const [cmd, lines] of sequence) {
        if (id !== runId) return;

        // Clear output text only; prompt node remains untouched.
        outputArea.replaceChildren();

        // Type the command after the fixed prompt.
        if (!(await typeInto(command, cmd, id))) return;
        await sleep(250);

        // Type each output line character-by-character.
        for (const lineText of lines) {
          const line = document.createElement('div');
          line.className = 'terminal-line terminal-output';
          outputArea.appendChild(line);
          if (!(await typeInto(line, lineText, id, 18))) return;
        }

        await sleep(1000);

        // Erase output characters one by one, keeping the prompt visible.
        for (const line of Array.from(outputArea.children)) {
          if (!(await eraseFrom(line, id, 11))) return;
        }
        outputArea.replaceChildren();

        // Erase only the command suffix, never the fixed prompt.
        if (!(await eraseFrom(command, id, 11))) return;
        await sleep(200);
      }
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    screen.replaceChildren();
    const row = document.createElement('div');
    row.className = 'terminal-line terminal-command';
    const prompt = document.createElement('span');
    prompt.className = 'terminal-fixed-prompt';
    prompt.textContent = promptText;
    const command = document.createElement('span');
    command.className = 'terminal-command-text';
    command.textContent = 'whoami';
    row.append(prompt, command);
    const output = document.createElement('div');
    output.className = 'terminal-line terminal-output';
    output.textContent = 'Md Kamrujjaman — NiloySec';
    screen.append(row, output);
  } else {
    run();
  }
})();

// @TODO: Autocomplete

import { NS } from "types/NetscriptDefinitions";

const doc = globalThis["document"];
const win = globalThis["window"];

export async function main(ns: NS) {
  ns.createProgram; // For the RAM
  const repl = new REPL(ns);

  // @ts-ignore
  win.repl = repl;

  repl.mount();
  ns.atExit(() => repl.unmount());

  while (true) {
    await ns.asleep(30000);
  }
}

class REPL {
  ns: NS;
  menu: HTMLDivElement;
  wrapper: HTMLFormElement;
  log: HTMLDivElement;
  input: HTMLInputElement;
  version = "v0.0.1";

  constructor(ns: NS) {
    this.ns = ns;
  }

  // FIXME: Probably brittle and will break at any update (possibly even between launches)
  mount() {
    this.wrapper = doc.createElement("form");
    this.wrapper.className = "MuiCollapse-wrapperInner MuiCollapse-vertical css-8atqhb repl-wrapper";

    this.log = doc.createElement("div");
    this.log.className = "MuiBox-root repl-log MuiTypography-root MuiTypography-body1 css-14bb8ng";
    const inputContainer = doc.createElement("div");
    inputContainer.className = "MuiTypography-root MuiTypography-body1 css-14bb8ng repl-input-wrapper";
    const replPreText = doc.createElement("span");
    replPreText.textContent = "REPL >>";
    inputContainer.appendChild(replPreText);

    this.input = doc.createElement("input");
    this.input.type = "text";
    this.input.id = "repl-input";
    this.input.className = "repl-input css-1oaunmp";

    this.addStyleSheet(
      "repl",
      `
      .repl-wrapper {
        border-right: 1px solid rgb(68, 68, 68);
        display: flex;
        flex-direction: column;
        max-height: 312px;
        padding: 0 0.5rem;
      }

      .repl-log {
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .repl-line {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .repl-line.error {
        color: #c00;
      }

      .repl-line.info {
        color: #36c;
      }

      .repl-line.success {
        color: #0c0;
      }

      .repl-line.warn {
        color: #cc0;
      }

      .repl-input-wrapper {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
      }

      .repl-input-wrapper > span {
          white-space: nowrap
      }

      .repl-input {
      }
      `
    );

    inputContainer.appendChild(this.input);
    this.wrapper.appendChild(this.log);
    this.wrapper.appendChild(inputContainer);
    this.menu = doc.querySelector(
      "div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation1 div.MuiCollapse-wrapper.MuiCollapse-vertical.css-hboir5"
    );
    this.menu.children[0].classList.remove("css-8atqhb"); // Remove the width: 100%; from the other menu piece
    this.menu.parentElement.parentElement.style.left = "0";
    this.menu.prepend(this.wrapper);

    doc.addEventListener("keydown", this.overrideKeydown);
    this.wrapper.addEventListener("click", this.focusInput);
    this.wrapper.addEventListener("submit", this.formSubmit);

    this.printLine(`BitburnerOS REPL ${this.version}`);
    this.printLine('Type "exit" to quit.');
  }

  unmount() {
    this.removeStyleSheet("repl");
    this.menu.children[0].classList.add("css-8atqhb");
    this.menu.parentElement.parentElement.style.left = null;
    this.wrapper.removeEventListener("click", this.focusInput);
    this.wrapper.removeEventListener("submit", this.formSubmit);
    this.wrapper.remove();
    doc.removeEventListener("keydown", this.overrideKeydown);
  }

  async runCommand(command: string) {
    try {
      const ns = this.ns;

      if (command === "exit") command = "ns.exit()";
      const result = await eval(command);
      this.printLine(result);
    } catch (error) {
      win.console.error(error);
      this.printLine(error.toString(), "error");
    }
  }

  printLine(value: any, className?: string) {
    let text;
    if (typeof value === "object") {
      text = JSON.stringify(value);
    } else {
      text = value;
    }

    const line = doc.createElement("p");
    line.className = "MuiTypography-root MuiTypography-body1 css-18ubon4 repl-line";
    line.classList.add(className);
    line.textContent = text;

    this.log.appendChild(line);
    this.log.scrollTo({ behavior: "smooth", top: this.log.scrollHeight });

    // @TODO: Clear log when reaching line cap (1000?)
  }

  private addStyleSheet(key: string, content: string) {
    let sheet = doc.querySelector(`style[data-key="${key}"]`) as HTMLStyleElement;
    if (!sheet) {
      sheet = doc.createElement("style");
      sheet.dataset.key = key;
      doc.head.appendChild(sheet);
    }
    sheet.textContent = content;
  }

  private removeStyleSheet(key: string) {
    doc.querySelector(`style[data-key="${key}"]`)?.remove();
  }

  private overrideKeydown = (event: KeyboardEvent) => {
    const isReplEvent = event.composedPath().some((e: HTMLElement) => e === this.input);
    if (isReplEvent) {
      event.stopImmediatePropagation?.();
      const clone = new KeyboardEvent(event.type, event);
      clone.stopPropagation();
      this.input.dispatchEvent(clone);
    }
  };

  private focusInput = (event: MouseEvent) => {
    // const isReplEvent = event.composedPath().some((e: HTMLElement) => e === this.wrapper);
    // if (isReplEvent) {
    this.input.focus();
    // }
  };

  private formSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const command = this.input.value;

    this.runCommand(command);

    this.input.value = "";
    this.input.focus();
  };
}

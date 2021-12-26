// @TODO: Autocomplete
const doc = globalThis["document"];
const win = globalThis["window"];
/** @param {NS} ns*/
export async function main(ns) {
    ns.createProgram; // For the RAM
    const repl = new REPL(ns);
    // @ts-ignore
    win.repl = repl;
    repl.mount();
    while (true) {
        await ns.asleep(30000);
    }
}
class REPL {
    constructor(ns) {
        this.overrideKeydown = (event) => {
            var _a;
            const isReplEvent = event.composedPath().some((e) => e === this.input);
            if (isReplEvent) {
                (_a = event.stopImmediatePropagation) === null || _a === void 0 ? void 0 : _a.call(event);
                const clone = new KeyboardEvent(event.type, event);
                clone.stopPropagation();
                this.input.dispatchEvent(clone);
            }
        };
        this.focusInput = (event) => {
            // const isReplEvent = event.composedPath().some((e: HTMLElement) => e === this.wrapper);
            // if (isReplEvent) {
            this.input.focus();
            // }
        };
        this.formSubmit = (event) => {
            event.preventDefault();
            const command = this.input.value;
            this.runCommand(command);
            this.input.value = "";
            this.input.focus();
        };
        this.ns = ns;
        ns.atExit(() => {
            this.unmount();
        });
    }
    // FIXME: Probably brittle and will break at any update (possibly even between launches)
    mount() {
        this.wrapper = doc.createElement("form");
        this.wrapper.className = "MuiCollapse-wrapperInner MuiCollapse-vertical css-8atqhb repl-wrapper";
        this.log = doc.createElement("div");
        this.log.className = "MuiBox-root css-1c5ij41 repl-log MuiTypography-root MuiTypography-body1 css-14bb8ng";
        const inputContainer = doc.createElement("div");
        inputContainer.className = "MuiTypography-root MuiTypography-body1 css-14bb8ng repl-input-wrapper";
        const replPreText = doc.createElement("span");
        replPreText.textContent = "REPL >>";
        inputContainer.appendChild(replPreText);
        this.input = doc.createElement("input");
        this.input.type = "text";
        this.input.id = "repl-input";
        this.input.className = "repl-input css-1oaunmp";
        this.addStyleSheet("repl", `
      .repl-wrapper {
        border-right: 1px solid rgb(68, 68, 68);
        display: flex;
        flex-direction: column;
        max-height: 398px;
      }

      .repl-log {
        overflow-y: auto;
        flex: 1;
        padding: 0 0.5rem;
      }

      .repl-line {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .repl-line.error {
        color: #c00;
      }

      /* .repl-log::-webkit-scrollbar {
        display: unset;
        background-color: #4d5d4e;
      }

      
      .repl-log::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        background: rgb(7 156 7);
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }*/

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
      `);
        inputContainer.appendChild(this.input);
        this.wrapper.appendChild(this.log);
        this.wrapper.appendChild(inputContainer);
        this.menu = doc.querySelector("div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation1 div.MuiCollapse-wrapper.MuiCollapse-vertical.css-hboir5");
        this.menu.children[0].classList.remove("css-8atqhb"); // Remove the width: 100%; from the other menu piece
        this.menu.parentElement.parentElement.style.left = "0";
        this.menu.prepend(this.wrapper);
        doc.addEventListener("keydown", this.overrideKeydown);
        this.wrapper.addEventListener("click", this.focusInput);
        this.wrapper.addEventListener("submit", this.formSubmit);
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
    async runCommand(command) {
        try {
            const ns = this.ns;
            if (command === "exit")
                command = "ns.exit()";
            const result = await eval(command);
            this.printResult(result);
        }
        catch (error) {
            win.console.error(error);
            this.printResult(error.toString(), "error");
        }
    }
    printResult(result, className) {
        let text;
        if (typeof result === "object") {
            text = JSON.stringify(result);
        }
        else {
            text = result;
        }
        const line = doc.createElement("p");
        line.className = "MuiTypography-root MuiTypography-body1 css-18ubon4 repl-line";
        line.classList.add(className);
        line.textContent = text;
        this.log.appendChild(line);
        this.log.scrollTo({ behavior: "smooth", top: this.log.scrollHeight });
        // @TODO: Clear log when reaching line cap (1000?)
    }
    addStyleSheet(key, content) {
        let sheet = doc.querySelector(`style[data-key="${key}"]`);
        if (!sheet) {
            sheet = doc.createElement("style");
            sheet.dataset.key = key;
            doc.head.appendChild(sheet);
        }
        sheet.textContent = content;
    }
    removeStyleSheet(key) {
        var _a;
        (_a = doc.querySelector(`style[data-key="${key}"]`)) === null || _a === void 0 ? void 0 : _a.remove();
    }
}

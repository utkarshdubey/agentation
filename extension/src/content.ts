import { mountAgentation, unmountAgentation } from "agentation/standalone";
import { STORAGE_KEY, readEnabled, type ToggleMessage } from "./shared";

let mounted = false;

function setMounted(enabled: boolean): void {
  if (enabled && !mounted) {
    mountAgentation();
    mounted = true;
    return;
  }

  if (!enabled && mounted) {
    unmountAgentation();
    mounted = false;
  }
}

async function init(): Promise<void> {
  const enabled = await readEnabled();
  setMounted(enabled);
}

void init();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local" || !changes[STORAGE_KEY]) return;
  const next = changes[STORAGE_KEY].newValue;
  if (typeof next === "boolean") {
    setMounted(next);
  }
});

chrome.runtime.onMessage.addListener((message: ToggleMessage) => {
  if (message?.type !== "agentation:toggle") return;

  if (typeof message.enabled === "boolean") {
    setMounted(message.enabled);
    return;
  }

  setMounted(!mounted);
});

window.addEventListener("beforeunload", () => {
  setMounted(false);
});

import { readEnabled, writeEnabled, type ToggleMessage } from "./shared";

const enabledCheckbox = document.getElementById("enabled") as HTMLInputElement | null;
const toggleButton = document.getElementById("toggle-tab") as HTMLButtonElement | null;

if (!enabledCheckbox || !toggleButton) {
  throw new Error("Popup controls not found");
}

const checkbox = enabledCheckbox;
const button = toggleButton;

async function sendToActiveTab(message: ToggleMessage): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  await chrome.tabs.sendMessage(tab.id, message).catch(() => {
    // Ignore pages where content scripts can't run
  });
}

async function initPopup(): Promise<void> {
  const enabled = await readEnabled();
  checkbox.checked = enabled;
}

checkbox.addEventListener("change", async () => {
  const next = checkbox.checked;
  await writeEnabled(next);
  await sendToActiveTab({ type: "agentation:toggle", enabled: next });
});

button.addEventListener("click", async () => {
  await sendToActiveTab({ type: "agentation:toggle" });
});

void initPopup();

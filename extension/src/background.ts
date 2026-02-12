import { readEnabled, writeEnabled, type ToggleMessage } from "./shared";

chrome.runtime.onInstalled.addListener(async () => {
  const enabled = await readEnabled();
  await writeEnabled(enabled);
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-agentation") return;

  const enabled = await readEnabled();
  const next = !enabled;
  await writeEnabled(next);

  const tabs = await chrome.tabs.query({});
  const message: ToggleMessage = { type: "agentation:toggle", enabled: next };

  await Promise.all(
    tabs
      .filter((tab) => typeof tab.id === "number")
      .map((tab) =>
        chrome.tabs.sendMessage(tab.id!, message).catch(() => {
          // Ignore tabs without the content script (e.g., chrome:// pages)
        }),
      ),
  );
});

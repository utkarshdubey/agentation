export const STORAGE_KEY = "agentationExtensionEnabled";

export type ToggleMessage = {
  type: "agentation:toggle";
  enabled?: boolean;
};

export async function readEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const value = result[STORAGE_KEY];
  return typeof value === "boolean" ? value : true;
}

export async function writeEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: enabled });
}

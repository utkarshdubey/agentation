import { createRoot, type Root } from "react-dom/client";

import {
  PageFeedbackToolbarCSS,
  type PageFeedbackToolbarCSSProps,
} from "./components/page-toolbar-css";

export type MountAgentationOptions = PageFeedbackToolbarCSSProps & {
  /** Optional target to render into. Defaults to a generated container on document.body. */
  target?: Element | DocumentFragment;
};

type MountedInstance = {
  root: Root;
  target: Element | DocumentFragment;
  ownedContainer: HTMLElement | null;
};

let mountedInstance: MountedInstance | null = null;

function createDefaultContainer(): HTMLElement {
  const container = document.createElement("div");
  container.id = "agentation-root";
  container.dataset.agentationStandalone = "true";
  document.body.appendChild(container);
  return container;
}

function shouldRemount(nextTarget?: Element | DocumentFragment): boolean {
  if (!mountedInstance) return false;
  if (!nextTarget && mountedInstance.ownedContainer) return false;
  if (!nextTarget && !mountedInstance.ownedContainer) return true;
  return mountedInstance.target !== nextTarget;
}

/**
 * Mount Agentation imperatively for standalone/browser-extension usage.
 * Calling this repeatedly re-renders the existing mounted instance.
 */
export function mountAgentation(options: MountAgentationOptions = {}): void {
  if (typeof document === "undefined") return;

  const { target, ...props } = options;

  if (shouldRemount(target)) {
    unmountAgentation();
  }

  if (!mountedInstance) {
    const ownedContainer = !target ? createDefaultContainer() : null;
    const targetNode = target ?? ownedContainer!;
    const root = createRoot(targetNode);
    mountedInstance = {
      root,
      target: targetNode,
      ownedContainer,
    };
  }

  mountedInstance.root.render(<PageFeedbackToolbarCSS {...props} />);
}

/**
 * Unmount a standalone Agentation instance.
 */
export function unmountAgentation(): void {
  if (!mountedInstance) return;

  mountedInstance.root.unmount();

  if (mountedInstance.ownedContainer) {
    mountedInstance.ownedContainer.remove();
  }

  mountedInstance = null;
}

export function isAgentationMounted(): boolean {
  return mountedInstance !== null;
}

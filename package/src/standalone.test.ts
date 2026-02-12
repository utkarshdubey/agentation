/**
 * @vitest-environment jsdom
 */
import React from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act } from "react";

vi.mock("./components/page-toolbar-css", () => ({
  PageFeedbackToolbarCSS: ({ webhookUrl }: { webhookUrl?: string }) =>
    React.createElement(
      "div",
      { "data-testid": "agentation-toolbar", "data-webhook-url": webhookUrl ?? "" },
      "toolbar",
    ),
}));

import {
  mountAgentation,
  unmountAgentation,
  isAgentationMounted,
} from "./standalone";


beforeAll(() => {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  act(() => {
    unmountAgentation();
  });
  document.body.innerHTML = "";
});

describe("standalone mount API", () => {
  it("mounts into an owned default container", () => {
    expect(isAgentationMounted()).toBe(false);

    act(() => {
      mountAgentation();
    });

    const container = document.getElementById("agentation-root");
    expect(container).not.toBeNull();
    expect(container?.dataset.agentationStandalone).toBe("true");
    expect(document.querySelector('[data-testid="agentation-toolbar"]')).not.toBeNull();
    expect(isAgentationMounted()).toBe(true);
  });

  it("re-renders existing instance instead of creating duplicates", () => {
    act(() => {
      mountAgentation({ webhookUrl: "https://first.example" });
      mountAgentation({ webhookUrl: "https://second.example" });
    });

    const allContainers = document.querySelectorAll("#agentation-root");
    expect(allContainers).toHaveLength(1);

    const toolbar = document.querySelector('[data-testid="agentation-toolbar"]');
    expect(toolbar?.getAttribute("data-webhook-url")).toBe("https://second.example");
  });


  it("remounts when switching targets", () => {
    const first = document.createElement("div");
    const second = document.createElement("div");
    first.id = "first-target";
    second.id = "second-target";
    document.body.appendChild(first);
    document.body.appendChild(second);

    act(() => {
      mountAgentation({ target: first });
    });
    expect(first.querySelector('[data-testid="agentation-toolbar"]')).not.toBeNull();

    act(() => {
      mountAgentation({ target: second });
    });

    expect(first.querySelector('[data-testid="agentation-toolbar"]')).toBeNull();
    expect(second.querySelector('[data-testid="agentation-toolbar"]')).not.toBeNull();
  });

  it("uses provided target without creating owned container", () => {
    const target = document.createElement("div");
    target.id = "custom-target";
    document.body.appendChild(target);

    act(() => {
      mountAgentation({ target });
    });

    expect(document.getElementById("agentation-root")).toBeNull();
    expect(target.querySelector('[data-testid="agentation-toolbar"]')).not.toBeNull();

    act(() => {
      unmountAgentation();
    });

    expect(document.getElementById("custom-target")).not.toBeNull();
    expect(target.querySelector('[data-testid="agentation-toolbar"]')).toBeNull();
    expect(isAgentationMounted()).toBe(false);
  });
});

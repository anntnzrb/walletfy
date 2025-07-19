// bun.test.ts
import { JSDOM } from "jsdom";

// Setup DOM environment for tests
export function setupTestEnvironment() {
  // Create a DOM environment
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost:3000",
    pretendToBeVisual: true,
  });

  // Set global DOM objects
  (global as any).window = dom.window;
  (global as any).document = dom.window.document;
  (global as any).navigator = dom.window.navigator;
  (global as any).location = dom.window.location;
  (global as any).localStorage = dom.window.localStorage;
  (global as any).sessionStorage = dom.window.sessionStorage;

  // Set up global DOM classes
  (global as any).Element = dom.window.Element;
  (global as any).HTMLElement = dom.window.HTMLElement;
  (global as any).HTMLInputElement = dom.window.HTMLInputElement;
  (global as any).HTMLDivElement = dom.window.HTMLDivElement;
  (global as any).HTMLButtonElement = dom.window.HTMLButtonElement;
  (global as any).HTMLFormElement = dom.window.HTMLFormElement;
  (global as any).Event = dom.window.Event;
  (global as any).MouseEvent = dom.window.MouseEvent;
  (global as any).KeyboardEvent = dom.window.KeyboardEvent;
  (global as any).FocusEvent = dom.window.FocusEvent;
  (global as any).CustomEvent = dom.window.CustomEvent;
  (global as any).FormData = dom.window.FormData;
  (global as any).XMLHttpRequest = dom.window.XMLHttpRequest;
  (global as any).fetch = dom.window.fetch;

  // Also set up on the global object directly
  global.Element = dom.window.Element;
  global.HTMLElement = dom.window.HTMLElement;
  global.HTMLInputElement = dom.window.HTMLInputElement;
  global.HTMLDivElement = dom.window.HTMLDivElement;
  global.HTMLButtonElement = dom.window.HTMLButtonElement;
  global.HTMLFormElement = dom.window.HTMLFormElement;
  global.Event = dom.window.Event;
  global.MouseEvent = dom.window.MouseEvent;
  global.KeyboardEvent = dom.window.KeyboardEvent;
  global.FocusEvent = dom.window.FocusEvent;
  global.CustomEvent = dom.window.CustomEvent;
  global.FormData = dom.window.FormData;
  global.XMLHttpRequest = dom.window.XMLHttpRequest;
  global.fetch = dom.window.fetch;

  // Mock requestAnimationFrame
  (global as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(callback, 0);
  };

  // Mock cancelAnimationFrame
  (global as any).cancelAnimationFrame = (id: number) => {
    clearTimeout(id);
  };

  // Mock ResizeObserver
  (global as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock IntersectionObserver
  (global as any).IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  console.log("Test environment setup complete");
}

// Cleanup test environment
export function teardownTestEnvironment() {
  // Clean up global objects
  delete (global as any).window;
  delete (global as any).document;
  delete (global as any).navigator;
  delete (global as any).location;
  delete (global as any).localStorage;
  delete (global as any).sessionStorage;
  delete (global as any).requestAnimationFrame;
  delete (global as any).cancelAnimationFrame;
  delete (global as any).ResizeObserver;
  delete (global as any).IntersectionObserver;

  console.log("Test environment teardown complete");
}

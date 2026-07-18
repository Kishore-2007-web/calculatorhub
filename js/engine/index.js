/**
 * Universal Calculator Engine (UCE)
 * Central engine entrypoint. Handles auto-bootstrapping in browser contexts.
 */
import { uceEngine } from './core/engine.js';
import { container } from './core/container.js';
import { eventBus } from './core/event-bus.js';
import { hooks } from './core/hooks.js';
import { ucePlugins } from './plugins/index.js';

// Self-initialize if running in a client browser window
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      uceEngine.init();
    });
  } else {
    uceEngine.init();
  }
}

export {
  uceEngine as Engine,
  container as Container,
  eventBus as EventBus,
  hooks as Hooks,
  ucePlugins as Plugins
};

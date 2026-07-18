/**
 * Universal Calculator Engine - Plugin Coordinator
 * Integrates custom plugins, validators, and formatters dynamically into core engines.
 */
import { hooks } from '../core/hooks.js';

export class UcePlugins {
  constructor() {
    this.customValidators = new Map();
    this.customFormatters = new Map();
  }

  /**
   * Register custom validation checking function
   */
  registerValidator(name, validatorFn) {
    this.customValidators.set(name, validatorFn);
    return this;
  }

  /**
   * Retrieve registered custom validation checks
   */
  getValidator(name) {
    return this.customValidators.get(name);
  }

  /**
   * Register custom output formatting function
   */
  registerFormatter(name, formatterFn) {
    this.customFormatters.set(name, formatterFn);
    return this;
  }

  /**
   * Retrieve registered custom output formatters
   */
  getFormatter(name) {
    return this.customFormatters.get(name);
  }

  /**
   * Register standard hook listener
   */
  registerHook(hookName, callback) {
    hooks.register(hookName, callback);
    return this;
  }
}

export const ucePlugins = new UcePlugins();
export default ucePlugins;

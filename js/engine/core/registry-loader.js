/**
 * Registry Loader Module
 * Loads calculator configurations on demand using ES dynamic imports.
 */
export async function loadConfig(calculatorId, categoryId) {
  try {
    // Dynamic import resolves relative to the current module location (js/engine/core/)
    const registryModule = await import(`../registry/${categoryId}.js`);
    
    // Support default exports or named exports
    const registry = registryModule.default || registryModule.registry || registryModule;
    
    let config = null;
    if (Array.isArray(registry)) {
      config = registry.find(c => c.id === calculatorId);
    } else if (registry && typeof registry === 'object') {
      config = registry[calculatorId];
    }

    if (!config) {
      throw new Error(`Registry configuration not found for Calculator ID: ${calculatorId} in Category: ${categoryId}`);
    }

    return config;
  } catch (err) {
    console.error(`[RegistryLoader] Error loading configuration for ${calculatorId} in ${categoryId}:`, err);
    throw err;
  }
}

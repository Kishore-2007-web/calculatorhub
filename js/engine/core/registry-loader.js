/**
 * Dynamic Fallback Generator for unregistered calculators
 */
function generateFallbackConfig(calculatorId, categoryId) {
  const singleInputCalcs = [
    'square-root-calculator', 'cube-root-calculator', 'factorial-calculator',
    'prime-number-checker', 'sine-calculator', 'cosine-calculator', 'tangent-calculator',
    'logarithm-calculator', 'antilogarithm-calculator', 'fibonacci-calculator'
  ];

  const inputs = [];
  if (singleInputCalcs.includes(calculatorId)) {
    inputs.push({
      id: 'val_a',
      label: 'Input Value (X)',
      type: 'number',
      defaultValue: 16,
      required: true
    });
  } else {
    inputs.push({
      id: 'val_a',
      label: 'Value A (X)',
      type: 'number',
      defaultValue: 12,
      required: true
    });
    inputs.push({
      id: 'val_b',
      label: 'Value B (Y)',
      type: 'number',
      defaultValue: 8,
      required: true
    });
  }

  const name = calculatorId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    id: calculatorId,
    version: '1.0.0',
    name: name,
    category: categoryId,
    desc: `Calculate standard operations for ${name}.`,
    formulaType: 'function',
    inputs: inputs,
    outputs: [
      {
        id: 'result',
        label: 'Calculated Outcome',
        primary: true,
        format: 'number',
        decimals: 4
      }
    ],
    explanation: `
      <div style="font-size: 0.95rem;">
        <p>The standard math outcome for ${name} is <strong>{result}</strong>.</p>
      </div>
    `
  };
}

/**
 * Registry Loader Module
 * Loads calculator configurations on demand using ES dynamic imports.
 */
export async function loadConfig(calculatorId, categoryId) {
  try {
    const registryModule = await import(`../registry/${categoryId}.js`);
    const registry = registryModule.default || registryModule.registry || registryModule;
    
    let config = null;
    if (Array.isArray(registry)) {
      config = registry.find(c => c.id === calculatorId);
    } else if (registry && typeof registry === 'object') {
      config = registry[calculatorId];
    }

    if (!config) {
      return generateFallbackConfig(calculatorId, categoryId);
    }

    return config;
  } catch (err) {
    console.warn(`[RegistryLoader] Missing registry file for category [${categoryId}], generating dynamic fallback config for [${calculatorId}].`);
    return generateFallbackConfig(calculatorId, categoryId);
  }
}

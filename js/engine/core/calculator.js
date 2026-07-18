/**
 * Universal Calculator Engine - Calculator Model
 * Standardized data model enforcing a strict configuration schema.
 */
export class UceCalculator {
  constructor(config) {
    if (!config.id || !config.category) {
      throw new Error(`Calculator configuration requires at least an [id] and [category].`);
    }

    this.id = config.id;
    this.slug = config.slug || config.id;
    this.title = config.title || config.name || '';
    this.description = config.description || config.desc || '';
    this.category = config.category;
    
    // Inputs configuration
    this.inputs = config.inputs || [];
    
    // Outputs configuration
    this.outputs = config.outputs || [];
    
    // Unit systems configuration
    this.units = config.units || null;
    
    // Validation constraints schema
    this.validation = config.validation || {};
    
    // Result formatting guidelines
    this.formatter = config.formatter || {};
    
    // Formula definition: can be string (FDL), ID string (formula reference), or JS function
    this.formula = config.formula || null;
    this.formulaType = config.formulaType || 'fdl'; // 'fdl' | 'function' | 'advanced'
    
    // Explanations layout schema
    this.explanation = config.explanation || '';
    
    // Results interpretation brackets (e.g., BMI scales)
    this.interpretation = config.interpretation || null;
    
    // SEO fields
    this.seo = config.seo || {};
    
    // FAQs array
    this.faq = config.faq || config.faqs || [];
    
    // Related Calculators suggestions
    this.relatedCalculators = config.relatedCalculators || [];
    
    // Configuration Schema Version (used for cache invalidation)
    this.version = config.version || '1.0.0';
  }

  /**
   * Helper to fetch default values of inputs
   */
  getDefaultInputs() {
    const defaults = {};
    this.inputs.forEach(input => {
      defaults[input.id] = input.defaultValue !== undefined ? input.defaultValue : (input.default || '');
    });
    return defaults;
  }
}

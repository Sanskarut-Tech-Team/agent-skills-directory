import { SkillParameter } from './types';

/**
 * Compiles an executable prompt template by replacing {{variable_name}} placeholders
 * with user-provided parameters. Validates required parameters and applies default fallback values.
 *
 * @param template The executable prompt template string with {{variable_name}} placeholders
 * @param params Record of dynamic variable key-value pairs
 * @param parameterSpecs Optional array of SkillParameter definitions for strict validation
 * @returns Interpolated prompt string
 * @throws Error if any required parameter is missing and has no fallback default value
 */
export function compileSkillPrompt(
  template: string,
  params: Record<string, any> = {},
  parameterSpecs?: SkillParameter[]
): string {
  const mergedParams: Record<string, any> = { ...params };

  if (parameterSpecs && Array.isArray(parameterSpecs)) {
    const missing: string[] = [];

    for (const spec of parameterSpecs) {
      const value = mergedParams[spec.name];
      const isMissing =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '');

      if (isMissing) {
        if (spec.default !== undefined) {
          mergedParams[spec.name] = spec.default;
        } else if (spec.required) {
          missing.push(spec.name);
        }
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing required parameter(s) for skill compilation: ${missing.join(', ')}`
      );
    }
  }

  // Perform placeholder interpolation for {{ variable_name }}
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(mergedParams, key)) {
      const val = mergedParams[key];
      if (typeof val === 'object' && val !== null) {
        return JSON.stringify(val, null, 2);
      }
      return String(val);
    }

    // If key not provided in params or defaults, check if required in spec
    if (parameterSpecs) {
      const spec = parameterSpecs.find((s) => s.name === key);
      if (spec && spec.required && spec.default === undefined) {
        throw new Error(`Missing required parameter: '${key}'`);
      }
    }

    return match;
  });
}

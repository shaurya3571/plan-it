/**
 * Every provider is mocked unless PROVIDERS=live, so a fresh clone builds a
 * course with no API keys at all. Live mode fails loudly on a missing key
 * rather than silently falling back to fixtures.
 */
export const live = process.env.PROVIDERS === "live";

export function requireKey(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set when PROVIDERS=live`);
  return value;
}

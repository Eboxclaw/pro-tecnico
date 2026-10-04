// Resolve hook for `node --test`: the data files use Vite-style imports
// (extensionless relative paths and the "@/..." alias) that Node ESM
// cannot resolve on its own. No source file is modified.
import { registerHooks } from 'node:module';

const srcUrl = new URL('../src/', import.meta.url).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    let next = specifier.startsWith('@/') ? srcUrl + specifier.slice(2) : specifier;
    try {
      return nextResolve(next, context);
    } catch (error) {
      for (const ext of ['.ts', '.tsx']) {
        try {
          return nextResolve(next + ext, context);
        } catch {
          // keep trying
        }
      }
      throw error;
    }
  },
});

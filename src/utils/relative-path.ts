const toURL = (url: string | URL, base: string | URL) => {
  if (url instanceof URL) {
    return url;
  }
  return new URL(url, base);
};

interface GetRelativePathOptions {
  allowUpwardNavigation?: boolean;
  attemptUnsafeStringOptimization?: boolean;
  baseURI?: string | URL;
}

/**
 * Internal helper for robust relative path calculation using URL objects.
 */
const _calculateRelativePathRobustly = (fromUrl: URL, toUrl: URL, allowUpwardNavigation: boolean): string | null => {
  try {
    if (fromUrl.origin !== toUrl.origin) {
      console.error('Origins differ:', fromUrl.origin, toUrl.origin);
      return null;
    }

    const fromPath = fromUrl.pathname;
    const toPath = toUrl.pathname;

    if (fromPath === toPath) {
      return '.';
    }

    const fromIsDir = fromPath.endsWith('/');
    const toIsDir = toPath.endsWith('/'); // Keep for potential future refinement?

    // Normalize by removing trailing slash for segment comparison, but remember original state
    const normFromPath = fromPath.replace(/\/$/, '');
    const normToPath = toPath.replace(/\/$/, '');

    // Handle truly identical paths after normalization
    if (normFromPath === normToPath) {
      if (fromIsDir && !toIsDir) return '..'; // from /a/b/ to /a/b => ..
      if (!fromIsDir && toIsDir) return '.'; // from /a/b to /a/b/ => .
      // Should not happen if original paths were different but normalized are same?
      return '.'; // Default fallback
    }

    const normFromSegments = normFromPath.split('/').slice(1);
    const normToSegments = normToPath.split('/').slice(1);

    let commonPrefixLength = 0;
    while (
      commonPrefixLength < normFromSegments.length &&
      commonPrefixLength < normToSegments.length &&
      normFromSegments[commonPrefixLength] === normToSegments[commonPrefixLength]
    ) {
      commonPrefixLength++;
    }

    const upLevels = normFromSegments.length - commonPrefixLength;

    if (upLevels > 0 && !allowUpwardNavigation) {
      return null;
    }

    const finalDownSegments = normToSegments.slice(commonPrefixLength);

    const relativeParts: string[] = [];
    for (let i = 0; i < upLevels; i++) {
      relativeParts.push('..');
    }
    relativeParts.push(...finalDownSegments);

    const relativePath = relativeParts.join('/');

    // If joining results in empty (e.g. from /a to /a/b -> 'b'), handle it.
    // If after all calculations relativePath is empty, it must mean the normalized paths
    // were identical, which should have been caught earlier.
    if (relativePath === '' && fromPath !== toPath) {
      // This might indicate an edge case not fully handled by normalization logic yet.
      // Example: What leads here? Perhaps from '/' to '/'? No, caught by initial check.
      // Fallback to '.' might be reasonable if somehow paths differ but result is empty.
      console.warn('Relative path calculation resulted in empty string unexpectedly for different paths:', fromPath, toPath);
      return '.';
    }

    // Return '.' for identical paths was handled at the start.
    // Return specific cases like '..' or '.' for trailing slash diffs handled above.
    return relativePath;
  } catch (error) {
    // Catch potential errors during processing (though URL parsing errors handled outside)
    console.error('Error during robust relative path calculation:', error);
    return null;
  }
};

/**
 * Calculates the relative path from a 'from' URL to a 'to' URL.
 * Handles paths that require navigating up the directory tree (../).
 */
export const url_relative = (fromUrlOrString: string | URL, toUrlOrString: string | URL, options: GetRelativePathOptions = {}): string | null => {
  const {allowUpwardNavigation = true, attemptUnsafeStringOptimization = false} = options;

  // --- Unsafe String Optimization Path (Optional) ---
  if (attemptUnsafeStringOptimization && typeof fromUrlOrString === 'string' && typeof toUrlOrString === 'string') {
    // Using 'from' as the base, 'to' as the target here.
    // Simple prefix check:
    if (toUrlOrString.startsWith(fromUrlOrString)) {
      const fromLen = fromUrlOrString.length;
      const toLen = toUrlOrString.length;

      if (fromLen === toLen) {
        return '.'; // Identical strings
      }

      // Check if 'from' looks like a directory and 'to' is directly inside it
      if (fromUrlOrString.endsWith('/')) {
        const relativePath = toUrlOrString.slice(fromLen);
        // Basic safety: if it requires '..', this optimization is wrong.
        if (!relativePath.startsWith('..') && !relativePath.includes('/../')) {
          // Check if result is just a different trailing slash
          if (relativePath === '' && toUrlOrString === fromUrlOrString + '/') {
            return '.'; // from /a to /a/ is '.' relative
          }
          // Avoid returning empty string if slice was empty but length differs (e.g. trailing slash)
          return relativePath || '.';
        }
        // else: Fall through, needs robust check
      }
      // Check if 'from' looks like a file and 'to' is in the same "directory" conceptually
      else if (toUrlOrString[fromLen] === '/') {
        const relativePath = toUrlOrString.slice(fromLen + 1);
        if (!relativePath.startsWith('..') && !relativePath.includes('/../')) {
          // If 'from' is file /a/b, 'to' is /a/b/c -> relative is 'c'
          return relativePath || '.';
        }
        // else: Fall through
      }
      // else: Relationship is complex (e.g., /a/b vs /a/bc), fall through
    }
    // else: Not a simple prefix, fall through to robust method
  }

  // --- Robust Path ---
  try {
    const baseURI = options.baseURI ?? document.baseURI;
    const fromUrl = toURL(fromUrlOrString, baseURI);
    const toUrl = toURL(toUrlOrString, baseURI);

    if (!fromUrl || !toUrl) {
      // Error already logged by toURL
      return null;
    }

    // Delegate the core calculation to the helper function
    return _calculateRelativePathRobustly(fromUrl, toUrl, allowUpwardNavigation);
  } catch (error) {
    // Catch errors specifically from the URL object creation phase if not caught by toURL
    console.error('Error preparing URLs for relative path calculation:', error);
    return null;
  }
};

export interface RelativeUrlParts {
  pathname: string;
  search: string;
  hash: string;
}
/**
 * Calculates the relative parts (pathname, search, hash) of a target URL
 * with respect to a base URL.
 *
 * Assumes target URL should be "under" the base URL for routing purposes.
 *
 * @param targetUrlString The full current URL (e.g., location.href).
 * @param baseUrlString The base URL for the application/component.
 * @returns An object with relative pathname, search, and hash, or null if not relative.
 */
export const baseurl_relative_parts = (targetUrlString: string | URL, baseUrlString: string | URL): RelativeUrlParts | null => {
  try {
    const targetUrl = targetUrlString instanceof URL ? targetUrlString : new URL(targetUrlString);
    // Ensure base has a context for resolving potential relative targetUrlString
    const baseUrl = baseUrlString instanceof URL ? baseUrlString : new URL(baseUrlString, document.baseURI); // Use document.baseURI if baseUrlString is relative itself

    // 1. Check Origin: Must be the same for sensible relative calculation
    if (targetUrl.origin !== baseUrl.origin) {
      return null;
    }

    const targetPath = targetUrl.pathname;
    const basePath = baseUrl.pathname;

    // 2. Check if target path starts with base path.
    // Handle base paths that might or might not end with '/' correctly.
    let relativePathname: string;
    let basePathPrefix = basePath;
    // Ensure base path acts as a directory prefix for comparison
    if (!basePathPrefix.endsWith('/')) {
      basePathPrefix += '/';
    }
    // Check if target starts with the base directory prefix
    if (targetPath.startsWith(basePathPrefix)) {
      relativePathname = targetPath.slice(basePathPrefix.length);
    }
    // Check if target *exactly* matches base path without trailing slash
    else if (targetPath === basePath && !basePath.endsWith('/')) {
      relativePathname = ''; // Target is the base itself
    }
    // Check if target matches base path that *does* have trailing slash
    else if (targetPath === basePath && basePath.endsWith('/')) {
      relativePathname = ''; // Target is the base itself (directory index)
    } else {
      // Target path doesn't start appropriately relative to base path
      return null;
    }

    // 3. Return the relative pathname and the original search/hash from the target URL
    return {
      pathname: relativePathname, // Path relative to base
      search: targetUrl.search, // Full search string from target
      hash: targetUrl.hash, // Full hash string from target
    };
  } catch (error) {
    console.error('Error parsing URLs for relative parts:', error);
    return null;
  }
};

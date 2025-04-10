// css-starting-style.shim.ts
import type {Properties} from 'csstype';
import {match, P} from 'ts-pattern';
import {getAdoptedStyleSheets, getDocument, styleToCss} from '../../utils/css-helper';

const STARTING_STYLE_ATTR = '__starting-style-shim'; // Custom attribute name

/**
 * Applies temporary starting styles to an element using adoptedStyleSheets
 * and a data attribute, allowing CSS transitions to start from these styles.
 *
 * @param ele The target HTMLElement.
 * @param stylesInput Either a style object (Properties from csstype)
 *                    or a string of CSS text.
 * @example
 * // Assuming myElement has `transition: opacity 0.5s;` in CSS
 * const myElement = document.getElementById('my-element');
 * if (myElement) {
 *   // Make it transition from opacity 0
 *   css_starting_style_shim(myElement, { opacity: 0 });
 *   // Then apply the final state (e.g., add class) shortly after
 *   requestAnimationFrame(() => myElement.classList.add('visible'));
 * }
 */
export const css_starting_style_shim = (ele: HTMLElement | null, stylesInput: Properties | string | null | undefined): void => {
  // --- Input Validation ---
  if (!ele) {
    console.warn('[css_starting_style_shim] Target element is null or undefined.');
    return;
  }
  // Ensure stylesInput is either a non-empty string or a non-empty object
  const isValidInput = match(stylesInput)
    .with(P.string, (s) => s.trim().length > 0)
    .with(
      P.when((val) => typeof val === 'object' && val !== null && Object.keys(val).length > 0),
      () => true
    )
    .otherwise(() => false);

  if (!isValidInput || !stylesInput) {
    // Added !stylesInput check for null/undefined case
    console.warn('[css_starting_style_shim] Invalid or empty styles input provided.');
    return;
  }

  const ownerDoc = getDocument(ele);

  // Check for adoptedStyleSheets support (essential for this approach)
  if (!ownerDoc || !('adoptedStyleSheets' in ownerDoc)) {
    console.warn('[css_starting_style_shim] adoptedStyleSheets is not supported in this document. Shim cannot operate.');
    // Optionally: Implement fallback using <style> tag here
    return;
  }

  const uuid = crypto.randomUUID();
  const attributeSelector = `[${STARTING_STYLE_ATTR}="${uuid}"]`;
  let cssProperties: string;

  // --- Prepare CSS Properties ---
  try {
    cssProperties = match(stylesInput)
      .with(P.string, (cssText) => cssText)
      .with(
        P.when((val) => typeof val === 'object' && val !== null),
        (styleObj) => styleToCss(styleObj) // Safe cast due to P.when
      )
      // Note: .otherwise should not be reachable due to isValidInput check,
      // but adding for type safety and future changes.
      .otherwise(() => {
        console.error('[css_starting_style_shim] Internal error: Should not reach otherwise branch.');
        return '';
      });

    if (!cssProperties) {
      return; // Exit if no actual styles were generated
    }
  } catch (error) {
    console.error('[css_starting_style_shim] Error processing styles input:', error);
    return;
  }

  // --- Create and Inject Stylesheet ---
  const sheet = new CSSStyleSheet();
  const rule = `${attributeSelector} { ${cssProperties} }`;

  try {
    // Using replaceSync is simpler than insertRule for a single rule set
    sheet.replaceSync(rule);
  } catch (error) {
    console.error(`[css_starting_style_shim] Failed to add rule to stylesheet: "${rule}"`, error);
    return;
  }

  // Add the new sheet immutably
  const ass = getAdoptedStyleSheets(ownerDoc);
  ass.set(uuid, sheet);

  // Apply the attribute to target the styles
  ele.setAttribute(STARTING_STYLE_ATTR, uuid);

  // --- Schedule Cleanup ---
  // Use double requestAnimationFrame to ensure:
  // 1. Browser applies the attribute and calculates styles with the adopted sheet.
  // 2. *After* that frame, remove the attribute and the sheet.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Check if element still exists in DOM before removing attribute
      if (ele.isConnected) {
        ele.removeAttribute(STARTING_STYLE_ATTR);
      }
      // Remove the stylesheet regardless of element connection to avoid leaks
      ass.delete(uuid);
    });
  });
};

// --- Example Usage (Optional, for testing within this file) ---
/*
document.addEventListener('DOMContentLoaded', () => {
    const box = document.createElement('div');
    box.id = 'shim-test-box';
    box.textContent = 'Shim Test';
    Object.assign(box.style, {
        width: '100px',
        height: '100px',
        marginTop: '20px',
        backgroundColor: 'coral',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Define transition IN CSS or via style - must exist beforehand
        transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out',
    });
    document.body.appendChild(box);

    // Make the box initially invisible (final state requires opacity: 1)
    box.style.opacity = '1'; // Set final style state before shim
    box.style.transform = 'translateX(100px)'; // Set final style state

    console.log('Applying starting style shim...');
    // Start the transition from opacity 0 and no transform
    css_starting_style_shim(box, {
        opacity: 0,
        transform: 'translateX(0px) scale(0.5)',
    });

    // No need to add a class here if the final state is already set via style/CSS rules
    // The removal of the shim's attribute will trigger the transition *to* the
    // styles defined by box.style or CSS rules matching the element.
});
*/

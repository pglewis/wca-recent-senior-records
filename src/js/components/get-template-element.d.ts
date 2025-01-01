/**
 * Helper function. Requires a single, root HTMLElement inside the template
 *
 * Finds the first template element in the document that matches the
 * specified group of selectors, clones its content, and returns the
 * root HTMLElement inside DocumentFragment.
 * @param   selectors
 * @throws
 */
export declare function getTemplateElement(selectors: string): HTMLElement

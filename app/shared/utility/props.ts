/**
 * Returns a string 'true' if the condition is truthy, otherwise returns undefined.
 *
 * @param condition - The condition to evaluate.
 * @returns 'true' if the condition is truthy, otherwise undefined.
 */
export function dataAttr(condition: unknown | undefined) {
	return condition ? 'true' : undefined;
}

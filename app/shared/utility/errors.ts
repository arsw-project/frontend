import { useCallback } from 'react';
import { z } from 'zod';

type PossibleErrors =
	| undefined
	| string
	| string[]
	| z.infer<typeof issueErrorSchema>
	| z.infer<typeof issueErrorsSchema>;

/**
 * Zod schema for validating an issue error object.
 *
 * @property message - An optional error message describing the issue.
 */
const issueErrorSchema = z
	.object({
		message: z.string().optional(),
	})
	.optional();

/**
 * Schema representing an array of issue errors.
 * Each element in the array must conform to the `issueErrorSchema`.
 */
const issueErrorsSchema = z.array(issueErrorSchema);

/**
 * Extracts error messages from various error formats into a string array.
 *
 * Accepts errors as a string, an array of strings, or objects conforming to
 * `issueErrorSchema` or `issueErrorsSchema`. Returns an array of error messages.
 *
 * @param errors - The error(s) to extract messages from. Can be a string, array of strings,
 *   or objects matching the schemas.
 * @returns An array of error messages as strings.
 */
export const translateFieldErrors = (
	errors: PossibleErrors = undefined,
): string[] => {
	if (errors === undefined) {
		return [];
	}

	if (z.string().safeParse(errors).success) {
		const parsed = z.string().parse(errors);
		return [parsed];
	}

	if (z.array(z.string()).safeParse(errors).success) {
		const parsed = z.array(z.string()).parse(errors);
		return parsed;
	}

	if (issueErrorSchema.safeParse(errors).success) {
		const parsed = issueErrorSchema.parse(errors);
		return parsed?.message ? [parsed.message] : [];
	}

	const parsedErrors = issueErrorsSchema.safeParse(errors);

	if (parsedErrors.success) {
		return parsedErrors.data
			.map((error) => error?.message || 'unknown')
			.filter(Boolean) as string[];
	}

	return [];
};

export const useErrorParser = () => {
	const parseFieldErrors = useCallback(
		(errors: PossibleErrors): string[] => translateFieldErrors(errors),
		[],
	);

	return { parseFieldErrors };
};

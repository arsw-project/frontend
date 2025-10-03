import { useCallback } from 'react';
import { z } from 'zod';

type PossibleErrors =
	| undefined
	| string
	| string[]
	| z.infer<typeof issueErrorSchema>
	| z.infer<typeof issueErrorsSchema>;

export type ApiError = z.infer<typeof apiErrorSchema>;

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
export const extractFieldErrorMessages = (
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
		(errors: PossibleErrors): string[] => extractFieldErrorMessages(errors),
		[],
	);

	return { parseFieldErrors };
};

/**
 * Converts a Zod path array to a TanStack Form field name string.
 * Handles nested objects and arrays.
 *
 * @param path - The Zod path array (e.g., ['details', 'email'] or ['items', 0, 'name'])
 * @returns The field name string (e.g., 'details.email' or 'items[0].name')
 */
export const zodPathToFieldName = (path: PropertyKey[]): string => {
	return path
		.map((segment, index) => {
			if (typeof segment === 'number') {
				return `[${segment}]`;
			}
			if (typeof segment === 'string') {
				if (index === 0) {
					return segment;
				}
				return `.${segment}`;
			}
			// Handle symbol case (though unlikely in practice)
			return `[${String(segment)}]`;
		})
		.join('');
};

/**
 * Converts Zod validation issues to TanStack Form errorMap format.
 * Groups errors by field path and converts path arrays to dot notation.
 *
 * @param issues - Array of Zod issues from a validation error
 * @returns TanStack Form errorMap object with field errors
 */
export const zodIssuesToErrorMap = (
	issues: z.core.$ZodIssue[],
): { onSubmit: { fields: Record<string, string> } } => {
	const fieldErrors: Record<string, string> = {};

	for (const issue of issues) {
		const fieldName = zodPathToFieldName(issue.path);

		// If there are multiple errors for the same field, keep the first one
		// TanStack Form expects a single string per field in errorMap
		if (!fieldErrors[fieldName]) {
			fieldErrors[fieldName] = issue.message;
		}
	}

	return {
		onSubmit: {
			fields: fieldErrors,
		},
	};
};

/**
 * Converts a ZodError or ApiError to TanStack Form errorMap format.
 * This is a convenience function that extracts issues from a ZodError or maps errors from an ApiError.
 *
 * @param error - The ZodError or ApiError to convert
 * @returns TanStack Form errorMap object with field errors
 */
export const zodErrorToErrorMap = (
	error: z.ZodError | ApiError,
): { onSubmit: { fields: Record<string, string> } } => {
	if (isApiError(error)) {
		// Map ApiError.errors to ZodIssue-like objects
		const issues = error.errors.map((err) => ({
			path: err.path,
			message: err.message,
		}));
		return zodIssuesToErrorMap(issues as z.core.$ZodIssue[]);
	} else {
		return zodIssuesToErrorMap(error.issues);
	}
};

/**
 * Zod schema for validating an individual error detail in the API error response.
 *
 * @property code - The error code.
 * @property message - The error message.
 * @property path - The path to the field that caused the error.
 */
const apiErrorDetailSchema = z.object({
	code: z.string(),
	message: z.string(),
	path: z.array(z.string()),
});

/**
 * Zod schema for validating an API error response.
 *
 * @property message - The main error message.
 * @property code - The error code.
 * @property errors - An array of detailed error objects.
 */
const apiErrorSchema = z.object({
	message: z.string(),
	code: z.string(),
	errors: z.array(apiErrorDetailSchema),
});

/**
 * Checks if the provided value is an API error matching the expected schema.
 *
 * @param error - The value to check.
 * @returns True if the value matches the API error schema, false otherwise.
 */
export const isApiError = (error: unknown): error is ApiError => {
	return apiErrorSchema.safeParse(error).success;
};

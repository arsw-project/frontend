import { type Dictionary, t } from 'intlayer';

const fieldErrorContent = {
	key: 'field-error',
	content: {
		validationError: t({
			en: 'validation error',
			es: 'error de validación',
		}),
		validationErrors: t({
			en: 'validation errors',
			es: 'errores de validación',
		}),
		and: t({
			en: 'and',
			es: 'y',
		}),
		more: t({
			en: 'more',
			es: 'más',
		}),
	},
} satisfies Dictionary;

export default fieldErrorContent;

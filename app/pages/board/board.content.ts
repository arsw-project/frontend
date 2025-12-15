import { type Dictionary, t } from 'intlayer';

const boardContent = {
	key: 'board',
	content: {
		title: t({
			en: 'Board',
			es: 'Tablero',
		}),
		subtitle: t({
			en: 'Manage your tickets and track progress',
			es: 'Gestiona tus tickets y rastrea el progreso',
		}),
		columnOpen: t({
			en: 'Open',
			es: 'Abierto',
		}),
		columnInProgress: t({
			en: 'In Progress',
			es: 'En Progreso',
		}),
		columnDone: t({
			en: 'Done',
			es: 'Completado',
		}),
		emptyColumn: t({
			en: 'No tickets yet',
			es: 'No hay tickets aún',
		}),
		ticketCount: t({
			en: 'tickets',
			es: 'tickets',
		}),
		createTicket: t({
			en: 'Create ticket',
			es: 'Crear ticket',
		}),
		createTicketTitle: t({
			en: 'Create Ticket',
			es: 'Crear Ticket',
		}),
		ticketTitle: t({
			en: 'Title',
			es: 'Título',
		}),
		ticketTitlePlaceholder: t({
			en: 'Enter ticket title',
			es: 'Ingresa el título del ticket',
		}),
		ticketDescription: t({
			en: 'Description',
			es: 'Descripción',
		}),
		ticketDescriptionPlaceholder: t({
			en: 'Enter ticket description',
			es: 'Ingresa la descripción del ticket',
		}),
		difficulty: t({
			en: 'Difficulty',
			es: 'Dificultad',
		}),
		acceptanceCriteria: t({
			en: 'Acceptance Criteria',
			es: 'Criterios de Aceptación',
		}),
		acceptanceCriteriaLabel: t({
			en: 'Acceptance Criteria',
			es: 'Criterios de Aceptación',
		}),
		acceptanceCriteriaPlaceholder: t({
			en: 'Add acceptance criteria',
			es: 'Agrega un criterio de aceptación',
		}),
		tags: t({
			en: 'Tags',
			es: 'Etiquetas',
		}),
		tagPlaceholder: t({
			en: 'Add tag',
			es: 'Agrega una etiqueta',
		}),
		add: t({
			en: 'Add',
			es: 'Agregar',
		}),
		tagsLabel: t({
			en: 'Tags',
			es: 'Etiquetas',
		}),
		titleRequired: t({
			en: 'Title is required',
			es: 'El título es requerido',
		}),
		descriptionRequired: t({
			en: 'Description is required',
			es: 'La descripción es requerida',
		}),
		acceptanceCriteriaRequired: t({
			en: 'At least one acceptance criterion is required',
			es: 'Al menos un criterio de aceptación es requerido',
		}),
		tagsRequired: t({
			en: 'At least one tag is required',
			es: 'Al menos una etiqueta es requerida',
		}),
		difficultySmall: t({
			en: 'Small',
			es: 'Pequeña',
		}),
		difficultyMedium: t({
			en: 'Medium',
			es: 'Mediana',
		}),
		difficultyLarge: t({
			en: 'Large',
			es: 'Grande',
		}),
		cancel: t({
			en: 'Cancel',
			es: 'Cancelar',
		}),
		create: t({
			en: 'Create',
			es: 'Crear',
		}),
	},
} satisfies Dictionary;

export default boardContent;

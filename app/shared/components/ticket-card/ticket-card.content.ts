import { type Dictionary, t } from 'intlayer';

const ticketCardContent = {
	key: 'ticket-card',
	content: {
		openMeetingRoom: t({
			en: 'Open meeting room',
			es: 'Abrir sala de reunión',
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
		createdBy: t({
			en: 'Created by',
			es: 'Creado por',
		}),
		assignedTo: t({
			en: 'Assigned to',
			es: 'Asignado a',
		}),
		unassigned: t({
			en: 'Unassigned',
			es: 'Sin asignar',
		}),
		acceptanceCriteria: t({
			en: 'Acceptance Criteria',
			es: 'Criterios de Aceptación',
		}),
		viewDetails: t({
			en: 'View Details',
			es: 'Ver Detalles',
		}),
		updated: t({
			en: 'Updated',
			es: 'Actualizado',
		}),
		priorityHigh: t({
			en: 'High Priority',
			es: 'Prioridad Alta',
		}),
		priorityMedium: t({
			en: 'Medium Priority',
			es: 'Prioridad Media',
		}),
		priorityLow: t({
			en: 'Low Priority',
			es: 'Prioridad Baja',
		}),
	},
} satisfies Dictionary;

export default ticketCardContent;

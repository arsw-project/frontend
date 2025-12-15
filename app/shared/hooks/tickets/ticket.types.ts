import type {
	TicketDifficulty,
	TicketStatus,
} from '@pages/board/board.validators';

// Ticket API Type - matches the backend response structure
export type TicketApi = {
	id: string;
	orgId: string;
	title: string;
	description: string;
	acceptanceCriteria: string[];
	status: TicketStatus;
	assigneeId: string | null;
	difficulty: TicketDifficulty;
	tags: string[];
	createdBy: string;
	createdAt: string;
	updatedAt: string;
};

// Get Tickets by Organization Response
export type GetTicketsResponse = {
	tickets: TicketApi[];
};

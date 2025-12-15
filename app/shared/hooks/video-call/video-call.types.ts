/**
 * Video Call Types
 * Type definitions for Socket.IO events and WebRTC state management
 */

// ============================================================================
// User and Participant Types
// ============================================================================

export type UserInfo = {
	id: string;
	name: string;
	email: string;
	role: string;
};

export type Participant = {
	socketId: string;
	user: UserInfo;
};

// ============================================================================
// Chat Message Types
// ============================================================================

export type ChatMessage = {
	id: string;
	userId: string;
	userName: string;
	content: string;
	timestamp: string;
};

// ============================================================================
// WebRTC Types
// ============================================================================

export type RTCSignalData = RTCSessionDescriptionInit | RTCIceCandidateInit;

export type PeerConnection = {
	connection: RTCPeerConnection;
	stream: MediaStream | null;
	userName: string;
};

// ============================================================================
// Socket.IO Event Payloads
// ============================================================================

// Client -> Server Events
export type JoinRoomPayload = {
	ticketId: string;
	sessionToken?: string;
};

export type ChatMessagePayload = {
	content: string;
};

export type SignalPayload = {
	targetSocketId: string;
	signal: RTCSignalData;
};

// Server -> Client Events
export type RoomJoinedPayload = {
	ticketId: string;
	participants: Participant[];
	chatHistory: ChatMessage[];
};

export type UserJoinedPayload = {
	socketId: string;
	user: UserInfo;
};

export type UserLeftPayload = {
	socketId: string;
	user?: UserInfo;
};

export type OfferPayload = {
	senderSocketId: string;
	signal: RTCSessionDescriptionInit;
};

export type AnswerPayload = {
	senderSocketId: string;
	signal: RTCSessionDescriptionInit;
};

export type IceCandidatePayload = {
	senderSocketId: string;
	signal: RTCIceCandidateInit | null;
};

export type RoomClosedPayload = {
	reason: string;
	message: string;
};

export type ErrorPayload = {
	code: string;
	message: string;
};

export type ScreenSharePayload = {
	socketId: string;
};

// ============================================================================
// Event Log Types
// ============================================================================

export type EventLogType =
	| 'info'
	| 'success'
	| 'error'
	| 'warning'
	| 'connection';

export type EventLogEntry = {
	id: string;
	type: EventLogType;
	message: string;
	timestamp: Date;
};

// ============================================================================
// Video Call State
// ============================================================================

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export type RoomState = 'idle' | 'joining' | 'joined' | 'leaving';

export type MediaState = {
	hasVideo: boolean;
	hasAudio: boolean;
	isSharingScreen: boolean;
};

export type VideoCallState = {
	// Connection
	connectionState: ConnectionState;
	roomState: RoomState;
	mySocketId: string | null;

	// Room data
	ticketId: string | null;
	participants: Participant[];

	// Media
	localStream: MediaStream | null;
	screenStream: MediaStream | null;
	mediaState: MediaState;

	// Peers
	peerConnections: Map<string, PeerConnection>;

	// Chat
	chatMessages: ChatMessage[];

	// Event log
	eventLog: EventLogEntry[];

	// Errors
	error: string | null;
};

// ============================================================================
// Hook Return Types
// ============================================================================

// Helper type for event handlers - allows any parameters for flexibility
type EventHandler = (...args: never[]) => void;

export type UseSocketReturn = {
	socket: { id?: string; disconnect: () => void } | null;
	isConnected: boolean;
	error: string | null;
	connect: () => void;
	disconnect: () => void;
	emit: (event: string, ...args: unknown[]) => void;
	on: <T extends EventHandler>(event: string, handler: T) => void;
	off: <T extends EventHandler>(event: string, handler: T) => void;
};

export type UseVideoCallReturn = {
	// State
	state: VideoCallState;

	// Room actions
	joinRoom: (ticketId: string) => void;
	leaveRoom: () => void;

	// Media actions
	startVideo: () => Promise<void>;
	stopVideo: () => void;
	shareScreen: () => Promise<void>;
	stopScreenShare: () => Promise<void>;

	// Chat actions
	sendMessage: (content: string) => void;

	// Utility
	clearError: () => void;
	clearEventLog: () => void;
};

// ============================================================================
// Configuration
// ============================================================================

export type VideoCallConfig = {
	serverUrl?: string;
	iceServers?: RTCIceServer[];
	autoConnect?: boolean;
};

export const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
	{ urls: 'stun:stun.l.google.com:19302' },
	{ urls: 'stun:stun1.l.google.com:19302' },
	{ urls: 'stun:stun2.l.google.com:19302' },
];

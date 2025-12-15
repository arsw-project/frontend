import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from './use-socket.hook';
import type {
	AnswerPayload,
	ChatMessage,
	EventLogEntry,
	EventLogType,
	IceCandidatePayload,
	MediaState,
	OfferPayload,
	Participant,
	PeerConnection,
	RoomClosedPayload,
	RoomJoinedPayload,
	RoomState,
	ScreenSharePayload,
	UserJoinedPayload,
	UserLeftPayload,
	UseVideoCallReturn,
	VideoCallConfig,
	VideoCallState,
} from './video-call.types';

const ICE_SERVERS = [
	{ urls: 'stun:stun.l.google.com:19302' },
	{ urls: 'stun:stun1.l.google.com:19302' },
	{ urls: 'stun:stun2.l.google.com:19302' },
];

/**
 * Main hook for managing video call functionality
 * Handles WebRTC peer connections, media streams, chat, and room state
 */
export const useVideoCall = (
	config: VideoCallConfig = {},
): UseVideoCallReturn => {
	const { serverUrl, iceServers = ICE_SERVERS, autoConnect = true } = config;

	// Socket connection
	const socket = useSocket(serverUrl);

	// State management
	const [roomState, setRoomState] = useState<RoomState>('idle');
	const [ticketId, setTicketId] = useState<string | null>(null);
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
	const [mediaState, setMediaState] = useState<MediaState>({
		hasVideo: false,
		hasAudio: false,
		isSharingScreen: false,
	});
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
	const [error, setError] = useState<string | null>(null);

	// Refs for managing peer connections
	const peerConnectionsRef = useRef<Map<string, PeerConnection>>(new Map());
	const pendingCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(
		new Map(),
	);

	/**
	 * Add log entry to event log
	 */
	const addLog = useCallback((message: string, type: EventLogType = 'info') => {
		const entry: EventLogEntry = {
			id: `${Date.now()}-${Math.random()}`,
			type,
			message,
			timestamp: new Date(),
		};
		setEventLog((prev) => [...prev, entry]);
		console.log(`[VideoCall ${type}]`, message);
	}, []);

	/**
	 * Create a peer connection for a specific socket ID
	 */
	const createPeerConnection = useCallback(
		(
			socketId: string,
			initiator: boolean,
			userName = '',
		): RTCPeerConnection => {
			addLog(
				`Creating peer connection to ${userName || socketId}, initiator: ${initiator}`,
				'info',
			);

			// Create new peer connection
			const pc = new RTCPeerConnection({ iceServers });

			// Handle ICE candidates
			pc.onicecandidate = (event) => {
				if (event.candidate && socket.isConnected) {
					addLog(`Sending ICE candidate to ${socketId}`, 'info');
					// Extract only required properties for backend schema
					socket.emit('ice-candidate', {
						targetSocketId: socketId,
						signal: {
							candidate: event.candidate.candidate,
							sdpMid: event.candidate.sdpMid,
							sdpMLineIndex: event.candidate.sdpMLineIndex,
							usernameFragment: event.candidate.usernameFragment,
						},
					});
				}
			};

			// Handle ICE connection state changes
			pc.oniceconnectionstatechange = () => {
				const state = pc.iceConnectionState;
				addLog(
					`ICE connection state with ${socketId}: ${state}`,
					state === 'connected' || state === 'completed' ? 'success' : 'info',
				);

				if (state === 'failed' || state === 'disconnected') {
					addLog(`Connection to ${socketId} ${state}`, 'warning');
				}
			};

			// Handle connection state changes
			pc.onconnectionstatechange = () => {
				const state = pc.connectionState;
				addLog(
					`Connection state with ${socketId}: ${state}`,
					state === 'connected' ? 'success' : 'info',
				);
			};

			// Handle incoming tracks (video/audio from remote peer)
			pc.ontrack = (event) => {
				addLog(
					`Received ${event.track.kind} track from ${socketId}`,
					'success',
				);

				// Update the peer connection's stream
				peerConnectionsRef.current.set(socketId, {
					connection: pc,
					stream: event.streams[0] || new MediaStream([event.track]),
					userName,
				});

				// Trigger re-render by creating new Map
				const newMap = new Map(peerConnectionsRef.current);
				peerConnectionsRef.current = newMap;
			};

			// Add local tracks if available
			if (localStream) {
				for (const track of localStream.getTracks()) {
					pc.addTrack(track, localStream);
					addLog(`Added local ${track.kind} track to ${socketId}`, 'info');
				}
			}

			// Store peer connection
			peerConnectionsRef.current.set(socketId, {
				connection: pc,
				stream: null,
				userName,
			});

			// If we're the initiator, create and send offer
			if (initiator) {
				setTimeout(async () => {
					try {
						const offer = await pc.createOffer({
							offerToReceiveAudio: true,
							offerToReceiveVideo: true,
						});
						await pc.setLocalDescription(offer);
						addLog(`Sending offer to ${socketId}`, 'info');
						// Extract only required properties for backend schema
						const localDesc = pc.localDescription;
						if (localDesc) {
							socket.emit('offer', {
								targetSocketId: socketId,
								signal: {
									type: localDesc.type,
									sdp: localDesc.sdp,
								},
							});
						}
					} catch (err) {
						addLog(
							`Error creating offer: ${err instanceof Error ? err.message : 'Unknown error'}`,
							'error',
						);
					}
				}, 500);
			}

			return pc;
		},
		[iceServers, localStream, socket, addLog],
	);

	/**
	 * Close peer connection and clean up resources
	 */
	const closePeerConnection = useCallback(
		(socketId: string) => {
			addLog(`Closing peer connection to ${socketId}`, 'info');

			const peer = peerConnectionsRef.current.get(socketId);
			if (peer) {
				peer.connection.close();
				peerConnectionsRef.current.delete(socketId);
			}

			pendingCandidatesRef.current.delete(socketId);
		},
		[addLog],
	);

	/**
	 * Process pending ICE candidates for a peer
	 */
	const processPendingCandidates = useCallback(
		async (socketId: string) => {
			const candidates = pendingCandidatesRef.current.get(socketId);
			if (candidates && candidates.length > 0) {
				const peer = peerConnectionsRef.current.get(socketId);
				if (peer) {
					for (const candidate of candidates) {
						try {
							await peer.connection.addIceCandidate(
								new RTCIceCandidate(candidate),
							);
						} catch (err) {
							addLog(
								`Error adding queued ICE candidate: ${err instanceof Error ? err.message : 'Unknown'}`,
								'error',
							);
						}
					}
					addLog(
						`Processed ${candidates.length} queued ICE candidates for ${socketId}`,
						'info',
					);
					pendingCandidatesRef.current.delete(socketId);
				}
			}
		},
		[addLog],
	);

	/**
	 * Join a room
	 */
	const joinRoom = useCallback(
		(newTicketId: string) => {
			if (!socket.isConnected) {
				setError('Not connected to server');
				addLog('Cannot join room: not connected to server', 'error');
				return;
			}

			addLog(`Joining room for ticket ${newTicketId}`, 'info');
			console.log('[VideoCall] Emitting join-room event:', {
				ticketId: newTicketId,
			});
			setRoomState('joining');
			setTicketId(newTicketId);
			socket.emit('join-room', { ticketId: newTicketId });
		},
		[socket, addLog],
	);

	/**
	 * Leave the current room
	 */
	const leaveRoom = useCallback(() => {
		addLog('Leaving room', 'info');
		setRoomState('leaving');

		// Emit leave-room event
		if (socket.isConnected) {
			socket.emit('leave-room');
		}

		// Close all peer connections
		for (const socketId of peerConnectionsRef.current.keys()) {
			closePeerConnection(socketId);
		}

		// Stop local media
		if (localStream) {
			for (const track of localStream.getTracks()) {
				track.stop();
			}
			setLocalStream(null);
		}

		if (screenStream) {
			for (const track of screenStream.getTracks()) {
				track.stop();
			}
			setScreenStream(null);
		}

		// Reset state
		setRoomState('idle');
		setTicketId(null);
		setParticipants([]);
		setMediaState({ hasVideo: false, hasAudio: false, isSharingScreen: false });
		setChatMessages([]);
	}, [socket, localStream, screenStream, closePeerConnection, addLog]);

	/**
	 * Start video and audio
	 */
	const startVideo = useCallback(async () => {
		try {
			addLog('Starting local video', 'info');

			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			setLocalStream(stream);
			setMediaState((prev) => ({
				...prev,
				hasVideo: true,
				hasAudio: true,
			}));

			addLog(
				`Started local video with ${stream.getTracks().length} tracks`,
				'success',
			);

			// Add tracks to all existing peer connections
			for (const [socketId, peer] of peerConnectionsRef.current.entries()) {
				const pc = peer.connection;
				const senders = pc.getSenders();

				for (const track of stream.getTracks()) {
					const existingSender = senders.find(
						(s) => s.track?.kind === track.kind,
					);
					if (!existingSender) {
						pc.addTrack(track, stream);
						addLog(`Added ${track.kind} track to ${socketId}`, 'info');
					}
				}

				// Renegotiate
				try {
					const offer = await pc.createOffer({
						offerToReceiveAudio: true,
						offerToReceiveVideo: true,
					});
					await pc.setLocalDescription(offer);
					// Extract only required properties for backend schema
					const localDesc = pc.localDescription;
					if (localDesc) {
						socket.emit('offer', {
							targetSocketId: socketId,
							signal: {
								type: localDesc.type,
								sdp: localDesc.sdp,
							},
						});
					}
					addLog(`Sent renegotiation offer to ${socketId}`, 'info');
				} catch (err) {
					addLog(
						`Error renegotiating with ${socketId}: ${err instanceof Error ? err.message : 'Unknown'}`,
						'error',
					);
				}
			}
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to start video';
			addLog(message, 'error');
			setError(message);
		}
	}, [socket, addLog]);

	/**
	 * Stop video and audio
	 */
	const stopVideo = useCallback(() => {
		if (localStream) {
			for (const track of localStream.getTracks()) {
				track.stop();
			}
			setLocalStream(null);
			setMediaState((prev) => ({
				...prev,
				hasVideo: false,
				hasAudio: false,
			}));
			addLog('Video stopped', 'info');
		}
	}, [localStream, addLog]);

	/**
	 * Stop screen sharing
	 */
	const stopScreenShare = useCallback(async () => {
		if (screenStream) {
			for (const track of screenStream.getTracks()) {
				track.stop();
			}
			setScreenStream(null);
			setMediaState((prev) => ({ ...prev, isSharingScreen: false }));

			// Restore camera track if available
			if (localStream) {
				const cameraTrack = localStream.getVideoTracks()[0];
				for (const [socketId, peer] of peerConnectionsRef.current.entries()) {
					const sender = peer.connection
						.getSenders()
						.find((s) => s.track?.kind === 'video');
					if (sender && cameraTrack) {
						await sender.replaceTrack(cameraTrack);
						addLog(`Restored camera track for ${socketId}`, 'info');
					}
				}
			}

			socket.emit('screen-share-stopped');
			addLog('Screen sharing stopped', 'info');
		}
	}, [screenStream, localStream, socket, addLog]);

	/**
	 * Start screen sharing
	 */
	const shareScreen = useCallback(async () => {
		try {
			addLog('Starting screen share', 'info');

			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true,
			});

			setScreenStream(stream);
			setMediaState((prev) => ({ ...prev, isSharingScreen: true }));

			const screenTrack = stream.getVideoTracks()[0];

			// Replace video track with screen track in all peer connections
			for (const [socketId, peer] of peerConnectionsRef.current.entries()) {
				const pc = peer.connection;
				const sender = pc.getSenders().find((s) => s.track?.kind === 'video');

				if (sender) {
					await sender.replaceTrack(screenTrack);
					addLog(`Replaced video track with screen for ${socketId}`, 'info');
				} else {
					pc.addTrack(screenTrack, stream);
					addLog(`Added screen track to ${socketId}`, 'info');

					// Renegotiate
					const offer = await pc.createOffer();
					await pc.setLocalDescription(offer);
					// Extract only required properties for backend schema
					const localDesc = pc.localDescription;
					if (localDesc) {
						socket.emit('offer', {
							targetSocketId: socketId,
							signal: {
								type: localDesc.type,
								sdp: localDesc.sdp,
							},
						});
					}
				}
			}

			socket.emit('screen-share-started');
			addLog('Screen sharing started', 'success');

			// Handle when user stops sharing via browser UI
			screenTrack.onended = () => {
				stopScreenShare();
			};
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to share screen';
			addLog(message, 'error');
			setError(message);
		}
	}, [socket, addLog, stopScreenShare]);

	/**
	 * Send chat message
	 */
	const sendMessage = useCallback(
		(content: string) => {
			if (!socket.isConnected) {
				console.error('[VideoCall] Cannot send message: not connected');
				return;
			}

			if (!content.trim()) {
				console.warn('[VideoCall] Cannot send empty message');
				return;
			}

			console.log('[VideoCall] Sending chat message:', content.trim());
			socket.emit('chat-message', { content: content.trim() });
		},
		[socket],
	);

	/**
	 * Clear error state
	 */
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	/**
	 * Clear event log
	 */
	const clearEventLog = useCallback(() => {
		setEventLog([]);
	}, []);

	/**
	 * Setup Socket.IO event handlers
	 */
	useEffect(() => {
		if (!socket.socket) return;

		// Room joined
		const handleRoomJoined = (data: RoomJoinedPayload) => {
			addLog(
				`Joined room: ${data.ticketId} with ${data.participants.length} existing participants`,
				'success',
			);
			console.log('[VideoCall] ===== ROOM JOINED =====');
			console.log('[VideoCall] Room joined data:', data);
			console.log('[VideoCall] Chat history received:', data.chatHistory);
			console.log('[VideoCall] Chat history count:', data.chatHistory.length);

			// Log each history message
			data.chatHistory.forEach((msg, index) => {
				console.log(`[VideoCall] History message ${index}:`, {
					fullMessage: msg,
					hasContent: !!(msg as any).content,
					hasMessage: !!(msg as any).message,
					content: (msg as any).content,
					message: (msg as any).message,
					timestamp: msg.timestamp,
				});
			});

			setRoomState('joined');
			setParticipants(data.participants);

			// Convert timestamps to Date objects
			// Backend sends 'createdAt', we need to map it to 'timestamp'
			const chatHistoryWithDates = data.chatHistory.map((msg: any) => {
				const timestamp = msg.timestamp || msg.createdAt;
				return {
					...msg,
					timestamp:
						typeof timestamp === 'string' ? new Date(timestamp) : timestamp,
				};
			});
			console.log(
				'[VideoCall] Chat history with converted dates:',
				chatHistoryWithDates,
			);
			console.log(
				'[VideoCall] Setting chat messages to:',
				chatHistoryWithDates.length,
				'messages',
			);
			setChatMessages(chatHistoryWithDates);
		};

		// User joined
		const handleUserJoined = async (data: UserJoinedPayload) => {
			addLog(`User joined: ${data.user.name} (${data.socketId})`, 'info');
			console.log('[VideoCall] User joined:', data);

			setParticipants((prev) => [...prev, data]);

			// Create peer connection and send offer (we're existing participant)
			createPeerConnection(data.socketId, true, data.user.name);
		};

		// User left
		const handleUserLeft = (data: UserLeftPayload) => {
			addLog(`User left: ${data.user?.name || data.socketId}`, 'info');
			console.log('[VideoCall] User left:', data);

			setParticipants((prev) =>
				prev.filter((p) => p.socketId !== data.socketId),
			);

			// Close and remove peer connection
			const peer = peerConnectionsRef.current.get(data.socketId);
			if (peer) {
				peer.connection.close();
				peerConnectionsRef.current.delete(data.socketId);
				setRemoteStreams((prev) => {
					const updated = new Map(prev);
					updated.delete(data.socketId);
					return updated;
				});
			}
		};

		// Received offer
		const handleOffer = async (data: OfferPayload) => {
			addLog(`Received offer from ${data.senderSocketId}`, 'info');

			// Create peer connection if it doesn't exist
			let peer = peerConnectionsRef.current.get(data.senderSocketId);
			if (!peer) {
				createPeerConnection(data.senderSocketId, false);
				peer = peerConnectionsRef.current.get(data.senderSocketId);
			}

			if (peer) {
				const pc = peer.connection;
				try {
					await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
					addLog(
						`Set remote description (offer) from ${data.senderSocketId}`,
						'info',
					);

					// Process pending ICE candidates
					await processPendingCandidates(data.senderSocketId);

					// Create and send answer
					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);
					addLog(`Sending answer to ${data.senderSocketId}`, 'info');

					// Extract only required properties for backend schema
					socket.emit('answer', {
						targetSocketId: data.senderSocketId,
						signal: {
							type: answer.type,
							sdp: answer.sdp,
						},
					});
				} catch (err) {
					addLog(
						`Error handling offer: ${err instanceof Error ? err.message : 'Unknown'}`,
						'error',
					);
				}
			}
		};

		// Received answer
		const handleAnswer = async (data: AnswerPayload) => {
			addLog(`Received answer from ${data.senderSocketId}`, 'info');

			const peer = peerConnectionsRef.current.get(data.senderSocketId);
			if (peer) {
				try {
					await peer.connection.setRemoteDescription(
						new RTCSessionDescription(data.signal),
					);
					addLog(
						`Set remote description (answer) from ${data.senderSocketId}`,
						'success',
					);

					// Process pending ICE candidates
					await processPendingCandidates(data.senderSocketId);
				} catch (err) {
					addLog(
						`Error handling answer: ${err instanceof Error ? err.message : 'Unknown'}`,
						'error',
					);
				}
			}
		};

		// Received ICE candidate
		const handleIceCandidate = async (data: IceCandidatePayload) => {
			const peer = peerConnectionsRef.current.get(data.senderSocketId);
			if (peer && data.signal) {
				try {
					if (peer.connection.remoteDescription) {
						await peer.connection.addIceCandidate(
							new RTCIceCandidate(data.signal),
						);
						addLog(`Added ICE candidate from ${data.senderSocketId}`, 'info');
					} else {
						// Queue candidate until we have remote description
						const pending =
							pendingCandidatesRef.current.get(data.senderSocketId) || [];
						pending.push(data.signal);
						pendingCandidatesRef.current.set(data.senderSocketId, pending);
						addLog(`Queued ICE candidate from ${data.senderSocketId}`, 'info');
					}
				} catch (err) {
					addLog(
						`Error adding ICE candidate: ${err instanceof Error ? err.message : 'Unknown'}`,
						'error',
					);
				}
			}
		};

		// Room left
		const handleRoomLeft = () => {
			addLog('Left room', 'info');
			leaveRoom();
		};

		// Room closed
		const handleRoomClosed = (data: RoomClosedPayload) => {
			addLog(`Room closed: ${data.reason} - ${data.message}`, 'error');
			setError(`Room closed: ${data.message}`);
			leaveRoom();
		};

		// Chat message
		const handleChatMessage = (msg: ChatMessage) => {
			console.log('[VideoCall] ===== CHAT MESSAGE RECEIVED =====');
			console.log('[VideoCall] Raw message:', msg);
			console.log('[VideoCall] Message fields:', {
				id: msg.id,
				userId: msg.userId,
				userName: msg.userName,
				content: msg.content,
				message: (msg as any).message,
				timestamp: msg.timestamp,
				createdAt: (msg as any).createdAt,
				timestampType: typeof msg.timestamp,
			});

			// Convert timestamp to Date if it's a string
			// Backend sends 'createdAt', we need to map it to 'timestamp'
			const timestamp = msg.timestamp || (msg as any).createdAt;
			const messageWithDate: ChatMessage = {
				...msg,
				timestamp:
					typeof timestamp === 'string' ? new Date(timestamp) : timestamp,
			};

			console.log('[VideoCall] Message with converted date:', messageWithDate);

			setChatMessages((prev) => {
				const updated = [...prev, messageWithDate];
				console.log('[VideoCall] Previous chat messages:', prev.length, prev);
				console.log(
					'[VideoCall] Updated chat messages:',
					updated.length,
					updated,
				);
				return updated;
			});
			addLog(`New message from ${msg.userName}`, 'info');
		};

		// Screen share events
		const handleScreenShareStarted = (data: ScreenSharePayload) => {
			addLog(`User ${data.socketId} started screen sharing`, 'info');
		};

		const handleScreenShareStopped = (data: ScreenSharePayload) => {
			addLog(`User ${data.socketId} stopped screen sharing`, 'info');
		};

		// Error
		const handleError = (data: { code: string; message: string }) => {
			addLog(`Error: ${data.message} (${data.code})`, 'error');
			console.error('[VideoCall] Server error:', data);
			setError(data.message);

			// If it's an auth error, reset room state
			if (data.code === 'UNAUTHORIZED' || data.code === 'FORBIDDEN') {
				setRoomState('idle');
			}
		};

		// Register all event handlers
		socket.on('room-joined', handleRoomJoined);
		socket.on('user-joined', handleUserJoined);
		socket.on('user-left', handleUserLeft);
		socket.on('offer', handleOffer);
		socket.on('answer', handleAnswer);
		socket.on('ice-candidate', handleIceCandidate);
		socket.on('room-left', handleRoomLeft);
		socket.on('room-closed', handleRoomClosed);
		socket.on('chat-message', handleChatMessage);
		socket.on('screen-share-started', handleScreenShareStarted);
		socket.on('screen-share-stopped', handleScreenShareStopped);
		socket.on('error', handleError);

		// Cleanup event handlers on unmount or socket change
		return () => {
			socket.off('room-joined', handleRoomJoined);
			socket.off('user-joined', handleUserJoined);
			socket.off('user-left', handleUserLeft);
			socket.off('offer', handleOffer);
			socket.off('answer', handleAnswer);
			socket.off('ice-candidate', handleIceCandidate);
			socket.off('room-left', handleRoomLeft);
			socket.off('room-closed', handleRoomClosed);
			socket.off('chat-message', handleChatMessage);
			socket.off('screen-share-started', handleScreenShareStarted);
			socket.off('screen-share-stopped', handleScreenShareStopped);
			socket.off('error', handleError);
		};
	}, [
		socket,
		addLog,
		createPeerConnection,
		closePeerConnection,
		processPendingCandidates,
		leaveRoom,
	]);

	/**
	 * Auto-connect on mount if enabled
	 */
	useEffect(() => {
		if (autoConnect && !socket.isConnected) {
			socket.connect();
		}
	}, [autoConnect, socket]);

	/**
	 * Cleanup on unmount
	 * Note: Empty dependency array is intentional - we only want this to run on unmount
	 */
	useEffect(() => {
		return () => {
			// Clean up all peer connections
			for (const socketId of peerConnectionsRef.current.keys()) {
				const peer = peerConnectionsRef.current.get(socketId);
				if (peer) {
					peer.connection.close();
					peerConnectionsRef.current.delete(socketId);
				}
			}

			// Stop all media streams - capture current values at cleanup time
			const currentLocalStream = localStream;
			const currentScreenStream = screenStream;

			if (currentLocalStream) {
				for (const track of currentLocalStream.getTracks()) {
					track.stop();
				}
			}

			if (currentScreenStream) {
				for (const track of currentScreenStream.getTracks()) {
					track.stop();
				}
			}

			// Disconnect socket
			if (socket.socket) {
				socket.socket.disconnect();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Build complete state object
	const state: VideoCallState = {
		connectionState: socket.isConnected ? 'connected' : 'disconnected',
		roomState,
		mySocketId: socket.socket?.id || null,
		ticketId,
		participants,
		localStream,
		screenStream,
		mediaState,
		peerConnections: peerConnectionsRef.current,
		chatMessages,
		eventLog,
		error: error || socket.error,
	};

	return {
		state,
		joinRoom,
		leaveRoom,
		startVideo,
		stopVideo,
		shareScreen,
		stopScreenShare,
		sendMessage,
		clearError,
		clearEventLog,
	};
};

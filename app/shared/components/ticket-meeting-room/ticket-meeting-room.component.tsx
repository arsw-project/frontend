import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	cn,
	Divider,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ScrollShadow,
} from '@heroui/react';
import {
	ArrowsOutIcon,
	ChatCircleDotsIcon,
	CheckCircleIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	MonitorPlayIcon,
	PictureInPictureIcon,
	TrashIcon,
	UsersIcon,
	VideoCameraIcon,
	VideoCameraSlashIcon,
	WarningCircleIcon,
	XCircleIcon,
} from '@phosphor-icons/react';
// import { useChatHistory } from '@shared/hooks/chat/get-chat-history.hook'; // Not needed - chat history comes from video call state
import { useVideoCall } from '@shared/hooks/video-call';
import { dataAttr } from '@shared/utility/props';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntlayer } from 'react-intlayer';

type TicketMeetingRoomProps = {
	ticketId?: string;
	className?: string;
	showHeader?: boolean;
};

/**
 * Video Tile Component - Displays a video stream with participant label
 */
const VideoTile = memo<{
	stream: MediaStream | null;
	label: string;
	isMuted?: boolean;
	isScreenShare?: boolean;
	onExpand?: () => void;
	onPictureInPicture?: () => void;
}>(function VideoTile({
	stream,
	label,
	isMuted = false,
	isScreenShare = false,
	onExpand,
	onPictureInPicture,
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	// Update video element when stream changes
	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	// Handle Picture-in-Picture
	const handlePiP = useCallback(async () => {
		if (videoRef.current && document.pictureInPictureEnabled) {
			try {
				if (document.pictureInPictureElement) {
					await document.exitPictureInPicture();
				} else {
					await videoRef.current.requestPictureInPicture();
				}
				onPictureInPicture?.();
			} catch (err) {
				console.error('Error toggling Picture-in-Picture:', err);
			}
		}
	}, [onPictureInPicture]);

	return (
		<div
			className={cn([
				'relative overflow-hidden rounded-large',
				'bg-content2 border border-divider',
				'aspect-video w-full',
				'group',
			])}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{stream ? (
				<>
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted={isMuted}
						className={cn(['w-full h-full object-cover'])}
					/>

					{/* Controls overlay - shown on hover or for screen shares */}
					{(isHovered || isScreenShare) && stream && (
						<div
							className={cn([
								'absolute top-2 right-2',
								'flex gap-2',
								'opacity-0 group-hover:opacity-100',
								'transition-opacity duration-200',
							])}
						>
							{/* Picture-in-Picture button */}
							{document.pictureInPictureEnabled && (
								<Button
									size="sm"
									isIconOnly
									variant="flat"
									color="default"
									className={cn(['bg-overlay/80 backdrop-blur-sm'])}
									onPress={handlePiP}
									aria-label="Picture in Picture"
									title="Picture in Picture"
								>
									<PictureInPictureIcon size={18} weight="duotone" />
								</Button>
							)}

							{/* Expand button - especially useful for screen shares */}
							{onExpand && (
								<Button
									size="sm"
									isIconOnly
									variant="flat"
									color="primary"
									className={cn(['bg-overlay/80 backdrop-blur-sm'])}
									onPress={onExpand}
									aria-label="Expandir"
									title="Expandir video"
								>
									<ArrowsOutIcon size={18} weight="duotone" />
								</Button>
							)}
						</div>
					)}
				</>
			) : (
				<div
					className={cn([
						'w-full h-full flex items-center justify-center',
						'bg-content3',
					])}
				>
					<VideoCameraSlashIcon
						size={48}
						weight="duotone"
						className={cn(['text-foreground-400'])}
					/>
				</div>
			)}

			{/* Label */}
			<div
				className={cn([
					'absolute bottom-2 left-2',
					'px-2 py-1 rounded-medium',
					'bg-overlay/80 backdrop-blur-sm',
					'border border-divider',
					'flex items-center gap-2',
				])}
			>
				{isScreenShare && (
					<MonitorPlayIcon
						size={14}
						weight="duotone"
						className={cn(['text-primary'])}
					/>
				)}
				<span className={cn(['text-tiny text-foreground'])}>{label}</span>
			</div>
		</div>
	);
});

export const TicketMeetingRoom = memo(function TicketMeetingRoom({
	ticketId,
	className,
	showHeader = true,
}: TicketMeetingRoomProps) {
	const content = useIntlayer('ticket_meeting_room');

	// Video call hook
	const videoCall = useVideoCall({ autoConnect: true });
	const {
		state,
		joinRoom,
		leaveRoom,
		startVideo,
		stopVideo,
		shareScreen,
		stopScreenShare,
		sendMessage,
		clearEventLog,
	} = videoCall;

	// Fetch chat history from backend
	// Note: Chat history is now included in state.chatMessages from the video call hook
	// const chatHistory = useChatHistory(ticketId || '', 50, 0);

	// Local state for chat input
	const [chatInput, setChatInput] = useState('');

	// State for expanded video modal
	const [expandedVideo, setExpandedVideo] = useState<{
		stream: MediaStream | null;
		label: string;
		isScreenShare: boolean;
	} | null>(null);

	// State for zoom level in expanded view
	const [zoomLevel, setZoomLevel] = useState(100);

	// State for tracking active screen shares
	const [activeScreenShares, setActiveScreenShares] = useState<Set<string>>(
		new Set(),
	);

	// Check if user is in room
	const isInRoom = state.roomState === 'joined';

	// Use messages from video call state (includes both history and real-time)
	const allMessages = useMemo(() => {
		console.log('[Chat] ===== PROCESSING CHAT MESSAGES =====');
		console.log('[Chat] Raw state.chatMessages:', state.chatMessages);
		console.log('[Chat] Count:', state.chatMessages.length);

		// Log each message individually BEFORE any processing
		state.chatMessages.forEach((msg, index) => {
			console.log(`[Chat] Message ${index}:`, {
				fullMessage: msg,
				hasTimestamp: !!msg.timestamp,
				hasContent: !!(msg as any).content,
				hasMessage: !!(msg as any).message,
				timestamp: msg.timestamp,
				content: (msg as any).content,
				message: (msg as any).message,
			});
		});

		const messages = state.chatMessages
			.filter((msg) => {
				const isValid = msg && msg.timestamp;
				console.log('[Chat] Filter result:', isValid, 'for message:', msg);
				return isValid;
			})
			.map((msg) => {
				// Backend puede enviar 'message' o 'content'
				const content = (msg as any).content || (msg as any).message || '';
				console.log('[Chat] Mapping message:', {
					original: msg,
					extractedContent: content,
					hasContent: !!(msg as any).content,
					hasMessage: !!(msg as any).message,
				});
				return {
					id: msg.id,
					userName: msg.userName,
					content: content,
					timestamp:
						msg.timestamp instanceof Date
							? msg.timestamp
							: new Date(msg.timestamp),
				};
			})
			.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

		console.log('[Chat] ===== FINAL RESULT =====');
		console.log('[Chat] Processed messages count:', messages.length);
		console.log('[Chat] Processed messages:', messages);
		return messages;
	}, [state.chatMessages]);

	/**
	 * Join room automatically when ticketId is provided
	 */
	useEffect(() => {
		console.log('[TicketMeetingRoom] Component state:', {
			ticketId,
			connectionState: state.connectionState,
			roomState: state.roomState,
		});

		if (
			ticketId &&
			state.connectionState === 'connected' &&
			state.roomState === 'idle'
		) {
			console.log('[TicketMeetingRoom] Auto-joining room:', ticketId);
			joinRoom(ticketId);
		} else if (!ticketId) {
			console.warn('[TicketMeetingRoom] No ticketId provided');
		} else if (state.connectionState !== 'connected') {
			console.warn(
				'[TicketMeetingRoom] Waiting for connection:',
				state.connectionState,
			);
		} else if (state.roomState !== 'idle') {
			console.log(
				'[TicketMeetingRoom] Already in room or joining:',
				state.roomState,
			);
		}
	}, [ticketId, state.connectionState, state.roomState, joinRoom]);

	/**
	 * Leave room on unmount
	 * Note: Empty dependency array is intentional - we only want this cleanup on unmount
	 */
	useEffect(() => {
		return () => {
			if (state.roomState === 'joined') {
				leaveRoom();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Auto-scroll to bottom when new messages arrive
	const chatScrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chatScrollRef.current) {
			chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
		}
	}, [allMessages]);

	// Debug: Log when messages change
	useEffect(() => {
		console.log('[Chat Render] Messages updated:', {
			count: allMessages.length,
			messages: allMessages,
			stateMessages: state.chatMessages,
		});
	}, [allMessages, state.chatMessages]);

	// Debug: Log when messages change
	useEffect(() => {
		console.log('[Chat Render] Messages updated:', {
			count: allMessages.length,
			messages: allMessages,
			stateMessages: state.chatMessages,
		});
	}, [allMessages, state.chatMessages]);

	/**
	 * Handle chat message send
	 */
	const handleSendChat = useCallback(() => {
		if (!chatInput.trim()) {
			console.warn('[Chat] Cannot send empty message');
			return;
		}

		if (state.roomState !== 'joined') {
			console.warn('[Chat] Cannot send message. Room state:', state.roomState);
			console.warn('[Chat] Connection state:', state.connectionState);
			console.warn('[Chat] TicketId:', ticketId);
			return;
		}

		console.log('[Chat] Sending message:', chatInput);
		sendMessage(chatInput);
		setChatInput('');
	}, [
		chatInput,
		sendMessage,
		state.roomState,
		state.connectionState,
		ticketId,
	]);

	/**
	 * Handle chat input key press (Enter to send)
	 */
	const handleChatKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				handleSendChat();
			}
		},
		[handleSendChat],
	);

	/**
	 * Connection status indicator
	 */
	const connectionStatus = useMemo(() => {
		const statusMap = {
			disconnected: {
				color: 'danger' as const,
				label: content.disconnected,
				icon: XCircleIcon,
			},
			connecting: {
				color: 'warning' as const,
				label: content.connecting,
				icon: WarningCircleIcon,
			},
			connected: {
				color: 'success' as const,
				label: content.connected,
				icon: CheckCircleIcon,
			},
		};

		const status = statusMap[state.connectionState];
		const Icon = status.icon;

		return (
			<Chip
				color={status.color}
				variant="flat"
				size="sm"
				startContent={<Icon size={14} weight="bold" />}
			>
				{status.label}
			</Chip>
		);
	}, [state.connectionState, content]);

	/**
	 * Participants panel component
	 */
	const participantsPanel = useMemo(() => {
		return (
			<Card
				className={cn([
					'bg-content2 border border-divider shadow-small',
					'w-full',
				])}
			>
				<CardHeader
					className={cn([
						'flex items-center gap-2',
						'px-4 sm:px-5 md:px-6',
						'py-3 sm:py-4',
					])}
				>
					<UsersIcon
						size={18}
						weight="duotone"
						className={cn(['text-primary'])}
					/>
					<h3
						className={cn([
							'font-semibold text-foreground text-small sm:text-medium',
						])}
					>
						{content.participantsTitle}
					</h3>
					<Chip size="sm" variant="flat">
						{state.participants.length}
					</Chip>
				</CardHeader>
				<CardBody
					className={cn([
						'px-4 sm:px-5 md:px-6',
						'pb-4 sm:pb-5',
						'flex flex-col gap-3',
					])}
				>
					{state.participants.length > 0 ? (
						<div className={cn(['flex flex-wrap gap-2'])}>
							{state.participants.map((p) => (
								<Chip key={p.socketId} color="primary" variant="flat" size="sm">
									{p.user.name}
								</Chip>
							))}
						</div>
					) : (
						<p className={cn(['text-foreground-500 text-tiny'])}>
							{content.participantsEmpty}
						</p>
					)}
				</CardBody>
			</Card>
		);
	}, [content, state.participants]);

	/**
	 * Media controls panel component
	 */
	const mediaPanel = useMemo(() => {
		const hasLocalStream = state.localStream !== null;

		return (
			<Card
				className={cn([
					'bg-content2 border border-divider shadow-small',
					'w-full',
				])}
			>
				<CardHeader
					className={cn([
						'flex items-center gap-2',
						'px-4 sm:px-5 md:px-6',
						'py-3 sm:py-4',
					])}
				>
					<VideoCameraIcon
						size={18}
						weight="duotone"
						className={cn(['text-primary'])}
					/>
					<h3
						className={cn([
							'font-semibold text-foreground text-small sm:text-medium',
						])}
					>
						{content.mediaTitle}
					</h3>
				</CardHeader>
				<CardBody
					className={cn([
						'px-4 sm:px-5 md:px-6',
						'pb-4 sm:pb-5',
						'grid grid-cols-1 sm:grid-cols-2 gap-2',
					])}
				>
					<Button
						color="primary"
						variant="bordered"
						startContent={<VideoCameraIcon size={16} weight="bold" />}
						onPress={startVideo}
						isDisabled={!isInRoom || hasLocalStream}
						className={cn(['w-full'])}
					>
						{content.startVideo}
					</Button>
					<Button
						color="default"
						variant="bordered"
						startContent={<VideoCameraSlashIcon size={16} weight="bold" />}
						onPress={stopVideo}
						isDisabled={!isInRoom || !hasLocalStream}
						className={cn(['w-full'])}
					>
						{content.stopVideo}
					</Button>
					<Button
						color="secondary"
						variant="bordered"
						startContent={<MonitorPlayIcon size={16} weight="bold" />}
						onPress={shareScreen}
						isDisabled={
							!isInRoom || !hasLocalStream || state.mediaState.isSharingScreen
						}
						className={cn(['w-full'])}
					>
						{content.shareScreen}
					</Button>
					<Button
						color="danger"
						variant="bordered"
						startContent={<XCircleIcon size={16} weight="bold" />}
						onPress={stopScreenShare}
						isDisabled={!isInRoom || !state.mediaState.isSharingScreen}
						className={cn(['w-full'])}
					>
						{content.stopShare}
					</Button>
				</CardBody>
			</Card>
		);
	}, [
		content,
		state,
		isInRoom,
		startVideo,
		stopVideo,
		shareScreen,
		stopScreenShare,
	]);

	/**
	 * Chat panel component
	 */
	const chatPanel = useMemo(() => {
		return (
			<Card
				className={cn([
					'bg-content2 border border-divider shadow-small',
					'w-full',
				])}
			>
				<CardHeader
					className={cn([
						'flex items-center justify-between',
						'px-4 sm:px-5 md:px-6',
						'py-3 sm:py-4',
					])}
				>
					<div className={cn(['flex items-center gap-2'])}>
						<ChatCircleDotsIcon
							size={18}
							weight="duotone"
							className={cn(['text-primary'])}
						/>
						<h3
							className={cn([
								'font-semibold text-foreground text-small sm:text-medium',
							])}
						>
							{content.chatTitle}
						</h3>
					</div>
					<div className={cn(['flex items-center gap-2'])}>
						{isInRoom ? (
							<Chip size="sm" color="success" variant="flat">
								Conectado
							</Chip>
						) : (
							<Chip size="sm" color="warning" variant="flat">
								{state.roomState === 'joining'
									? 'Conectando...'
									: 'Desconectado'}
							</Chip>
						)}
					</div>
				</CardHeader>
				<CardBody
					className={cn([
						'px-4 sm:px-5 md:px-6',
						'pb-4 sm:pb-5',
						'flex flex-col gap-3',
					])}
				>
					<ScrollShadow
						ref={chatScrollRef}
						size={40}
						className={cn([
							'rounded-medium border border-divider',
							'bg-content3',
							'h-36 sm:h-40 md:h-44',
							'p-3',
						])}
					>
						<div className={cn(['space-y-2'])}>
							{allMessages.length > 0 ? (
								allMessages.map((msg) => (
									<div key={msg.id} className={cn(['flex flex-col gap-1'])}>
										<div className={cn(['flex items-center gap-2'])}>
											<span
												className={cn(['text-tiny font-semibold text-primary'])}
											>
												{msg.userName}
											</span>
											<span className={cn(['text-tiny text-foreground-400'])}>
												{new Date(msg.timestamp).toLocaleTimeString(undefined, {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</span>
										</div>
										<span className={cn(['text-small text-foreground pl-2'])}>
											{msg.content}
										</span>
									</div>
								))
							) : (
								<p
									className={cn(['text-foreground-500 text-tiny text-center'])}
								>
									{typeof content.chatPlaceholder === 'string'
										? content.chatPlaceholder
										: content.chatPlaceholder.value || 'No hay mensajes'}
								</p>
							)}
						</div>
					</ScrollShadow>

					<div className={cn(['flex flex-col gap-2'])}>
						{!isInRoom && (
							<div className={cn(['text-tiny text-warning text-center'])}>
								{state.roomState === 'joining'
									? '⏳ Conectando a la sala...'
									: '⚠️ Debes unirte a la sala para usar el chat'}
							</div>
						)}
						<div className={cn(['flex flex-col sm:flex-row gap-2'])}>
							<Input
								type="text"
								placeholder={
									isInRoom
										? typeof content.chatPlaceholder === 'string'
											? content.chatPlaceholder
											: content.chatPlaceholder.value || 'Escribe un mensaje...'
										: 'Esperando conexión...'
								}
								value={chatInput}
								onValueChange={setChatInput}
								onKeyDown={handleChatKeyPress}
								isDisabled={!isInRoom}
								className={cn(['flex-1'])}
								size="sm"
								variant="bordered"
							/>
							<Button
								color="primary"
								startContent={<ChatCircleDotsIcon size={16} weight="bold" />}
								onPress={handleSendChat}
								isDisabled={!isInRoom || !chatInput.trim()}
								className={cn(['w-full sm:w-auto'])}
								size="sm"
							>
								{content.send}
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	}, [
		content,
		allMessages,
		chatInput,
		isInRoom,
		state.roomState,
		handleSendChat,
		handleChatKeyPress,
	]);

	// Get remote video streams from peer connections
	const remoteStreams = useMemo(() => {
		return Array.from(state.peerConnections.entries()).map(
			([socketId, peer]) => ({
				socketId,
				stream: peer.stream,
				userName: peer.userName,
			}),
		);
	}, [state.peerConnections]);

	/**
	 * Track active screen shares and show notification
	 */
	useEffect(() => {
		const screenShareStreams = new Set<string>();

		// Check all remote streams for screen shares
		remoteStreams.forEach((remote) => {
			const isScreenShare = remote.stream
				?.getTracks()
				.some(
					(track) => track.kind === 'video' && track.label.includes('screen'),
				);

			if (isScreenShare && remote.socketId) {
				screenShareStreams.add(remote.socketId);
			}
		});

		// Update state if there are changes
		if (
			screenShareStreams.size !== activeScreenShares.size ||
			[...screenShareStreams].some((id) => !activeScreenShares.has(id))
		) {
			setActiveScreenShares(screenShareStreams);
		}
	}, [remoteStreams, activeScreenShares]);

	return (
		<div
			className={cn(['flex flex-col gap-4 sm:gap-5 md:gap-6', className])}
			data-loading={dataAttr(state.connectionState === 'connecting')}
		>
			<Card className={cn(['bg-content1 border border-divider shadow-small'])}>
				{showHeader && (
					<CardHeader
						className={cn([
							'flex flex-col sm:flex-row sm:items-center sm:justify-between',
							'gap-2 sm:gap-3',
							'px-4 sm:px-5 md:px-6',
							'py-4',
						])}
					>
						<div className={cn(['space-y-1'])}>
							<h3
								className={cn([
									'text-foreground font-semibold text-medium sm:text-large',
								])}
							>
								{content.title}
							</h3>
							<p
								className={cn(['text-foreground-500 text-tiny sm:text-small'])}
							>
								{content.subtitle}
							</p>
						</div>
						{connectionStatus}
					</CardHeader>
				)}

				<CardBody
					className={cn([
						'px-4 sm:px-5 md:px-6',
						'pb-5 sm:pb-6',
						'flex flex-col gap-4 sm:gap-5',
					])}
				>
					{/* Debug Panel - Temporal para diagnosticar */}
					<Card className={cn(['bg-content2 border border-divider'])}>
						<CardBody className={cn(['p-3'])}>
							<div className={cn(['flex flex-col gap-2 text-tiny'])}>
								<div className={cn(['flex items-center justify-between'])}>
									<span className={cn(['text-foreground-500'])}>
										Ticket ID:
									</span>
									<span className={cn(['font-mono text-foreground'])}>
										{ticketId || 'N/A'}
									</span>
								</div>
								<div className={cn(['flex items-center justify-between'])}>
									<span className={cn(['text-foreground-500'])}>Conexión:</span>
									<Chip
										size="sm"
										color={
											state.connectionState === 'connected'
												? 'success'
												: 'warning'
										}
										variant="flat"
									>
										{state.connectionState}
									</Chip>
								</div>
								<div className={cn(['flex items-center justify-between'])}>
									<span className={cn(['text-foreground-500'])}>Sala:</span>
									<Chip
										size="sm"
										color={state.roomState === 'joined' ? 'success' : 'warning'}
										variant="flat"
									>
										{state.roomState}
									</Chip>
								</div>
								<div className={cn(['flex items-center justify-between'])}>
									<span className={cn(['text-foreground-500'])}>
										Chat habilitado:
									</span>
									<Chip
										size="sm"
										color={isInRoom ? 'success' : 'danger'}
										variant="flat"
									>
										{isInRoom ? 'Sí' : 'No'}
									</Chip>
								</div>
								<div className={cn(['flex items-center justify-between'])}>
									<span className={cn(['text-foreground-500'])}>Mensajes:</span>
									<span className={cn(['font-mono text-foreground'])}>
										{allMessages.length}
									</span>
								</div>
								<div className={cn(['flex items-center justify-between'])}>
									<span className={cn(['text-foreground-500'])}>
										Participantes:
									</span>
									<span className={cn(['font-mono text-foreground'])}>
										{state.participants.length}
									</span>
								</div>
							</div>
						</CardBody>
					</Card>

					{/* Error display */}
					{state.error && (
						<Card className={cn(['bg-danger-50 border border-danger'])}>
							<CardBody className={cn(['p-3 flex items-start gap-2'])}>
								<WarningCircleIcon
									size={20}
									weight="fill"
									className={cn(['text-danger shrink-0 mt-0.5'])}
								/>
								<div className={cn(['flex-1'])}>
									<p className={cn(['text-danger font-semibold text-small'])}>
										{content.errorOccurred}
									</p>
									<p className={cn(['text-danger-600 text-tiny mt-1'])}>
										{state.error}
									</p>
								</div>
							</CardBody>
						</Card>
					)}

					{/* Control panels */}
					<div className={cn(['grid grid-cols-1 lg:grid-cols-2 gap-4'])}>
						<div className={cn(['flex flex-col gap-4'])}>
							{participantsPanel}
						</div>
						<div className={cn(['flex flex-col gap-4'])}>
							{mediaPanel}
							{chatPanel}
						</div>
					</div>

					<Divider className={cn(['bg-divider'])} />

					{/* Video streams */}
					<div className={cn(['flex items-center justify-between'])}>
						<h4
							className={cn([
								'font-semibold text-foreground text-small sm:text-medium',
							])}
						>
							{content.videosTitle}
						</h4>
					</div>

					{/* Screen share notification banner */}
					{activeScreenShares.size > 0 && (
						<div
							className={cn([
								'bg-primary/10 border-2 border-primary rounded-lg p-4 flex items-center gap-3 animate-pulse',
							])}
						>
							<MonitorPlayIcon
								size={24}
								className="text-primary"
								weight="fill"
							/>
							<div>
								<p className="text-primary font-semibold">
									{content.screenShareActive}
								</p>
								<p className="text-small text-foreground-500">
									{content.screenShareClickToExpand}
								</p>
							</div>
						</div>
					)}

					<div
						className={cn([
							'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4',
						])}
					>
						{/* Local video */}
						<VideoTile
							stream={state.localStream}
							label={content.localVideoLabel.value}
							isMuted={true}
							onExpand={() =>
								setExpandedVideo({
									stream: state.localStream,
									label: content.localVideoLabel.value,
									isScreenShare: false,
								})
							}
						/>

						{/* Remote videos */}
						{remoteStreams.map((remote) => {
							// Detect if this is a screen share stream
							const isScreenShare =
								remote.stream
									?.getTracks()
									.some(
										(track) =>
											track.kind === 'video' && track.label.includes('screen'),
									) || false;

							return (
								<VideoTile
									key={remote.socketId}
									stream={remote.stream}
									label={remote.userName || content.remoteVideoLabel.value}
									isMuted={false}
									isScreenShare={isScreenShare}
									onExpand={() =>
										setExpandedVideo({
											stream: remote.stream,
											label: remote.userName || content.remoteVideoLabel.value,
											isScreenShare,
										})
									}
								/>
							);
						})}
					</div>

					<Divider className={cn(['bg-divider'])} />

					{/* Event log */}
					<div className={cn(['flex flex-col gap-2'])}>
						<div className={cn(['flex items-center justify-between'])}>
							<h4
								className={cn([
									'font-semibold text-foreground text-small sm:text-medium',
								])}
							>
								{content.eventLogTitle}
							</h4>
							{state.eventLog.length > 0 && (
								<Button
									size="sm"
									variant="light"
									color="default"
									startContent={<TrashIcon size={14} />}
									onPress={clearEventLog}
								>
									{content.clearLog}
								</Button>
							)}
						</div>
						<ScrollShadow
							size={40}
							className={cn([
								'rounded-medium border border-divider',
								'bg-content2',
								'h-28 sm:h-32 md:h-36',
								'p-3',
							])}
						>
							<div className={cn(['space-y-1'])}>
								{state.eventLog.length > 0 ? (
									state.eventLog.map((entry) => {
										const colorMap = {
											info: 'text-foreground',
											success: 'text-success',
											error: 'text-danger',
											warning: 'text-warning',
											connection: 'text-primary',
										};

										return (
											<div
												key={entry.id}
												className={cn([
													'text-tiny font-mono',
													colorMap[entry.type],
												])}
											>
												[{entry.timestamp.toLocaleTimeString()}] {entry.message}
											</div>
										);
									})
								) : (
									<p className={cn(['text-foreground-500 text-tiny'])}>
										{content.eventLogEmpty}
									</p>
								)}
							</div>
						</ScrollShadow>
					</div>
				</CardBody>
			</Card>

			{/* Expanded Video Modal */}
			<Modal
				isOpen={!!expandedVideo}
				onClose={() => {
					setExpandedVideo(null);
					setZoomLevel(100);
				}}
				size="full"
				classNames={{
					base: 'bg-black/95',
					wrapper: 'items-center justify-center',
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className={cn(['flex flex-col gap-1 text-white'])}>
								<div className={cn(['flex items-center gap-2'])}>
									{expandedVideo?.isScreenShare && (
										<MonitorPlayIcon
											size={20}
											weight="duotone"
											className={cn(['text-primary'])}
										/>
									)}
									<span>{expandedVideo?.label}</span>
								</div>
							</ModalHeader>
							<ModalBody
								className={cn([
									'flex items-center justify-center overflow-hidden p-0',
								])}
							>
								<ExpandedVideoView
									stream={expandedVideo?.stream || null}
									zoom={zoomLevel}
									noStreamText={content.noStreamAvailable}
								/>
							</ModalBody>
							<ModalFooter className={cn(['justify-between'])}>
								<div className={cn(['flex items-center gap-2'])}>
									{/* Zoom controls */}
									<Button
										size="sm"
										variant="flat"
										color="default"
										isIconOnly
										onPress={() =>
											setZoomLevel((prev) => Math.max(50, prev - 10))
										}
										isDisabled={zoomLevel <= 50}
										title={content.zoomOut}
									>
										<MagnifyingGlassMinusIcon size={18} weight="duotone" />
									</Button>
									<Chip variant="flat" color="default" size="sm">
										{zoomLevel}%
									</Chip>
									<Button
										size="sm"
										variant="flat"
										color="default"
										isIconOnly
										onPress={() =>
											setZoomLevel((prev) => Math.min(200, prev + 10))
										}
										isDisabled={zoomLevel >= 200}
										title={content.zoomIn}
									>
										<MagnifyingGlassPlusIcon size={18} weight="duotone" />
									</Button>
									<Button
										size="sm"
										variant="flat"
										color="default"
										onPress={() => setZoomLevel(100)}
									>
										{content.resetZoom}
									</Button>
								</div>
								<Button color="primary" variant="light" onPress={onClose}>
									{content.close}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
});

/**
 * Expanded Video View Component - Displays video in fullscreen modal with zoom
 */
const ExpandedVideoView = memo<{
	stream: MediaStream | null;
	zoom: number;
	noStreamText: string;
}>(function ExpandedVideoView({ stream, zoom, noStreamText }) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<div
			className={cn([
				'w-full h-full flex items-center justify-center',
				'overflow-auto',
			])}
		>
			{stream ? (
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted={false}
					className={cn([
						'max-w-full max-h-full object-contain transition-transform duration-200',
					])}
					style={{ transform: `scale(${zoom / 100})` }}
				/>
			) : (
				<div className={cn(['text-white flex flex-col items-center gap-4'])}>
					<VideoCameraSlashIcon size={64} weight="duotone" />
					<p>{noStreamText}</p>
				</div>
			)}
		</div>
	);
});

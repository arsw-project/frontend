import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	cn,
	Divider,
	Input,
	ScrollShadow,
} from '@heroui/react';
import {
	ChatCircleDotsIcon,
	CheckCircleIcon,
	MonitorPlayIcon,
	TrashIcon,
	UsersIcon,
	VideoCameraIcon,
	VideoCameraSlashIcon,
	WarningCircleIcon,
	XCircleIcon,
} from '@phosphor-icons/react';
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
}>(function VideoTile({ stream, label, isMuted = false }) {
	const videoRef = useRef<HTMLVideoElement>(null);

	// Update video element when stream changes
	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<div
			className={cn([
				'relative overflow-hidden rounded-large',
				'bg-content2 border border-divider',
				'aspect-video w-full',
			])}
		>
			{stream ? (
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted={isMuted}
					className={cn(['w-full h-full object-cover'])}
				/>
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
			<div
				className={cn([
					'absolute bottom-2 left-2',
					'px-2 py-1 rounded-medium',
					'bg-overlay/80 backdrop-blur-sm',
					'border border-divider',
				])}
			>
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

	// Local state for chat input
	const [chatInput, setChatInput] = useState('');

	/**
	 * Join room automatically when ticketId is provided
	 */
	useEffect(() => {
		if (
			ticketId &&
			state.connectionState === 'connected' &&
			state.roomState === 'idle'
		) {
			joinRoom(ticketId);
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

	/**
	 * Handle chat message send
	 */
	const handleSendChat = useCallback(() => {
		if (chatInput.trim()) {
			sendMessage(chatInput);
			setChatInput('');
		}
	}, [chatInput, sendMessage]);

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
		const isInRoom = state.roomState === 'joined';
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
	}, [content, state, startVideo, stopVideo, shareScreen, stopScreenShare]);

	/**
	 * Chat panel component
	 */
	const chatPanel = useMemo(() => {
		const isInRoom = state.roomState === 'joined';

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
				</CardHeader>
				<CardBody
					className={cn([
						'px-4 sm:px-5 md:px-6',
						'pb-4 sm:pb-5',
						'flex flex-col gap-3',
					])}
				>
					<ScrollShadow
						size={40}
						className={cn([
							'rounded-medium border border-divider',
							'bg-content3',
							'h-36 sm:h-40 md:h-44',
							'p-3',
						])}
					>
						<div className={cn(['space-y-2'])}>
							{state.chatMessages.length > 0 ? (
								state.chatMessages.map((msg) => (
									<div key={msg.id} className={cn(['flex flex-col gap-1'])}>
										<span
											className={cn(['text-tiny font-semibold text-primary'])}
										>
											{msg.userName}:
										</span>
										<span className={cn(['text-small text-foreground'])}>
											{msg.content}
										</span>
									</div>
								))
							) : (
								<p className={cn(['text-foreground-500 text-tiny'])}>
									{content.chatPlaceholder}
								</p>
							)}
						</div>
					</ScrollShadow>

					<div className={cn(['flex flex-col sm:flex-row gap-2'])}>
						<Input
							type="text"
							placeholder={content.chatPlaceholder.value}
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
				</CardBody>
			</Card>
		);
	}, [content, state, chatInput, handleSendChat, handleChatKeyPress]);

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
						/>

						{/* Remote videos */}
						{remoteStreams.map((remote) => (
							<VideoTile
								key={remote.socketId}
								stream={remote.stream}
								label={remote.userName || content.remoteVideoLabel.value}
								isMuted={false}
							/>
						))}
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
		</div>
	);
});

import { type Dictionary, t } from 'intlayer';

const ticketMeetingRoomContent = {
	key: 'ticket_meeting_room',
	content: {
		title: t({
			en: 'Meeting room',
			es: 'Sala de reunión',
		}),
		subtitle: t({
			en: 'Real-time video call and chat for this ticket.',
			es: 'Videollamada y chat en tiempo real para este ticket.',
		}),
		connecting: t({
			en: 'Connecting…',
			es: 'Conectando…',
		}),
		connected: t({
			en: 'Connected',
			es: 'Conectado',
		}),
		disconnected: t({
			en: 'Disconnected',
			es: 'Desconectado',
		}),
		close: t({
			en: 'Close',
			es: 'Cerrar',
		}),
		connectionTitle: t({
			en: 'Connection',
			es: 'Conexión',
		}),
		serverUrlLabel: t({
			en: 'Server URL',
			es: 'URL del servidor',
		}),
		serverUrlPlaceholder: t({
			en: 'http://localhost:3002/video-call',
			es: 'http://localhost:3002/video-call',
		}),
		ticketIdLabel: t({
			en: 'Ticket ID',
			es: 'ID del ticket',
		}),
		sessionTokenLabel: t({
			en: 'Session token',
			es: 'Token de sesión',
		}),
		sessionTokenPlaceholder: t({
			en: 'From cookie / auth session',
			es: 'Desde la cookie / sesión de auth',
		}),
		connect: t({
			en: 'Connect',
			es: 'Conectar',
		}),
		joinRoom: t({
			en: 'Join room',
			es: 'Unirse a la sala',
		}),
		leaveRoom: t({
			en: 'Leave room',
			es: 'Salir de la sala',
		}),
		participantsTitle: t({
			en: 'Participants',
			es: 'Participantes',
		}),
		participantsEmpty: t({
			en: 'No participants yet',
			es: 'Aún no hay participantes',
		}),
		mediaTitle: t({
			en: 'Media controls',
			es: 'Controles de medios',
		}),
		startVideo: t({
			en: 'Start video',
			es: 'Iniciar video',
		}),
		stopVideo: t({
			en: 'Stop video',
			es: 'Detener video',
		}),
		shareScreen: t({
			en: 'Share screen',
			es: 'Compartir pantalla',
		}),
		stopShare: t({
			en: 'Stop share',
			es: 'Detener compartir',
		}),
		chatTitle: t({
			en: 'Chat',
			es: 'Chat',
		}),
		chatPlaceholder: t({
			en: 'Type a message…',
			es: 'Escribe un mensaje…',
		}),
		send: t({
			en: 'Send',
			es: 'Enviar',
		}),
		videosTitle: t({
			en: 'Videos',
			es: 'Videos',
		}),
		localVideoLabel: t({
			en: 'You (Local)',
			es: 'Tú (Local)',
		}),
		remoteVideoLabel: t({
			en: 'Remote participant',
			es: 'Participante remoto',
		}),
		eventLogTitle: t({
			en: 'Event log',
			es: 'Registro de eventos',
		}),
		eventLogEmpty: t({
			en: 'Events will appear here.',
			es: 'Los eventos aparecerán aquí.',
		}),
		errorOccurred: t({
			en: 'An error occurred',
			es: 'Ocurrió un error',
		}),
		clearLog: t({
			en: 'Clear log',
			es: 'Limpiar registro',
		}),
		participant: t({
			en: 'participant',
			es: 'participante',
		}),
		participants_plural: t({
			en: 'participants',
			es: 'participantes',
		}),
		expandVideo: t({
			en: 'Expand video',
			es: 'Ampliar video',
		}),
		pictureInPicture: t({
			en: 'Picture in Picture',
			es: 'Picture in Picture',
		}),
		zoomIn: t({
			en: 'Zoom in',
			es: 'Acercar',
		}),
		zoomOut: t({
			en: 'Zoom out',
			es: 'Alejar',
		}),
		resetZoom: t({
			en: 'Reset zoom',
			es: 'Restablecer zoom',
		}),
		screenShare: t({
			en: 'Screen share',
			es: 'Pantalla compartida',
		}),
		noStreamAvailable: t({
			en: 'No stream available',
			es: 'No hay stream disponible',
		}),
		screenShareActive: t({
			en: '🎥 Screen sharing is active',
			es: '🎥 Se está compartiendo pantalla',
		}),
		screenShareClickToExpand: t({
			en: 'Click the expand button to view in fullscreen',
			es: 'Haz clic en el botón de ampliar para ver en pantalla completa',
		}),
	},
} satisfies Dictionary;

export default ticketMeetingRoomContent;

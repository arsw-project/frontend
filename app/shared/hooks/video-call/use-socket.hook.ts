import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { UseSocketReturn } from './video-call.types';

/**
 * Custom hook for managing Socket.IO connection
 * Handles connection lifecycle, error handling, and cleanup
 */
export const useSocket = (serverUrl?: string): UseSocketReturn => {
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const socketRef = useRef<Socket | null>(null);

	// Connect directly to video-call microservice on port 3002 with namespace
	const baseUrl = serverUrl || 'http://localhost:3002';

	// Video-call microservice uses /video-call namespace
	const fullUrl = `${baseUrl.replace(/\/$/, '')}/video-call`;

	/**
	 * Connect to Socket.IO server
	 */
	const connect = useCallback(() => {
		if (socketRef.current?.connected) {
			return;
		}

		try {
			// Create socket connection with video-call namespace
			console.log('[Socket] Connecting to:', fullUrl);
			const socket = io(fullUrl, {
				transports: ['websocket'],
				withCredentials: true, // Important for session cookie
			});

			// Connection event handlers
			socket.on('connect', () => {
				console.log('[Socket] Connected successfully, socket ID:', socket.id);
				setIsConnected(true);
				setError(null);
			});

			socket.on('disconnect', (reason) => {
				console.log('[Socket] Disconnected, reason:', reason);
				setIsConnected(false);
				if (reason === 'io server disconnect') {
					setError('Server disconnected the connection');
				}
			});

			socket.on('connect_error', (err) => {
				console.error('[Socket] Connection error:', err);
				setIsConnected(false);
				setError(err.message || 'Connection error');
			});

			socketRef.current = socket;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to connect to server',
			);
		}
	}, [fullUrl]);

	/**
	 * Disconnect from Socket.IO server
	 */
	const disconnect = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.disconnect();
			socketRef.current = null;
			setIsConnected(false);
		}
	}, []);

	/**
	 * Emit event to server
	 */
	const emit = useCallback((event: string, ...args: unknown[]) => {
		if (socketRef.current?.connected) {
			socketRef.current.emit(event, ...args);
		}
	}, []);

	/**
	 * Register event handler
	 */
	const on = useCallback(
		<T extends (...args: never[]) => void>(event: string, handler: T) => {
			socketRef.current?.on(
				event,
				handler as unknown as (...args: unknown[]) => void,
			);
		},
		[],
	);

	/**
	 * Unregister event handler
	 */
	const off = useCallback(
		<T extends (...args: never[]) => void>(event: string, handler: T) => {
			socketRef.current?.off(
				event,
				handler as unknown as (...args: unknown[]) => void,
			);
		},
		[],
	);

	/**
	 * Cleanup on unmount
	 */
	useEffect(() => {
		return () => {
			disconnect();
		};
	}, [disconnect]);

	return {
		socket: socketRef.current,
		isConnected,
		error,
		connect,
		disconnect,
		emit,
		on,
		off,
	};
};

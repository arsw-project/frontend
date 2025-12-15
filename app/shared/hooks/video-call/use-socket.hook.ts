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

	// Get the base URL from environment or use default
	const baseUrl =
		serverUrl || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

	// Build the full video-call namespace URL
	// In nginx, /video-call is removed from the URL, but we need to include it in the frontend
	// Example: http://localhost:3000/video-call connects to the video-call microservice
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
			const socket = io(fullUrl, {
				transports: ['websocket'],
				withCredentials: true, // Important for session cookie
			});

			// Connection event handlers
			socket.on('connect', () => {
				setIsConnected(true);
				setError(null);
			});

			socket.on('disconnect', (reason) => {
				setIsConnected(false);
				if (reason === 'io server disconnect') {
					setError('Server disconnected the connection');
				}
			});

			socket.on('connect_error', (err) => {
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

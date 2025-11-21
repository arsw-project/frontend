import { type UserRole, useSession } from '@providers/session.provider';
import { memo, type ReactNode } from 'react';

// Re-exportar UserRole para conveniencia
export type { UserRole };

type PermissionRequirement =
	| {
			type: 'any';
			roles: UserRole[];
	  }
	| {
			type: 'all';
			roles: UserRole[];
	  };

interface PermissionWrapperProps {
	/**
	 * Requisito de permisos.
	 * 'any' - El usuario debe tener al menos uno de los roles especificados
	 * 'all' - El usuario debe tener todos los roles especificados
	 */
	require: PermissionRequirement;

	/**
	 * Contenido a renderizar si el usuario tiene los permisos requeridos
	 */
	children: ReactNode;

	/**
	 * Contenido alternativo a renderizar si el usuario NO tiene los permisos requeridos
	 * Si no se proporciona y el usuario no tiene permisos, no se renderiza nada
	 */
	fallback?: ReactNode;
}

/**
 * PermissionWrapper
 *
 * Componente que envuelve contenido y controla su visibilidad basado en el rol del usuario.
 * Valida el rol de la sesión actual y solo renderiza el contenido si se cumplen los permisos requeridos.
 *
 * @example
 * // Mostrar contenido solo para administradores
 * <PermissionWrapper
 *   require={{ type: 'any', roles: ['admin'] }}
 * >
 *   <AdminPanel />
 * </PermissionWrapper>
 *
 * @example
 * // Mostrar contenido si el usuario tiene admin O system
 * <PermissionWrapper
 *   require={{ type: 'any', roles: ['admin', 'system'] }}
 *   fallback={<div>No tienes permiso para ver esta sección</div>}
 * >
 *   <SpecialContent />
 * </PermissionWrapper>
 *
 * @example
 * // Mostrar contenido solo si tiene TODOS los roles especificados
 * <PermissionWrapper
 *   require={{ type: 'all', roles: ['admin', 'system'] }}
 * >
 *   <SuperAdminPanel />
 * </PermissionWrapper>
 */
export const PermissionWrapper = memo(function PermissionWrapper({
	require,
	children,
	fallback,
}: PermissionWrapperProps) {
	const { session } = useSession();

	// Si aún se está cargando la sesión, no renderizar nada
	if (session.isLoading) {
		return null;
	}

	// Si hay error en la sesión, renderizar el fallback
	if (session.isError || !session.data?.user) {
		return fallback ?? null;
	}

	const userRole = session.data.user.role;

	// Verificar si el usuario cumple los requisitos de permiso
	const hasPermission =
		require.type === 'any'
			? require.roles.includes(userRole)
			: require.roles.every((role) => userRole === role);

	// Si el usuario no tiene permisos, renderizar el fallback
	if (!hasPermission) {
		return fallback ?? null;
	}

	return children;
});

import { type Dictionary, t } from 'intlayer';

const usersContent = {
	key: 'users',
	content: {
		// Page header
		title: t({
			en: 'Users',
			es: 'Usuarios',
		}),
		description: t({
			en: 'Manage and view all users in the system',
			es: 'Gestiona y visualiza todos los usuarios del sistema',
		}),

		// Summary cards
		summaryTotalUsers: t({
			en: 'Total Users',
			es: 'Total de Usuarios',
		}),
		summaryAdmins: t({
			en: 'Administrators',
			es: 'Administradores',
		}),
		summaryGoogleUsers: t({
			en: 'Google Users',
			es: 'Usuarios de Google',
		}),
		summaryLocalUsers: t({
			en: 'Local Users',
			es: 'Usuarios Locales',
		}),
		summaryNewThisMonth: t({
			en: 'New This Month',
			es: 'Nuevos Este Mes',
		}),

		// Table columns
		id: t({
			en: 'ID',
			es: 'ID',
		}),
		name: t({
			en: 'Name',
			es: 'Nombre',
		}),
		email: t({
			en: 'Email',
			es: 'Correo Electrónico',
		}),
		role: t({
			en: 'Role',
			es: 'Rol',
		}),
		provider: t({
			en: 'Provider',
			es: 'Proveedor',
		}),
		createdAt: t({
			en: 'Created',
			es: 'Creado',
		}),
		updatedAt: t({
			en: 'Updated',
			es: 'Actualizado',
		}),
		actions: t({
			en: 'Actions',
			es: 'Acciones',
		}),

		// States
		loading: t({
			en: 'Loading users...',
			es: 'Cargando usuarios...',
		}),
		error: t({
			en: 'Failed to load users',
			es: 'Error al cargar los usuarios',
		}),
		noUsers: t({
			en: 'No users found',
			es: 'No se encontraron usuarios',
		}),
		retry: t({
			en: 'Retry',
			es: 'Reintentar',
		}),

		// Search
		searchPlaceholder: t({
			en: 'Search by name or email...',
			es: 'Buscar por nombre o correo...',
		}),
		totalUsers: t({
			en: 'Total users',
			es: 'Total de usuarios',
		}),

		// Roles
		roleUser: t({
			en: 'User',
			es: 'Usuario',
		}),
		roleAdmin: t({
			en: 'Admin',
			es: 'Administrador',
		}),
		roleSystem: t({
			en: 'System',
			es: 'Sistema',
		}),

		// Providers
		providerLocal: t({
			en: 'Local',
			es: 'Local',
		}),
		providerGoogle: t({
			en: 'Google',
			es: 'Google',
		}),

		// Actions
		editUser: t({
			en: 'Edit user',
			es: 'Editar usuario',
		}),
		deleteUser: t({
			en: 'Delete user',
			es: 'Eliminar usuario',
		}),
		viewDetails: t({
			en: 'View details',
			es: 'Ver detalles',
		}),

		// Edit Modal
		editModalTitle: t({
			en: 'Edit User',
			es: 'Editar Usuario',
		}),
		editModalDescription: t({
			en: 'Update the user information below',
			es: 'Actualiza la información del usuario a continuación',
		}),
		nameLabel: t({
			en: 'Name',
			es: 'Nombre',
		}),
		namePlaceholder: t({
			en: 'Enter user name',
			es: 'Ingresa el nombre del usuario',
		}),
		emailLabel: t({
			en: 'Email',
			es: 'Correo Electrónico',
		}),
		emailPlaceholder: t({
			en: 'Enter user email',
			es: 'Ingresa el correo del usuario',
		}),
		roleLabel: t({
			en: 'Role',
			es: 'Rol',
		}),
		saveChanges: t({
			en: 'Save Changes',
			es: 'Guardar Cambios',
		}),
		cancel: t({
			en: 'Cancel',
			es: 'Cancelar',
		}),
		updating: t({
			en: 'Updating...',
			es: 'Actualizando...',
		}),

		// Delete Modal
		deleteModalTitle: t({
			en: 'Delete User',
			es: 'Eliminar Usuario',
		}),
		deleteModalDescription: t({
			en: 'Are you sure you want to delete this user? This action cannot be undone.',
			es: '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
		}),
		confirmDelete: t({
			en: 'Delete',
			es: 'Eliminar',
		}),
		deleting: t({
			en: 'Deleting...',
			es: 'Eliminando...',
		}),

		// Success messages
		userUpdated: t({
			en: 'User updated successfully',
			es: 'Usuario actualizado exitosamente',
		}),
		userDeleted: t({
			en: 'User deleted successfully',
			es: 'Usuario eliminado exitosamente',
		}),

		// Validation messages
		nameRequired: t({
			en: 'Name is required',
			es: 'El nombre es requerido',
		}),
		emailRequired: t({
			en: 'Email is required',
			es: 'El correo es requerido',
		}),
		invalidEmail: t({
			en: 'Please enter a valid email',
			es: 'Por favor ingresa un correo válido',
		}),

		// User info labels
		userInfo: t({
			en: 'User Information',
			es: 'Información del Usuario',
		}),
	},
} satisfies Dictionary;

export default usersContent;

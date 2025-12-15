import { type Dictionary, t } from 'intlayer';

const organizationsContent = {
	key: 'organizations',
	content: {
		// Page header
		title: t({
			en: 'Organizations',
			es: 'Organizaciones',
		}),
		description: t({
			en: 'Manage and view all organizations in the system',
			es: 'Gestiona y visualiza todas las organizaciones del sistema',
		}),

		// Summary cards
		summaryTotalOrganizations: t({
			en: 'Total Organizations',
			es: 'Total de Organizaciones',
		}),
		summaryRecentlyCreated: t({
			en: 'Recently Created',
			es: 'Creadas Recientemente',
		}),
		summaryActiveOrganizations: t({
			en: 'Active Organizations',
			es: 'Organizaciones Activas',
		}),
		summaryTotalMembers: t({
			en: 'Total Members',
			es: 'Total de Miembros',
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
		organizationDescription: t({
			en: 'Description',
			es: 'Descripción',
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
			en: 'Loading organizations...',
			es: 'Cargando organizaciones...',
		}),
		error: t({
			en: 'Failed to load organizations',
			es: 'Error al cargar las organizaciones',
		}),
		noOrganizations: t({
			en: 'No organizations found',
			es: 'No se encontraron organizaciones',
		}),
		retry: t({
			en: 'Retry',
			es: 'Reintentar',
		}),

		// Search
		searchPlaceholder: t({
			en: 'Search by name or description...',
			es: 'Buscar por nombre o descripción...',
		}),
		totalOrganizations: t({
			en: 'Total organizations',
			es: 'Total de organizaciones',
		}),

		// Actions
		createOrganization: t({
			en: 'Create Organization',
			es: 'Crear Organización',
		}),
		editOrganization: t({
			en: 'Edit organization',
			es: 'Editar organización',
		}),
		deleteOrganization: t({
			en: 'Delete organization',
			es: 'Eliminar organización',
		}),
		viewDetails: t({
			en: 'View details',
			es: 'Ver detalles',
		}),
		viewMembers: t({
			en: 'View members',
			es: 'Ver miembros',
		}),

		// Create Modal
		createModalTitle: t({
			en: 'Create Organization',
			es: 'Crear Organización',
		}),
		createModalDescription: t({
			en: 'Fill in the details to create a new organization',
			es: 'Completa los detalles para crear una nueva organización',
		}),

		// Edit Modal
		editModalTitle: t({
			en: 'Edit Organization',
			es: 'Editar Organización',
		}),
		editModalDescription: t({
			en: 'Update the organization information below',
			es: 'Actualiza la información de la organización a continuación',
		}),
		nameLabel: t({
			en: 'Name',
			es: 'Nombre',
		}),
		namePlaceholder: t({
			en: 'Enter organization name',
			es: 'Ingresa el nombre de la organización',
		}),
		descriptionLabel: t({
			en: 'Description',
			es: 'Descripción',
		}),
		descriptionPlaceholder: t({
			en: 'Enter organization description',
			es: 'Ingresa la descripción de la organización',
		}),
		saveChanges: t({
			en: 'Save Changes',
			es: 'Guardar Cambios',
		}),
		create: t({
			en: 'Create',
			es: 'Crear',
		}),
		cancel: t({
			en: 'Cancel',
			es: 'Cancelar',
		}),
		updating: t({
			en: 'Updating...',
			es: 'Actualizando...',
		}),
		creating: t({
			en: 'Creating...',
			es: 'Creando...',
		}),

		// Delete Modal
		deleteModalTitle: t({
			en: 'Delete Organization',
			es: 'Eliminar Organización',
		}),
		deleteModalDescription: t({
			en: 'Are you sure you want to delete this organization? This action cannot be undone and all members will lose access.',
			es: '¿Estás seguro de que deseas eliminar esta organización? Esta acción no se puede deshacer y todos los miembros perderán acceso.',
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
		organizationCreated: t({
			en: 'Organization created successfully',
			es: 'Organización creada exitosamente',
		}),
		organizationUpdated: t({
			en: 'Organization updated successfully',
			es: 'Organización actualizada exitosamente',
		}),
		organizationDeleted: t({
			en: 'Organization deleted successfully',
			es: 'Organización eliminada exitosamente',
		}),

		// Validation messages
		nameRequired: t({
			en: 'Name is required',
			es: 'El nombre es requerido',
		}),
		descriptionRequired: t({
			en: 'Description is required',
			es: 'La descripción es requerida',
		}),
		nameMinLength: t({
			en: 'Name must be at least 2 characters',
			es: 'El nombre debe tener al menos 2 caracteres',
		}),
		descriptionMinLength: t({
			en: 'Description must be at least 10 characters',
			es: 'La descripción debe tener al menos 10 caracteres',
		}),

		// Filter and export options
		clearFilters: t({
			en: 'Clear Filters',
			es: 'Limpiar Filtros',
		}),
		exportCSV: t({
			en: 'Export to CSV',
			es: 'Exportar a CSV',
		}),

		// Analytics tab
		analytics: t({
			en: 'Analytics',
			es: 'Analítica',
		}),
		organizationsList: t({
			en: 'Organizations List',
			es: 'Lista de Organizaciones',
		}),
		creationTimeline: t({
			en: 'Creation Timeline',
			es: 'Línea de Tiempo de Creación',
		}),
		thisMonth: t({
			en: 'This Month',
			es: 'Este Mes',
		}),
		lastMonth: t({
			en: 'Last Month',
			es: 'Mes Pasado',
		}),
		older: t({
			en: 'Older',
			es: 'Anteriores',
		}),

		// Organization info
		organizationInfo: t({
			en: 'Organization Information',
			es: 'Información de la Organización',
		}),
		noDescription: t({
			en: 'No description available',
			es: 'Sin descripción disponible',
		}),

		// Add member modal
		addMember: t({
			en: 'Add Member',
			es: 'Agregar Miembro',
		}),
		addMemberTitle: t({
			en: 'Add Member to Organization',
			es: 'Agregar Miembro a Organización',
		}),
		addMemberDescription: t({
			en: 'Select a user and assign a role to add them to this organization',
			es: 'Selecciona un usuario y asigna un rol para agregarlo a esta organización',
		}),
		selectUser: t({
			en: 'Select user',
			es: 'Seleccionar usuario',
		}),
		selectUserPlaceholder: t({
			en: 'Choose a user...',
			es: 'Elige un usuario...',
		}),
		selectRole: t({
			en: 'Select role',
			es: 'Seleccionar rol',
		}),
		selectRolePlaceholder: t({
			en: 'Choose a role...',
			es: 'Elige un rol...',
		}),
		owner: t({
			en: 'Owner',
			es: 'Propietario',
		}),
		admin: t({
			en: 'Administrator',
			es: 'Administrador',
		}),
		member: t({
			en: 'Member',
			es: 'Miembro',
		}),
		viewer: t({
			en: 'Viewer',
			es: 'Visualizador',
		}),
		memberAdded: t({
			en: 'Member added successfully',
			es: 'Miembro agregado exitosamente',
		}),
		userRequired: t({
			en: 'User is required',
			es: 'El usuario es requerido',
		}),
		roleRequired: t({
			en: 'Role is required',
			es: 'El rol es requerido',
		}),
		adding: t({
			en: 'Adding...',
			es: 'Agregando...',
		}),
		noUsersAvailable: t({
			en: 'No users available',
			es: 'No hay usuarios disponibles',
		}),

		// View members modal
		viewMembersTitle: t({
			en: 'Organization Members',
			es: 'Miembros de la Organización',
		}),
		viewMembersDescription: t({
			en: 'Manage members and their roles in this organization',
			es: 'Gestiona los miembros y sus roles en esta organización',
		}),
		memberName: t({
			en: 'Name',
			es: 'Nombre',
		}),
		memberEmail: t({
			en: 'Email',
			es: 'Correo Electrónico',
		}),
		memberRole: t({
			en: 'Role',
			es: 'Rol',
		}),
		memberSince: t({
			en: 'Member Since',
			es: 'Miembro Desde',
		}),
		noMembers: t({
			en: 'No members in this organization',
			es: 'No hay miembros en esta organización',
		}),
		loadingMembers: t({
			en: 'Loading members...',
			es: 'Cargando miembros...',
		}),
		membersCount: t({
			en: 'Members',
			es: 'Miembros',
		}),
		close: t({
			en: 'Close',
			es: 'Cerrar',
		}),
	},
} satisfies Dictionary;

export default organizationsContent;

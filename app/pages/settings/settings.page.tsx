import {
	Button,
	Card,
	CardBody,
	cn,
	Divider,
	Input,
	Switch,
	Tab,
	Tabs,
} from '@heroui/react';
import {
	BellIcon,
	GearIcon,
	KeyIcon,
	MoonIcon,
	PaintBrushIcon,
	ShieldCheckIcon,
	UserCircleIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';

export default function SettingsPage() {
	// Settings state
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [pushNotifications, setPushNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [compactMode, setCompactMode] = useState(false);
	const [twoFactorAuth, setTwoFactorAuth] = useState(false);
	const [selectedTab, setSelectedTab] = useState('profile');

	return (
		<div
			className={cn([
				'min-h-screen',
				'bg-gradient-to-br from-background via-content1/30 to-background',
				'p-4 sm:p-6 lg:p-8',
			])}
		>
			<div className={cn(['max-w-5xl mx-auto'])}>
				{/* Header mejorado */}
				<div className={cn(['mb-8'])}>
					<div className={cn(['flex items-center gap-4 mb-3'])}>
						<div
							className={cn([
								'p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5',
							])}
						>
							<GearIcon
								size={40}
								weight="duotone"
								className={cn(['text-primary'])}
							/>
						</div>
						<div>
							<h1
								className={cn([
									'text-3xl sm:text-4xl font-bold',
									'bg-gradient-to-r from-primary via-secondary to-primary',
									'bg-clip-text text-transparent',
								])}
							>
								Configuración
							</h1>
							<p
								className={cn([
									'text-foreground-500 text-sm sm:text-base mt-1',
								])}
							>
								Personaliza tu experiencia en Nexus
							</p>
						</div>
					</div>
				</div>

				{/* Tabs horizontales */}
				<Tabs
					selectedKey={selectedTab}
					onSelectionChange={(key) => setSelectedTab(key as string)}
					color="primary"
					variant="underlined"
					classNames={{
						tabList: 'gap-8 w-full relative',
						cursor: 'w-full bg-primary',
						tab: 'max-w-fit px-2 h-12',
						tabContent: 'group-data-[selected=true]:text-primary',
					}}
					className={cn(['mb-8'])}
				>
					<Tab
						key="profile"
						title={
							<div className="flex items-center gap-2">
								<UserCircleIcon size={20} weight="duotone" />
								<span className="font-medium">Perfil</span>
							</div>
						}
					/>
					<Tab
						key="notifications"
						title={
							<div className="flex items-center gap-2">
								<BellIcon size={20} weight="duotone" />
								<span className="font-medium">Notificaciones</span>
							</div>
						}
					/>
					<Tab
						key="appearance"
						title={
							<div className="flex items-center gap-2">
								<PaintBrushIcon size={20} weight="duotone" />
								<span className="font-medium">Apariencia</span>
							</div>
						}
					/>
					<Tab
						key="security"
						title={
							<div className="flex items-center gap-2">
								<ShieldCheckIcon size={20} weight="duotone" />
								<span className="font-medium">Seguridad</span>
							</div>
						}
					/>
				</Tabs>

				{/* Contenido según tab */}
				{selectedTab === 'profile' && (
					<Card
						className={cn(['shadow-xl border-2 border-divider/50 bg-content1'])}
					>
						<CardBody className={cn(['p-6 sm:p-8', 'space-y-6'])}>
							<div>
								<h3 className={cn(['text-2xl font-bold text-foreground mb-2'])}>
									Información Personal
								</h3>
								<p className={cn(['text-foreground-500'])}>
									Actualiza tu información de perfil
								</p>
							</div>

							<Divider />

							<div className={cn(['grid grid-cols-1 md:grid-cols-2 gap-5'])}>
								<Input
									type="text"
									label="Nombre Completo"
									placeholder="Tu nombre"
									variant="bordered"
									size="lg"
									labelPlacement="outside"
								/>
								<Input
									type="email"
									label="Correo Electrónico"
									placeholder="tu@email.com"
									variant="bordered"
									size="lg"
									labelPlacement="outside"
								/>
								<Input
									type="text"
									label="Nombre de Usuario"
									placeholder="@usuario"
									variant="bordered"
									size="lg"
									labelPlacement="outside"
								/>
								<Input
									type="text"
									label="Rol"
									placeholder="Desarrollador, etc."
									variant="bordered"
									size="lg"
									labelPlacement="outside"
								/>
							</div>

							<Input
								type="text"
								label="Organización"
								placeholder="Nombre de la organización"
								variant="bordered"
								size="lg"
								labelPlacement="outside"
								isReadOnly
								description="Tu organización actual"
							/>

							<div className={cn(['flex justify-end gap-3 pt-4'])}>
								<Button color="default" variant="bordered" size="lg">
									Cancelar
								</Button>
								<Button color="primary" size="lg">
									Guardar Cambios
								</Button>
							</div>
						</CardBody>
					</Card>
				)}

				{selectedTab === 'notifications' && (
					<Card
						className={cn(['shadow-xl border-2 border-divider/50 bg-content1'])}
					>
						<CardBody className={cn(['p-6 sm:p-8', 'space-y-6'])}>
							<div>
								<h3 className={cn(['text-2xl font-bold text-foreground mb-2'])}>
									Preferencias de Notificaciones
								</h3>
								<p className={cn(['text-foreground-500'])}>
									Controla cómo y cuándo recibes notificaciones
								</p>
							</div>

							<Divider />

							<div className={cn(['space-y-5'])}>
								<div
									className={cn([
										'flex items-center justify-between p-4 rounded-lg bg-content2',
									])}
								>
									<div className={cn(['flex-1'])}>
										<p
											className={cn(['font-semibold text-foreground text-lg'])}
										>
											Notificaciones por Email
										</p>
										<p className={cn(['text-sm text-foreground-500 mt-1'])}>
											Recibe actualizaciones importantes por correo electrónico
										</p>
									</div>
									<Switch
										isSelected={emailNotifications}
										onValueChange={setEmailNotifications}
										color="primary"
										size="lg"
									/>
								</div>

								<div
									className={cn([
										'flex items-center justify-between p-4 rounded-lg bg-content2',
									])}
								>
									<div className={cn(['flex-1'])}>
										<p
											className={cn(['font-semibold text-foreground text-lg'])}
										>
											Notificaciones Push
										</p>
										<p className={cn(['text-sm text-foreground-500 mt-1'])}>
											Recibe notificaciones en tiempo real en el navegador
										</p>
									</div>
									<Switch
										isSelected={pushNotifications}
										onValueChange={setPushNotifications}
										color="primary"
										size="lg"
									/>
								</div>
							</div>
						</CardBody>
					</Card>
				)}

				{selectedTab === 'appearance' && (
					<Card
						className={cn(['shadow-xl border-2 border-divider/50 bg-content1'])}
					>
						<CardBody className={cn(['p-6 sm:p-8', 'space-y-6'])}>
							<div>
								<h3 className={cn(['text-2xl font-bold text-foreground mb-2'])}>
									Personalización de Apariencia
								</h3>
								<p className={cn(['text-foreground-500'])}>
									Ajusta la interfaz a tus preferencias visuales
								</p>
							</div>

							<Divider />

							<div className={cn(['space-y-5'])}>
								<div
									className={cn([
										'flex items-center justify-between p-4 rounded-lg bg-content2',
									])}
								>
									<div className={cn(['flex items-center gap-3 flex-1'])}>
										<MoonIcon
											size={24}
											weight="duotone"
											className={cn(['text-primary'])}
										/>
										<div>
											<p
												className={cn([
													'font-semibold text-foreground text-lg',
												])}
											>
												Modo Oscuro
											</p>
											<p className={cn(['text-sm text-foreground-500 mt-1'])}>
												Cambia entre tema claro y oscuro
											</p>
										</div>
									</div>
									<Switch
										isSelected={darkMode}
										onValueChange={setDarkMode}
										color="primary"
										size="lg"
									/>
								</div>

								<div
									className={cn([
										'flex items-center justify-between p-4 rounded-lg bg-content2',
									])}
								>
									<div className={cn(['flex-1'])}>
										<p
											className={cn(['font-semibold text-foreground text-lg'])}
										>
											Modo Compacto
										</p>
										<p className={cn(['text-sm text-foreground-500 mt-1'])}>
											Reduce el espaciado para mostrar más contenido
										</p>
									</div>
									<Switch
										isSelected={compactMode}
										onValueChange={setCompactMode}
										color="primary"
										size="lg"
									/>
								</div>
							</div>
						</CardBody>
					</Card>
				)}

				{selectedTab === 'security' && (
					<Card
						className={cn(['shadow-xl border-2 border-divider/50 bg-content1'])}
					>
						<CardBody className={cn(['p-6 sm:p-8', 'space-y-6'])}>
							<div>
								<h3 className={cn(['text-2xl font-bold text-foreground mb-2'])}>
									Seguridad de la Cuenta
								</h3>
								<p className={cn(['text-foreground-500'])}>
									Protege tu cuenta con opciones de seguridad adicionales
								</p>
							</div>

							<Divider />

							<div className={cn(['space-y-6'])}>
								<div
									className={cn([
										'flex items-center justify-between p-4 rounded-lg bg-content2',
									])}
								>
									<div className={cn(['flex items-center gap-3 flex-1'])}>
										<ShieldCheckIcon
											size={24}
											weight="duotone"
											className={cn(['text-primary'])}
										/>
										<div>
											<p
												className={cn([
													'font-semibold text-foreground text-lg',
												])}
											>
												Autenticación de Dos Factores
											</p>
											<p className={cn(['text-sm text-foreground-500 mt-1'])}>
												Agrega una capa extra de seguridad a tu cuenta
											</p>
										</div>
									</div>
									<Switch
										isSelected={twoFactorAuth}
										onValueChange={setTwoFactorAuth}
										color="primary"
										size="lg"
									/>
								</div>

								<Divider />

								<div className={cn(['space-y-4'])}>
									<div className={cn(['flex items-center gap-3 mb-4'])}>
										<KeyIcon
											size={24}
											weight="duotone"
											className={cn(['text-primary'])}
										/>
										<h4
											className={cn(['font-semibold text-foreground text-lg'])}
										>
											Cambiar Contraseña
										</h4>
									</div>
									<Input
										type="password"
										label="Contraseña Actual"
										placeholder="••••••••"
										variant="bordered"
										size="lg"
										labelPlacement="outside"
									/>
									<Input
										type="password"
										label="Nueva Contraseña"
										placeholder="••••••••"
										variant="bordered"
										size="lg"
										labelPlacement="outside"
									/>
									<Input
										type="password"
										label="Confirmar Nueva Contraseña"
										placeholder="••••••••"
										variant="bordered"
										size="lg"
										labelPlacement="outside"
									/>
									<Button
										color="primary"
										size="lg"
										className={cn(['w-full sm:w-auto'])}
									>
										Actualizar Contraseña
									</Button>
								</div>
							</div>
						</CardBody>
					</Card>
				)}
			</div>
		</div>
	);
}

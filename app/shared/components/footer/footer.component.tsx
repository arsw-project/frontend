import { cn, Link } from '@heroui/react';
import {
	GithubLogoIcon,
	LinkedinLogoIcon,
	TwitterLogoIcon,
} from '@phosphor-icons/react';

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			className={cn([
				'w-full',
				'border-t border-divider',
				'bg-content1',
				'mt-auto',
			])}
		>
			<div
				className={cn([
					'max-w-7xl mx-auto',
					'px-4 sm:px-6 md:px-8',
					'py-6 sm:py-8',
				])}
			>
				<div className={cn(['grid grid-cols-1 md:grid-cols-3 gap-8', 'mb-6'])}>
					{/* Brand */}
					<div className={cn(['space-y-3'])}>
						<h3 className={cn(['text-lg font-bold', 'text-primary'])}>Nexus</h3>
						<p className={cn(['text-sm text-foreground-500', 'max-w-xs'])}>
							Plataforma de gestión de proyectos y colaboración en equipo.
						</p>
					</div>

					{/* Quick Links */}
					<div className={cn(['space-y-3'])}>
						<h4
							className={cn([
								'text-sm font-semibold',
								'text-foreground',
								'uppercase tracking-wide',
							])}
						>
							Enlaces Rápidos
						</h4>
						<ul className={cn(['space-y-2'])}>
							<li>
								<Link
									href="/"
									className={cn([
										'text-sm text-foreground-500 hover:text-primary',
									])}
								>
									Dashboard
								</Link>
							</li>
							<li>
								<Link
									href="/board"
									className={cn([
										'text-sm text-foreground-500 hover:text-primary',
									])}
								>
									Tablero
								</Link>
							</li>
							<li>
								<Link
									href="/organizations"
									className={cn([
										'text-sm text-foreground-500 hover:text-primary',
									])}
								>
									Organizaciones
								</Link>
							</li>
							<li>
								<Link
									href="/settings"
									className={cn([
										'text-sm text-foreground-500 hover:text-primary',
									])}
								>
									Configuración
								</Link>
							</li>
							<li>
								<Link
									href="/support"
									className={cn([
										'text-sm text-foreground-500 hover:text-primary',
									])}
								>
									Soporte
								</Link>
							</li>
						</ul>
					</div>

					{/* Social */}
					<div className={cn(['space-y-3'])}>
						<h4
							className={cn([
								'text-sm font-semibold',
								'text-foreground',
								'uppercase tracking-wide',
							])}
						>
							Síguenos
						</h4>
						<div className={cn(['flex items-center gap-4'])}>
							<Link
								href="#"
								isExternal
								className={cn(['text-foreground-500 hover:text-primary'])}
							>
								<GithubLogoIcon size={24} weight="fill" />
							</Link>
							<Link
								href="#"
								isExternal
								className={cn(['text-foreground-500 hover:text-primary'])}
							>
								<TwitterLogoIcon size={24} weight="fill" />
							</Link>
							<Link
								href="#"
								isExternal
								className={cn(['text-foreground-500 hover:text-primary'])}
							>
								<LinkedinLogoIcon size={24} weight="fill" />
							</Link>
						</div>
					</div>
				</div>

				{/* Bottom */}
				<div
					className={cn([
						'pt-6',
						'border-t border-divider',
						'flex flex-col sm:flex-row',
						'items-center justify-between',
						'gap-4',
					])}
				>
					<p className={cn(['text-sm text-foreground-500'])}>
						© {currentYear} Nexus. Todos los derechos reservados.
					</p>
					<div className={cn(['flex items-center gap-4'])}>
						<Link
							href="/privacy"
							className={cn(['text-sm text-foreground-500 hover:text-primary'])}
						>
							Privacidad
						</Link>
						<Link
							href="/terms"
							className={cn(['text-sm text-foreground-500 hover:text-primary'])}
						>
							Términos
						</Link>
						<Link
							href="/support"
							className={cn(['text-sm text-foreground-500 hover:text-primary'])}
						>
							Soporte
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

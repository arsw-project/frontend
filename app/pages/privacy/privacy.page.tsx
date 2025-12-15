import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Link,
} from '@heroui/react';
import { ArrowLeftIcon, ShieldCheckIcon } from '@phosphor-icons/react';
import { LocaleSwitcher } from '@shared/components/locale-switcher/locale-switcher.component';
import { ThemeSwitcher } from '@shared/components/theme-switcher/theme-switcher.component';
import { memo } from 'react';
import { useIntlayer } from 'react-intlayer';

const PrivacyPage = memo(() => {
	const content = useIntlayer('privacy');

	return (
		<div className="min-h-dvh w-full bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-divider bg-background/80 backdrop-blur-md">
				<div className="container mx-auto flex items-center justify-between px-4 py-4">
					<Link
						href="/"
						className="flex items-center gap-2 text-foreground no-underline transition-colors hover:text-primary"
					>
						<ArrowLeftIcon size={20} weight="bold" />
						<span className="font-medium text-small">{content.backToHome}</span>
					</Link>
					<div className="flex items-center gap-2">
						<ThemeSwitcher />
						<LocaleSwitcher />
					</div>
				</div>
			</header>

			{/* Content */}
			<main className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
				<div className="mb-8 flex flex-col items-center gap-4 text-center">
					<div className="rounded-full bg-primary/10 p-4">
						<ShieldCheckIcon
							size={48}
							weight="duotone"
							className="text-primary"
						/>
					</div>
					<h1 className="font-bold text-4xl text-foreground md:text-5xl">
						{content.title}
					</h1>
					<p className="text-foreground-500 text-small">
						{content.lastUpdated}: December 15, 2025
					</p>
				</div>

				<div className="flex flex-col gap-6">
					{/* Introduction */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.introduction.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.introduction.content}
							</p>
						</CardBody>
					</Card>

					{/* Data Collection */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.dataCollection.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.dataCollection.content}
							</p>
						</CardBody>
					</Card>

					{/* Data Usage */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.dataUsage.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.dataUsage.content}
							</p>
						</CardBody>
					</Card>

					{/* Data Protection */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.dataProtection.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.dataProtection.content}
							</p>
						</CardBody>
					</Card>

					{/* User Rights */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.userRights.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.userRights.content}
							</p>
						</CardBody>
					</Card>

					{/* Contact */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.contact.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.contact.content}
							</p>
						</CardBody>
					</Card>
				</div>

				{/* Back to top */}
				<div className="mt-12 flex justify-center">
					<Button
						as={Link}
						href="/"
						color="primary"
						variant="flat"
						startContent={<ArrowLeftIcon size={18} weight="bold" />}
					>
						{content.backToHome}
					</Button>
				</div>
			</main>
		</div>
	);
});

export default PrivacyPage;

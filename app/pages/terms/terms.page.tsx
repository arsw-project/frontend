import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Link,
} from '@heroui/react';
import { ArrowLeftIcon, FileTextIcon } from '@phosphor-icons/react';
import { LocaleSwitcher } from '@shared/components/locale-switcher/locale-switcher.component';
import { ThemeSwitcher } from '@shared/components/theme-switcher/theme-switcher.component';
import { memo } from 'react';
import { useIntlayer } from 'react-intlayer';

const TermsPage = memo(() => {
	const content = useIntlayer('terms');

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
						<FileTextIcon size={48} weight="duotone" className="text-primary" />
					</div>
					<h1 className="font-bold text-4xl text-foreground md:text-5xl">
						{content.title}
					</h1>
					<p className="text-foreground-500 text-small">
						{content.lastUpdated}: December 15, 2025
					</p>
				</div>

				<div className="flex flex-col gap-6">
					{/* Acceptance */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.acceptance.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.acceptance.content}
							</p>
						</CardBody>
					</Card>

					{/* Service Description */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.serviceDescription.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.serviceDescription.content}
							</p>
						</CardBody>
					</Card>

					{/* User Responsibilities */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.userResponsibilities.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.userResponsibilities.content}
							</p>
						</CardBody>
					</Card>

					{/* Prohibited Uses */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.prohibitedUses.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.prohibitedUses.content}
							</p>
						</CardBody>
					</Card>

					{/* Intellectual Property */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.intellectualProperty.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.intellectualProperty.content}
							</p>
						</CardBody>
					</Card>

					{/* Limitation */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.limitation.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.limitation.content}
							</p>
						</CardBody>
					</Card>

					{/* Termination */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.termination.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.termination.content}
							</p>
						</CardBody>
					</Card>

					{/* Changes */}
					<Card className="border border-divider shadow-small">
						<CardHeader>
							<h2 className="font-semibold text-foreground text-xl">
								{content.changes.title}
							</h2>
						</CardHeader>
						<Divider />
						<CardBody>
							<p className="text-foreground-700 leading-relaxed">
								{content.changes.content}
							</p>
						</CardBody>
					</Card>
				</div>

				{/* Back to home */}
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

export default TermsPage;

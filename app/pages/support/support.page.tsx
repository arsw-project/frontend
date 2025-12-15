import {
	Accordion,
	AccordionItem,
	Button,
	Card,
	CardBody,
	CardHeader,
	Link,
} from '@heroui/react';
import {
	ArrowLeftIcon,
	BookOpenIcon,
	ChartLineUpIcon,
	ChatsCircleIcon,
	ClockIcon,
	EnvelopeSimpleIcon,
	LifebuoyIcon,
	TimerIcon,
} from '@phosphor-icons/react';
import { LocaleSwitcher } from '@shared/components/locale-switcher/locale-switcher.component';
import { ThemeSwitcher } from '@shared/components/theme-switcher/theme-switcher.component';
import { memo } from 'react';
import { useIntlayer } from 'react-intlayer';

const SupportPage = memo(() => {
	const content = useIntlayer('support');

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
			<main className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
				{/* Hero Section */}
				<div className="mb-12 flex flex-col items-center gap-4 text-center">
					<div className="rounded-full bg-primary/10 p-4">
						<LifebuoyIcon size={48} weight="duotone" className="text-primary" />
					</div>
					<h1 className="font-bold text-4xl text-foreground md:text-5xl">
						{content.title}
					</h1>
					<p className="text-foreground-500 text-lg">{content.subtitle}</p>
				</div>

				{/* FAQ Section */}
				<section className="mb-12">
					<h2 className="mb-6 font-semibold text-2xl text-foreground">
						{content.faq.title}
					</h2>
					<Accordion variant="splitted" selectionMode="multiple">
						<AccordionItem
							key="1"
							aria-label={content.faq.question1.q}
							title={content.faq.question1.q}
							className="border border-divider"
						>
							<p className="pb-4 text-foreground-700">
								{content.faq.question1.a}
							</p>
						</AccordionItem>
						<AccordionItem
							key="2"
							aria-label={content.faq.question2.q}
							title={content.faq.question2.q}
							className="border border-divider"
						>
							<p className="pb-4 text-foreground-700">
								{content.faq.question2.a}
							</p>
						</AccordionItem>
						<AccordionItem
							key="3"
							aria-label={content.faq.question3.q}
							title={content.faq.question3.q}
							className="border border-divider"
						>
							<p className="pb-4 text-foreground-700">
								{content.faq.question3.a}
							</p>
						</AccordionItem>
						<AccordionItem
							key="4"
							aria-label={content.faq.question4.q}
							title={content.faq.question4.q}
							className="border border-divider"
						>
							<p className="pb-4 text-foreground-700">
								{content.faq.question4.a}
							</p>
						</AccordionItem>
					</Accordion>
				</section>

				{/* Contact Support */}
				<section className="mb-12">
					<h2 className="mb-6 font-semibold text-2xl text-foreground">
						{content.contact.title}
					</h2>
					<Card className="border border-divider shadow-medium">
						<CardBody className="gap-6">
							<p className="text-foreground-600 text-lg">
								{content.contact.description}
							</p>
							<div className="grid gap-4 md:grid-cols-3">
								<div className="flex items-start gap-3">
									<div className="rounded-medium bg-primary/10 p-2">
										<EnvelopeSimpleIcon
											size={24}
											weight="duotone"
											className="text-primary"
										/>
									</div>
									<div>
										<p className="font-semibold text-foreground text-small">
											{content.contact.email.label}
										</p>
										<p className="text-foreground-500 text-small">
											{content.contact.email.value}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="rounded-medium bg-primary/10 p-2">
										<ClockIcon
											size={24}
											weight="duotone"
											className="text-primary"
										/>
									</div>
									<div>
										<p className="font-semibold text-foreground text-small">
											{content.contact.hours.label}
										</p>
										<p className="text-foreground-500 text-small">
											{content.contact.hours.value}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="rounded-medium bg-primary/10 p-2">
										<TimerIcon
											size={24}
											weight="duotone"
											className="text-primary"
										/>
									</div>
									<div>
										<p className="font-semibold text-foreground text-small">
											{content.contact.response.label}
										</p>
										<p className="text-foreground-500 text-small">
											{content.contact.response.value}
										</p>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</section>

				{/* Additional Resources */}
				<section>
					<h2 className="mb-6 font-semibold text-2xl text-foreground">
						{content.resources.title}
					</h2>
					<div className="grid gap-4 md:grid-cols-3">
						<Card className="border border-divider shadow-small transition-shadow hover:shadow-medium">
							<CardHeader className="flex-col items-start gap-2">
								<div className="rounded-medium bg-primary/10 p-2">
									<BookOpenIcon
										size={24}
										weight="duotone"
										className="text-primary"
									/>
								</div>
								<h3 className="font-semibold text-foreground text-lg">
									{content.resources.documentation.title}
								</h3>
							</CardHeader>
							<CardBody>
								<p className="text-foreground-600 text-small">
									{content.resources.documentation.description}
								</p>
							</CardBody>
						</Card>

						<Card className="border border-divider shadow-small transition-shadow hover:shadow-medium">
							<CardHeader className="flex-col items-start gap-2">
								<div className="rounded-medium bg-primary/10 p-2">
									<ChatsCircleIcon
										size={24}
										weight="duotone"
										className="text-primary"
									/>
								</div>
								<h3 className="font-semibold text-foreground text-lg">
									{content.resources.community.title}
								</h3>
							</CardHeader>
							<CardBody>
								<p className="text-foreground-600 text-small">
									{content.resources.community.description}
								</p>
							</CardBody>
						</Card>

						<Card className="border border-divider shadow-small transition-shadow hover:shadow-medium">
							<CardHeader className="flex-col items-start gap-2">
								<div className="rounded-medium bg-primary/10 p-2">
									<ChartLineUpIcon
										size={24}
										weight="duotone"
										className="text-primary"
									/>
								</div>
								<h3 className="font-semibold text-foreground text-lg">
									{content.resources.status.title}
								</h3>
							</CardHeader>
							<CardBody>
								<p className="text-foreground-600 text-small">
									{content.resources.status.description}
								</p>
							</CardBody>
						</Card>
					</div>
				</section>

				{/* CTA */}
				<div className="mt-12 flex justify-center">
					<Button
						as={Link}
						href="/"
						color="primary"
						size="lg"
						startContent={<ArrowLeftIcon size={18} weight="bold" />}
					>
						{content.backToHome}
					</Button>
				</div>
			</main>
		</div>
	);
});

export default SupportPage;

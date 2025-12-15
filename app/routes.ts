import { layout, type RouteConfig, route } from '@react-router/dev/routes';

export default [
	layout('pages/index/index.layout.tsx', [
		route('/:lang?', 'pages/index/index.page.tsx'),
		route('/:lang?/members/', 'pages/users/users.page.tsx'),
		route(
			'/:lang?/organizations/',
			'pages/organizations/organizations.page.tsx',
		),
		route('/:lang?/board/', 'pages/board/board.page.tsx'),
		route('/:lang?/settings/', 'pages/settings/settings.page.tsx'),
	]),
	route(':lang?/auth/login/', 'pages/login/login.page.tsx'),
	route(':lang?/privacy/', 'pages/privacy/privacy.page.tsx'),
	route(':lang?/terms/', 'pages/terms/terms.page.tsx'),
	route(':lang?/support/', 'pages/support/support.page.tsx'),
] satisfies RouteConfig;

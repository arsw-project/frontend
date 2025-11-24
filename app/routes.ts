import { layout, type RouteConfig, route } from '@react-router/dev/routes';

export default [
	layout('pages/index/index.layout.tsx', [
		route('/:lang?', 'pages/index/index.page.tsx'),
		route('/:lang?/members/', 'pages/users/users.page.tsx'),
		route(
			'/:lang?/organizations/',
			'pages/organizations/organizations.page.tsx',
		),
	]),
	route(':lang?/auth/login/', 'pages/login/login.page.tsx'),
] satisfies RouteConfig;

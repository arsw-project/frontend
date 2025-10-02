import {
	index,
	layout,
	type RouteConfig,
	route,
} from '@react-router/dev/routes';

export default [
	layout('pages/index/index.layout.tsx', [index('pages/index/index.page.tsx')]),
	route('auth/login', 'pages/login/login.page.tsx'),
] satisfies RouteConfig;

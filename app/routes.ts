import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
	index('pages/index/index.page.tsx'),
	route('auth/login', 'pages/login/login.page.tsx'),
] satisfies RouteConfig;

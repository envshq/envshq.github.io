// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://envsh.dev',
	integrations: [
		starlight({
			title: 'envsh',
			description: 'Zero-knowledge secret management. The server can\'t read your secrets.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/envshq/envsh' }],
			customCss: ['./src/styles/custom.css'],
			head: [
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#0f172a' } },
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quickstart' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'How It Works', slug: 'concepts/how-it-works' },
						{ label: 'Push & Pull', slug: 'concepts/push-pull' },
						{ label: 'Run', slug: 'concepts/run' },
					],
				},
				{
					label: 'Team',
					items: [
						{ label: 'Workspace & Members', slug: 'team/workspace' },
						{ label: 'SSH Keys', slug: 'team/keys' },
						{ label: 'Machine Identities', slug: 'team/machines' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'CI/CD Setup', slug: 'guides/cicd' },
						{ label: 'Self-Hosting', slug: 'guides/self-hosting' },
						{ label: 'Troubleshooting', slug: 'guides/troubleshooting' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'CLI Commands', slug: 'reference/commands' },
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'Security & Crypto', slug: 'reference/security' },
					],
				},
			],
		}),
	],
});

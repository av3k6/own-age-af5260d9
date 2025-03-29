
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom theme colors with dark mode variants
				"zen-blue": {
					DEFAULT: "#235789",
					50: "#e6f0f9",
					100: "#cce0f2",
					200: "#99c2e6",
					300: "#66a3d9",
					400: "#3385cd",
					500: "#235789",
					600: "#1c466e",
					700: "#153452",
					800: "#0e2337",
					900: "#07111b",
				},
				"zen-teal": {
					DEFAULT: "#2AA198",
					50: "#e6f6f5",
					100: "#ccedea",
					200: "#99dbd5",
					300: "#66c9c0",
					400: "#33b7ab",
					500: "#2AA198",
					600: "#22817a",
					700: "#19615c",
					800: "#11403d",
					900: "#08201f",
				},
				"zen-green": {
					DEFAULT: "#8BC34A",
					50: "#f4f9ea",
					100: "#e9f3d5",
					200: "#d3e7ac",
					300: "#bddb82",
					400: "#a7cf59",
					500: "#8BC34A",
					600: "#6f9c3b",
					700: "#53752c",
					800: "#384e1d",
					900: "#1c270e",
				},
				"zen-gray": {
					DEFAULT: "#585563",
					50: "#edeef0",
					100: "#dbdde1",
					200: "#b7bac3",
					300: "#9398a5",
					400: "#6f7587",
					500: "#585563",
					600: "#46444f",
					700: "#35333c",
					800: "#232228",
					900: "#121114",
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			transitionProperty: {
				'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
			},
			transitionDuration: {
				'300': '300ms',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

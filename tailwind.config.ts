
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
				// UTI Games Professional Colors
				uti: {
					red: 'hsl(var(--uti-red))',
					dark: 'hsl(var(--uti-dark))',
					gray: 'hsl(var(--uti-gray))',
					'light-gray': 'hsl(var(--uti-light-gray))',
					border: 'hsl(var(--uti-border))'
				},
				// Platform Colors
				platform: {
					playstation: '#0070f3',
					xbox: '#107c10',
					nintendo: '#e60012',
					pc: '#ff6600',
					steam: '#1b2838'
				}
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
				heading: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				display: ['Montserrat', 'sans-serif']
			},
			fontSize: {
				'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'section-title': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
				'card-title': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.015em' }]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'professional': '0.75rem',
				'card': '1rem',
				'button': '0.5rem'
			},
			spacing: {
				'section': '6rem',
				'section-sm': '4rem',
				'section-lg': '8rem'
			},
			boxShadow: {
				'professional': '0 10px 40px rgba(0, 0, 0, 0.1)',
				'professional-hover': '0 20px 60px rgba(0, 0, 0, 0.15)',
				'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
				'card-hover': '0 8px 40px rgba(0, 0, 0, 0.12)'
			},
			animation: {
				'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
				'fade-in-left': 'fadeInLeft 0.8s ease-out forwards',
				'fade-in-right': 'fadeInRight 0.8s ease-out forwards',
				'scale-in': 'scaleIn 0.6s ease-out forwards',
				'bounce-in': 'bounceIn 1s ease-out forwards',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'professional-hover': 'professionalHover 0.3s ease-out'
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
				},
				fadeInUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				fadeInLeft: {
					'0%': {
						opacity: '0',
						transform: 'translateX(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				fadeInRight: {
					'0%': {
						opacity: '0',
						transform: 'translateX(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				scaleIn: {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				bounceIn: {
					'0%': {
						opacity: '0',
						transform: 'scale(0.3)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.05)'
					},
					'70%': {
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				professionalHover: {
					'0%': {
						transform: 'translateY(0) scale(1)'
					},
					'100%': {
						transform: 'translateY(-4px) scale(1.02)'
					}
				}
			},
			backdropBlur: {
				'professional': '16px'
			},
			transitionDuration: {
				'professional': '300ms'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

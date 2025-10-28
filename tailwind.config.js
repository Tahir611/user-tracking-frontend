/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		animation: {
  			'fade-in': 'fadeIn 0.6s ease-out',
  			'slide-up': 'slideUp 0.8s ease-out',
  			'attention-pulse': 'attentionPulse 2s infinite',
  			'attention-bounce': 'attentionBounce 1s infinite',
  			'smooth-scale': 'smoothScale 0.3s ease-in-out',
  			'smooth-float': 'smoothFloat 3s ease-in-out infinite',
  			'group-hover': 'groupHover 0.3s ease-in-out',
  			'hierarchy-slide': 'hierarchySlide 0.5s ease-out',
  			'image-zoom': 'imageZoom 0.3s ease-in-out',
  			'color-shift': 'colorShift 2s ease-in-out',
  			'input-focus': 'inputFocus 0.3s ease-in-out',
  			'button-press': 'buttonPress 0.3s ease-in-out',
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			slideUp: {
  				'0%': { opacity: '0', transform: 'translateY(30px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			attentionPulse: {
  				'0%': { transform: 'scale(1)', opacity: '1' },
  				'50%': { transform: 'scale(1.1)', opacity: '0.8' },
  				'100%': { transform: 'scale(1)', opacity: '1' }
  			},
  			attentionBounce: {
  				'0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
  				'40%': { transform: 'translateY(-10px)' },
  				'60%': { transform: 'translateY(-5px)' }
  			},
  			smoothScale: {
  				'0%': { transform: 'scale(1)' },
  				'50%': { transform: 'scale(1.05)' },
  				'100%': { transform: 'scale(1)' }
  			},
  			smoothFloat: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-10px)' }
  			},
  			groupHover: {
  				'0%': { transform: 'translateY(0)' },
  				'100%': { transform: 'translateY(-5px)' }
  			},
  			hierarchySlide: {
  				'0%': { transform: 'translateX(-20px)', opacity: '0' },
  				'100%': { transform: 'translateX(0)', opacity: '1' }
  			},
  			imageZoom: {
  				'0%': { transform: 'scale(1)' },
  				'50%': { transform: 'scale(1.05)' },
  				'100%': { transform: 'scale(1)' }
  			},
  			colorShift: {
  				'0%': { filter: 'hue-rotate(0deg)' },
  				'50%': { filter: 'hue-rotate(180deg)' },
  				'100%': { filter: 'hue-rotate(360deg)' }
  			},
  			inputFocus: {
  				'0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
  				'100%': { transform: 'scale(1.02)', boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)' }
  			},
  			buttonPress: {
  				'0%': { transform: 'scale(1)' },
  				'50%': { transform: 'scale(0.95)' },
  				'100%': { transform: 'scale(1)' }
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

// @ts-check

import '@testing-library/jest-dom/extend-expect';
import { act, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import FseStudioApp from '../';

const getThemeEndpoint = 'https://example.com/get-theme'
const saveThemeEndpoint = 'https://example.com/save-theme'
const getThemeJsonFileEndpoint = 'https://example.com/get-themejson-file'

const themeSavedMessage = 'Theme saved to your /themes/ folder';

jest.mock( '../../../globals', () => {
	return { fsestudio: {
		themes: {},
		apiEndpoints: {
			getThemeEndpoint,
			getThemeJsonFileEndpoint,
			saveThemeEndpoint,
		},
		initialTheme: '',
	} };
} );

const mockThemeJson = {
	name: "default",
	content: {
	  version: 2,
	  templateParts: [
		{
		  name: "header",
		  title: "Header",
		  area: "header"
		},
		{
		  name: "footer",
		  title: "Footer",
		  area: "footer"
		}
	  ],
	  customTemplates: [
		{
		  name: "blank",
		  title: "Blank",
		  postTypes: [
			"page",
			"post"
		  ]
		},
		{
		  name: "no-title",
		  title: "No Title",
		  postTypes: [
			"page",
			"post"
		  ]
		}
	  ],
	  settings: {
		border: {
		  color: true,
		  radius: true,
		  style: true,
		  width: true
		},
		color: {
		  custom: true,
		  customDuotone: true,
		  customGradient: true,
		  defaultGradients: false,
		  defaultPalette: false,
		  gradients: [
			{
			  name: "Black to Primary",
			  slug: "black-primary",
			  gradient: "linear-gradient(135deg,rgb(0,0,0) 50%,rgb(153,0,153) 100%)"
			},
			{
			  name: "Black to Secondary",
			  slug: "black-secondary",
			  gradient: "linear-gradient(135deg,rgb(0,0,0) 50%,rgb(0,153,255) 100%)"
			},
			{
			  name: "Black to Tertiary",
			  slug: "black-tertiary",
			  gradient: "linear-gradient(135deg,rgb(0,0,0) 50%,rgb(0,204,204) 100%)"
			}
		  ],
		  link: true,
		  palette: [
			{
			  name: "Black",
			  slug: "black",
			  color: "#000000"
			},
			{
			  name: "Primary",
			  slug: "primary",
			  color: "#00ff2f"
			},
			{
			  name: "Secondary",
			  slug: "secondary",
			  color: "#009d03"
			},
			{
			  name: "Tertiary",
			  slug: "tertiary",
			  color: "#00cccc"
			},
			{
			  name: "Gray",
			  slug: "gray",
			  color: "#eee"
			},
			{
			  name: "White",
			  slug: "white",
			  color: "#ffffff"
			}
		  ]
		},
		custom: {
		  lineHeight: {
			one: 1,
			heading: 1.1,
			medium: 1.5,
			body: 1.75
		  },
		  spacing: {
			outer: "30px"
		  }
		},
		layout: {
		  contentSize: "640px",
		  wideSize: "1200px"
		},
		spacing: {
		  blockGap: null,
		  margin: true,
		  padding: true,
		  units: [
			"px",
			"em",
			"rem",
			"vh",
			"vw",
			"%"
		  ]
		},
		typography: {
		  customFontSize: true,
		  dropCap: false,
		  fontFamilies: [
			{
			  fontFamily: "monospace",
			  name: "Monospace",
			  slug: "monospace"
			}
		  ],
		  fontSizes: [
			{
			  name: "Small",
			  slug: "small",
			  size: "16px"
			},
			{
			  name: "Medium",
			  slug: "medium",
			  size: "20px"
			},
			{
			  name: "Large",
			  slug: "large",
			  size: "24px"
			},
			{
			  name: "xLarge",
			  slug: "x-large",
			  size: "30px"
			},
			{
			  name: "36px",
			  slug: "max-36",
			  size: "clamp(24px, 3vw, 36px)"
			},
			{
			  name: "48px",
			  slug: "max-48",
			  size: "clamp(30px, 4vw, 48px)"
			},
			{
			  name: "60px",
			  slug: "max-60",
			  size: "clamp(36px, 5vw, 60px)"
			},
			{
			  name: "72px",
			  slug: "max-72",
			  size: "clamp(48px, 6vw, 72px)"
			}
		  ],
		  lineHeight: true
		}
	  },
	  styles: {
		blocks: {
		  'core/column': {
			spacing: {
			  margin: {
				bottom: "30px"
			  }
			}
		  },
		  'core/columns': {
			spacing: {
			  margin: {
				bottom: "0"
			  }
			}
		  },
		},
		color: {
		  background: "var(--wp--preset--color--white)",
		  text: "var(--wp--preset--color--black)"
		},
		elements: {
		  h1: {
			typography: {
			  fontSize: "var(--wp--preset--font-size--x-large)"
			}
		  },
		  h2: {
			typography: {
			  fontSize: "var(--wp--preset--font-size--large)"
			}
		  },
		  h3: {
			typography: {
			  fontSize: "var(--wp--preset--font-size--large)"
			}
		  },
		  h4: {
			typography: {
			  fontSize: "var(--wp--preset--font-size--medium)"
			}
		  },
		  h5: {
			typography: {
			  fontSize: "var(--wp--preset--font-size--small)"
			}
		  },
		  h6: {
			typography: {
			  fontSize: "var(--wp--preset--font-size--small)"
			}
		  },
		  link: {
			color: {
			  text: "var(--wp--preset--color--black)"
			}
		  }
		},
		typography: {
		  fontFamily: "var(--wp--preset--font-family--jost)",
		  fontSize: "var(--wp--preset--font-size--medium)",
		  fontWeight: "var(--wp--custom--font-weight--regular)",
		  lineHeight: "var(--wp--custom--line-height--body)"
		}
	  }
	},
};

global.fetch = jest.fn( ( request ) => {
	return Promise.resolve( {
		ok: true,
    	json: () => {
			if ( request.toString().includes( getThemeEndpoint ) ) {
				return Promise.resolve( mockThemeJson );
			}
			if ( request.path.includes( saveThemeEndpoint ) ) {
				return Promise.resolve( themeSavedMessage );
			}
			if ( request.path.includes( getThemeJsonFileEndpoint ) ) {
				return Promise.resolve( mockThemeJson );
			}
		},
	} );
} );

beforeEach(() => {
  fetch.mockClear();
});

test( 'FseStudioApp', async () => {
	render( <FseStudioApp /> );

	// When there is no theme saved, you shouldn't be able to choose a theme.
	expect( 
		screen.queryByText( /choose a theme/i )
	).not.toBeInTheDocument();

	// The Theme Manager tab should be present.
	expect( screen.getByRole( 'button', {
		name: /theme manager/i
	} ) ).toBeInTheDocument();

	// The Pattern Editor tab shouldn't be present, as there's no theme saved.
	expect( screen.queryByRole( 'button', {
		name: /pattern editor/i
	} ) ).not.toBeInTheDocument();

	await act( async () => {
		user.click(
			await screen.findByRole( 'button', { name: /create a new theme/i } )
		);
		user.click(
			await screen.findByRole( 'button', { name: /save theme settings/i } )
		);
	} );

	expect( 
		await screen.findByText( themeSavedMessage )
	).toBeInTheDocument();
} );

{
	"name": "@tanstack-query-firebase/react",
	"version": "1.0.6",
	"description": "TanStack Query bindings for Firebase and React",
	"type": "module",
	"scripts": {
		"build": "tsup",
		"prepublishOnly": "pnpm build"
	},
	"exports": {
		".": {
			"import": "./dist/index.js",
			"types": "./dist/index.d.ts"
		},
		"./auth": {
			"import": "./dist/auth/index.js",
			"types": "./dist/auth/index.d.ts"
		},
		"./firestore": {
			"import": "./dist/firestore/index.js",
			"types": "./dist/firestore/index.d.ts"
		},
		"./data-connect": {
			"import": "./dist/data-connect/index.js",
			"types": "./dist/data-connect/index.d.ts"
		}
	},
	"author": {
		"name": "Invertase",
		"email": "oss@invertase.io",
		"url": "https://github.com/invertase/tanstack-query-firebase"
	},
	"files": [
		"dist",
		"README.md"
	],
	"license": "Apache-2.0",
	"devDependencies": {
		"@testing-library/react": "^16.0.1",
		"react": "^19.0.0",
		"@types/react": "^19.0.1",
		"@dataconnect/default-connector": "workspace:*"
	},
	"peerDependencies": {
		"firebase": "^11.3.0",
		"@tanstack/react-query": "^5"
	}
}

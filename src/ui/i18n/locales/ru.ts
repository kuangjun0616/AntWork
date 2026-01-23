/**
 *   перевод
 */

export default {
	// Language names
	languageNames: {
		en: "English",
		"zh-TW": "",
		zh: "",
		ja: "",
		ko: "",
		es: "",
		fr: "",
		de: "",
		ru: "",
		pt: "",
	},

	// Sidebar
	sidebar: {
		newTask: "+   ",
		settings: "",
		noSessions: "   . \"+   \"  .",
		deleteSession: "  ",
		resumeInClaudeCode: "  Claude Code",
		resume: "",
		close: "",
		copyResumeCommand: "   ",
		workingDirUnavailable: "   ",
	},

	// Settings Page
	settingsPage: {
		title: "",
		back: "",
		sections: {
			general: "",
			api: " API",
			features: "",
			system: "",
		},
		navigation: {
			help: "",
			feedback: " ",
			about: " ",
			language: "",
			api: " API",
			mcp: " MCP",
			skills: "",
			plugins: "",
			memory: "",
			agents: "",
			hooks: "",
			permissions: "",
			output: " ",
			recovery: " ",
			rules: "",
			claudeMd: "Claude.md",
		},
		placeholder: {
			title: "",
			description: "     ",
		},
	},

	// Settings Sections
	help: {
		title: "",
		subtitle: "   ",
		quickStart: {
			title: " ",
			description: " ,    AICowork    ",
		},
		faq: {
			title: " ",
			description: "   ",
		},
		docs: {
			title: "",
			description: "     ",
		},
		tip: ":        ,     .",
		helpUrl: "https://ima.qq.com/note/share/_AwZPbuK9wucK5gWaVdjNQ?channel=4",
	},

	feedback: {
		title: " ",
		subtitle: "     ,   ",
		bugReport: {
			title: "  ",
			description: "     GitHub",
			link: " GitHub",
			url: "https://github.com/Pan519/AICowork",
		},
		featureRequest: {
			title: " ",
			description: "  ,   ",
			url: "https://docs.qq.com/form/page/DRm5uV1pSZFB3VHNv",
		},
		thankYou: "   !     .",
	},

	about: {
		title: " AICowork",
		subtitle: "   - AICowork!",
		version: {
			title: "",
			description: " 1.0.0",
		},
		techStack: {
			title: " ",
			description: "Electron + React + TypeScript + AI Agent SDK",
			electron: "• Electron -      ",
			react: "• React + TypeScript -  ",
			tailwind: "• Tailwind CSS -  ",
			claude: "• AI Agent SDK -  AI",
		},
		license: {
			title: "",
			description: "GNU Affero General Public License v3.0 (AGPL-3.0)",
		},
		tagline: "AICowork    AI   .",
	},

	language: {
		title: "",
		description: "   ",
		current: " ",
		switching: "...",
		hint: "     .       .",
		tip: {
			label: "",
			text: "     .       .",
		},
	},

	api: {
		title: " API",
		description: "  API Anthropic  ",
		viewList: "   ",
		addConfig: " ",
		configName: {
			label: " ",
			placeholder: " ",
			test: " ",
		},
		baseUrl: {
			label: " URL",
			placeholder: "https://api.anthropic.com",
		},
		apiKey: {
			label: " API",
			placeholder: "sk-ant-...",
		},
		apiType: {
			label: " API",
			anthropic: "Anthropic",
			openai: " OpenAI",
		},
		model: {
			label: " ",
			placeholder: "  ",
			refresh: "  ",
		},
		advanced: {
			label: " ()",
			maxTokens: {
				label: ". ",
				placeholder: " ",
			},
			temperature: {
				label: "",
				placeholder: " ",
			},
			topP: {
				label: "Top P",
				placeholder: " ",
			},
		},
		actions: {
			test: " ",
			testing: "...",
			save: " ",
			saving: "...",
			setActive: "  ",
			edit: " ",
			delete: " ",
		},
		responseTime: " : {{time}}",
		testFailed: "  ",
		noConfigs: "  ",
		hint: " API   .      .",
		hintLabel: ": ",
		docsLink: "",
		learnMore: ".",
		saveSuccess: " ",
		current: "",
		confirmDelete: " ,   ?",
		modelLimits: " : max_tokens  [{{min}}, {{max}}]",
		azure: {
			resourceName: " Azure",
			deploymentName: " Azure",
			resourceNameRequired: " Azure    ",
			deploymentNameRequired: " Azure    ",
			bothRequired: "Azure      ",
		},
	},

	mcp: {
		title: " MCP",
		description: " Model Context Protocol, SDK        ",
		noServers: "   MCP",
		addServer: "+  ",
		templates: {
			title: "  ",
		},
		form: {
			name: {
				label: " ",
				placeholder: "my-mcp-server",
			},
			displayName: {
				label: "  ()",
				placeholder: "  MCP",
			},
			type: {
				label: " ",
				stdio: "stdio (/)",
				sse: "SSE ( )",
				streamableHttp: "Streamable HTTP",
			},
			command: {
				label: "",
				placeholder: "npx",
			},
			args: {
				label: " ( )",
				placeholder: "@modelcontextprotocol/server-github",
			},
			url: {
				label: "URL",
				placeholder: "https://example.com/mcp",
			},
			description: {
				label: "()",
				placeholder: " ",
			},
			addTitle: " MCP",
			editTitle: " MCP",
		},
		view: {
			type: "",
			command: "",
			args: "",
			url: "URL",
			description: "",
		},
		actions: {
			save: "",
			saving: "...",
			edit: "",
			delete: "",
			cancel: "",
		},
		errors: {
			deleteFailed: "  ",
			nameRequired: "     ",
			saveFailed: "  ",
			invalidNameFormat: "     , ,   ",
			commandRequired: " stdio   ",
			urlRequired: "      URL",
			invalidUrl: "  URL",
			saveSuccess: " ",
		},
		confirmDelete: " ,  MCP \"{{name}}\"?",
		hint: ":  MCP    ~/.claude/settings.json. SDK     MCP      .",
		hintPath: "~/.claude/settings.json",
	},

	skills: {
		title: "",
		description: "  , AI     SKILL.md",
		loading: "...",
		noSkills: "  ",
		noSkillsHint: "   ~/.claude/skills/   ",
		openDirectory: "  ",
		source: {
			skill: "",
			plugin: "",
		},
		hint: "    ~/.claude/skills/.     SKILL.md, AI     .",
	},

	plugins: {
		title: "",
		description: "  ",
		noPlugins: "  ",
		status: {
			installed: "",
		},
		hint: " : /plugin-name:command-name.",
	},

	memory: {
		title: "",
		description: " ,    AI  ",
		underDevelopment: " Memory  ...",
		reservedArea: "   memvid",
		comingSoon: " ",
		comingSoonDescription: "Memory     AI     .",
	},

	agents: {
		title: "",
		description: "  AI    ",
		underDevelopment: " Agents  ...",
		subAgents: "SubAgents",
		subAgentsDescription: "     10     (N ).",
	},

	hooks: {
		title: "",
		description: " ,      ",
		postToolUse: {
			title: "PostToolUse",
			description: "  ",
			noConfig: " ",
		},
		preToolUse: {
			title: "PreToolUse",
			description: "  ",
			noConfig: " ",
		},
		addHook: "+  ",
		hint: ":    ",
		hintPath: "~/.claude/settings.json",
		hintSuffix: ". SDK     .",
	},

	permissions: {
		title: "",
		allowedTools: {
			title: " ",
			description: "     ",
			noConfig: " ",
		},
		customRules: {
			title: " ",
			description: "   ",
			noConfig: "  ",
		},
		securityHint: " :    ,   Bash  .",
	},

	output: {
		title: " ",
		subtitle: "   AI  ",
		description: "   ...",
		comingSoon: " :  ,  ,  Markdown  ..",
	},

	recovery: {
		title: " ",
		subtitle: "   ",
		description: "    ",
		loading: "...",
		refresh: " ",
		example1: {
			title: "   Web-",
			sessionId: " : abc123def456",
			updated: ": 2  ",
		},
		example2: {
			title: "  API",
			sessionId: " : ghi789jkl012",
			updated: ": 1  ",
		},
		recover: "",
		hint: "      .      .",
		hintWithCommand: "   :",
	},

	rules: {
		title: "",
		subtitle: "   (.claude/rules/)",
		description: "     .claude/rules/   ",
		noRules: "  ",
		createFromTemplate: "  ",
		createNew: "  ",
		editor: {
			nameLabel: " ",
			namePlaceholder: ": coding-style",
			contentLabel: " (Markdown)",
			contentPlaceholder: "  ...",
			save: " ",
			saving: "...",
			cancel: "",
		},
		templates: {
			title: " ",
			language: {
				name: " ",
				description: "   ",
			},
			codingStyle: {
				name: " ",
				description: "    ",
			},
			gitCommit: {
				name: "Git Commit",
				description: "   Git commit",
			},
		},
		confirmDelete: " ,  \"{{name}}\"?",
		deleted: " ",
		saved: " ",
		hint: "    .claude/rules/  .     Markdown, AI    .",
	},

	claudeMd: {
		title: "Claude.md",
		subtitle: "   Claude (CLAUDE.md)",
		description: "   AI   CLAUDE.md    ",
		status: {
			exists: "  ",
			missing: "   ",
			charCount: "{{count}} ",
			lastModified: " : {{date}}",
		},
		actions: {
			view: "  ",
			edit: " ",
			save: " ",
			saving: "...",
			delete: " ",
			createFromTemplate: "  ",
			openDirectory: " ",
		},
		templates: {
			title: " ",
			basic: {
				name: " ",
				description: "     ",
			},
			frontend: {
				name: " Frontend",
				description: "   Frontend  React/Vue/Next.js",
			},
			backend: {
				name: " Backend",
				description: "   Backend  Node.js/Python/FastAPI",
			},
		},
		editor: {
			label: " Claude.md",
			placeholder: "    ...",
			save: " ",
			cancel: "",
		},
		confirmDelete: " ,   CLAUDE.md?",
		deleted: " ",
		saved: " ",
		hint: " CLAUDE.md       AI.    .",
	},

	// Settings Modal (legacy)
	settings: {
		title: " API",
		description: "  Anthropic,    API,   Anthropic.",
		baseUrl: " URL",
		apiKey: " API",
		modelName: " ",
		cancel: "",
		save: "",
		saving: "...",
		saved: "  !",
	},

	// Validation errors
	errors: {
		apiKeyRequired: " API  ",
		baseUrlRequired: " URL  ",
		modelRequired: "   ",
		invalidBaseUrl: "  URL",
		failedToLoadConfig: "   ",
		failedToSaveConfig: "   ",
		sessionStillRunning: "  . ,   .",
		workingDirectoryRequired: "     .",
		failedToGetSessionTitle: "    .",
	},

	// Start Session Modal
	startSession: {
		title: " ",
		description: "   ,    .",
		workingDirectory: " ",
		browse: "...",
		recent: "",
		prompt: "",
		promptPlaceholder: " ,   ...",
		startButton: " ",
		starting: "...",
	},

	// Prompt Input
	promptInput: {
		placeholderDisabled: " / ,  ...",
		placeholder: ",   ...",
		stopSession: " ",
		sendPrompt: " ",
	},

	// Common
	common: {
		close: "",
		cancel: "",
		save: "",
		delete: "",
		loading: "...",
		edit: "",
		add: "",
		refresh: "",
		back: "",
	},

	// App
	app: {
		noMessagesYet: "  ",
		startConversation: "   AICowork",
		beginningOfConversation: " ",
		loadingMessages: "...",
		newMessages: " ",
	},

	// Deletion Confirmation
	deletion: {
		title: "  ",
		subtitle: "AI   ",
		description: "AI   .          .    .",
		commandLabel: " :",
		unknownCommand: " ",
		warning: ":    . ,    .",
		allow: " ",
		deny: " ",
		deniedMessage: "   ",
	},

	// Event Card
	events: {
		sessionResult: " ",
		duration: "",
		usage: "",
		cost: "",
		input: "",
		output: "",
		collapse: "",
		showMoreLines: "  {{count}} ",
		systemInit: " ",
		user: "",
		assistant: "",
		thinking: "",
		sessionId: " ",
		modelName: " ",
		permissionMode: " ",
		workingDirectory: " ",
	},
};

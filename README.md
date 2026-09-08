# DevCrew AI - Multi-Agent Software Planning

Transform your software ideas into comprehensive development blueprints with our intelligent multi-agent planning system.

## Overview

DevCrew AI is a Next.js web application that uses six specialized AI agents to analyze software ideas and generate structured development plans. The system provides expert guidance on:

- **Product Management** - User stories and feature planning
- **Requirements Analysis** - Functional and non-functional requirements  
- **Software Architecture** - Technology stack and system design
- **Database Design** - Schema and data modeling
- **Testing Strategy** - Test plans and quality assurance
- **Deployment Planning** - Infrastructure and deployment strategies

## Features

- ✨ **Multi-Agent Analysis** - Six specialized AI agents working in sequence
- 🔄 **Real-Time Status** - Live progress monitoring during analysis
- 📋 **Comprehensive Blueprints** - Complete development plans with structured sections
- 💾 **Local Storage** - Save and revisit previous projects (browser-based)
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ♿ **Accessibility** - WCAG compliant with keyboard navigation support
- 📄 **Export Function** - Download blueprints as Markdown files

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI Integration**: Google Gemini API
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Deployment**: Vercel (optimized)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm 9.0.0 or later
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devcrew-ai/devcrew-ai.git
   cd devcrew-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Add your Gemini API key to .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
NEXT_PUBLIC_APP_NAME="DevCrew AI"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run format` - Format code with Prettier

## Project Structure

```
devcrew-ai/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with design tokens
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page component
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utility functions and services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── public/               # Static assets
├── .env.example         # Environment variables template
├── next.config.ts       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Architecture

### Multi-Agent System

The application uses a sequential agent orchestration system:

1. **Product Manager Agent** - Analyzes software idea and defines product vision
2. **Requirements Analyst Agent** - Generates functional and non-functional requirements
3. **Software Architect Agent** - Recommends technology stack and system architecture
4. **Database Designer Agent** - Creates database schema and design decisions
5. **Testing Engineer Agent** - Develops testing strategy and test plans
6. **Deployment Planner Agent** - Plans infrastructure and deployment approach

### Data Flow

```
User Input → Agent Orchestration → Blueprint Generation → Local Storage
     ↓              ↓                      ↓                ↓
Software Idea → Sequential Processing → Structured Output → Browser Storage
```

## API Integration

The application integrates with Google's Gemini API for AI agent processing:

- **Server-side only** - API keys never exposed to client
- **Error handling** - Comprehensive retry logic and error recovery
- **Rate limiting** - Built-in request throttling
- **Validation** - Zod schema validation for all responses

## Deployment

### Vercel (Recommended)

The application is optimized for Vercel deployment:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed on any platform that supports Next.js:

- **Docker**: Containerized deployment ready
- **AWS/GCP/Azure**: Compatible with cloud platforms
- **Self-hosted**: Can run on any Node.js server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 **Email**: support@devcrew-ai.com
- 💬 **Discord**: [DevCrew AI Community](https://discord.gg/devcrew-ai)
- 📖 **Documentation**: [docs.devcrew-ai.com](https://docs.devcrew-ai.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/devcrew-ai/devcrew-ai/issues)

---

Built with ❤️ by the DevCrew AI team
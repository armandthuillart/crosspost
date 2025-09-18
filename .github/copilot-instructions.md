# Project Instructions

Concise, project-specific guidance for AI coding agents working in this repo. Focus on these patterns and conventions; avoid introducing alternative architectures unless explicitly requested.

## 1. High-level Architecture
- Stack: Next.js 15 (app router, Turbopack) + Convex backend (realtime DB + functions) + Better Auth (via @convex-dev/better-auth) + Polar monetization + @convex-dev/agent (AI chat orchestration & vector search) + Rate limiter.
- Domain focus: Chat-driven workflow to help users draft cross-platform social media content (drafts -> versions -> post intents) plus an AI conversation interface.
- Convex acts as both: (1) persistence for drafts/posts/threads; (2) execution layer for chat streaming, auth lookups, rate limiting, tool calls.
- AI agent composition defined in `convex/agents.ts` (context window, search config, tools) and invoked through mutations/actions in `convex/chat.ts`.

## 2. Data Model (convex/schema.ts)
Tables:
- drafts { title, userId } indexed by user (`by_user`).
- versions { content, draftId, platform, updatedAt? } indexed by (draftId, platform) (`by_draft_platform`).
- posts { content, platform, title } (no explicit index yet).
Union validator `platform` centralizes allowed platforms: `linkedin | bluesky | threads | x`.
Add new platform: extend `platform` union, update `lib/schema.ts` Zod refinements, `createPostIntent` baseUrls, and any length constraints.

## 3. Auth & User Tiering
- Auth client & schema integration in `convex/auth.ts` using `betterAuth` + Convex adapter. User tiers: `anonymous | free | pro` (see `lib/types.ts`). Tier assigned on user creation; Polar webhook (stubbed log) should update tier later.
- Frontend obtains session token via custom proxy routes in `app/api/auth/proxy/*` to manage anonymous sign-in, OAuth flows, and sign-out while preserving cookies & minting `convex_jwt`.
- Always fetch the current user inside Convex functions via `ctx.runQuery(api.auth.getUser, {})` (pattern used in `drafts.createDraft`, `chat.*`). Avoid trusting client-sent user IDs.

## 4. Chat / AI Flow
- New chat thread: `chat.createChat` mutation calls `createThread` (from @convex-dev/agent) and stores user ownership in thread metadata.
- Sending a message: `chat.sendMessage` mutation -> verifies ownership & rate limits -> saves message (skip embeddings in mutation) -> schedules streaming via internal action `chat.streamChat`.
- Streaming: `chat.streamChat` internalAction invokes `chatAgent.streamText` with `saveStreamDeltas` (word chunking + throttle). Errors captured in onError callback only.
- Title generation: `chat.renameChat` internalAction uses lightweight TITLE_MODEL + prompt to patch thread metadata.
- Loading chat: `chat.loadChat` query first syncs active streams (`syncStreams`), then paginates UI messages (`listUIMessages`). Callers (see `components/chat.tsx`) use `useUIMessages` with streaming enabled.
- Ownership & security: Central helper `verifyOwnership` ensures the active user matches stored thread metadata before permitting abort/stream operations.

## 5. Agent Definition & Tools
- Defined in `convex/agents.ts`: `Agent(components.agent, { instructions: CHAT_SYSTEM_PROMPT, languageModel: CHAT_MODEL, textEmbeddingModel, contextOptions, tools, stopWhen })`.
- Tools: Declared in `convex/tools.ts` via `createTool` and exposed to the agent under kebab-case keys. Examples:
  - `create-draft`: wraps `drafts.createDraft` mutation.
  - `create-post-intent`: creates an internal post record (scheduled) and returns a platform-specific share URL (with normalized content) while also scheduling actual post creation via internal mutation (`posts.createPost`).
- When adding tools: (1) create Zod schema in `lib/schema.ts` or reuse existing; (2) wrap with `createTool`; (3) register in `agents.ts` tools map; (4) ensure necessary DB mutations exist & perform ownership/user tier checks where appropriate.

## 6. Validation Strategy
- Convex arg validation: either direct `v.*` validators or Zod -> Convex via `zodToConvex` (see `drafts.createDraft`, `posts.createPost`).
- Shared domain schemas live in `lib/schema.ts` (Zod) and are mirrored into Convex validators when used server-side.
- Platform-specific content length constraints enforced via schema refinements (central source of truth—do not re-implement ad hoc checks in UI or tools).

## 7. Rate Limiting
- Rate limiter configured in `convex/rateLimiting.ts` with tier-based capacities (fixed window). Use `rateLimiter.limit(ctx, userTier, { key: userId, throws: true })` before performing costly or user-visible operations (see `chat.sendMessage`). New throttled features should match this pattern.

## 8. Frontend Integration Patterns
- Server entry `app/(chat)/page.tsx`: enforces auth token presence (redirects to anonymous proxy if absent), preloads user query (`preloadQuery(api.auth.getUser)`), ensures a chat thread (create if missing, stored in cookie `chat`).
- Client chat UI (`components/chat.tsx`): uses `useUIMessages` for realtime paginated + streamed messages; sets cookies after first message; detects streaming via `status === "streaming"` part.
- Side effects (cookies, scheduling) are centralized in server actions or Convex functions—not in client components.

## 9. Environment & Config
- Env template: `.env.example`. Required for: Convex deployment URLs, Better Auth secret, Google OAuth, Polar product & webhook, AI Gateway key.
- Models centralized in `lib/gateway.ts`; prompts in `lib/prompts.ts` (don’t inline new system prompts—add constants).

## 10. Scripts & Tooling
- Development: `bun install` (lockfile is `bun.lock`), then `bun run dev` (Next.js + Convex dev server assumed separately via `npx convex dev` if needed—add this if missing in future scripts). Build via `bun run build` (Turbopack). Lint/format: `bun run check` (Biome), `bun run lint`, `bun run format`.
- Tailwind v4 (see `postcss.config.mjs`). Avoid adding legacy `tailwind.config.js` unless required; utility classes are leveraged extensively.

## 11. Conventions & Gotchas
- Always use Convex function wrappers (`query`, `mutation`, `internalAction`, etc.) with explicit validators and return shapes (follow existing style in `convex/chat.ts`).
- For streaming messages: NEVER attempt embeddings generation inside mutations; rely on lazy generation in streaming actions (pattern: `skipEmbeddings: true`).
- Use internal vs public: User-facing operations (create chat, send message) are public mutations; background/stream operations are `internalAction`.
- Thread/user ownership is ALWAYS enforced via `verifyOwnership` before mutating thread-specific state.
- Add new platform support by updating all: `convex/schema.ts` union, `lib/schema.ts` refinements, `createPostIntent` baseUrls, possibly UI conditionals.
- Do not trust client-provided IDs or tiers; recompute from `api.auth.getUser` inside Convex.

## 12. Extending Safely (Examples)
- Add a new tool: define Zod schema, wrap via `createTool`, register in `agents.ts`, call underlying mutation that applies auth & rate limiting. Test by sending natural language prompt that should trigger the tool.
- Add post analytics: create new table + index in `convex/schema.ts`; write query using `withIndex` (avoid `.filter`); expose via `api.analytics.*` query; consume in a server component with `preloadQuery`.

## 13. Security & Error Handling
- Throw domain-specific errors (e.g. `ChatSDKError`) for auth/ownership issues; client components can branch on message if needed.
- Avoid leaking system prompts—agent instructions purposely instruct the model not to reveal them; do not echo them in responses.

---
If any section is unclear or you need deeper coverage (e.g. deployment flow, adding tests, or Convex crons), ask and we can iterate.

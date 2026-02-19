# Eng-Hype Web Specification

## 1. System Architecture

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database/Storage**: Supabase
- **Hosting**: Vercel

## 2. TTS (Text-to-Speech) System

Optimized for cost efficiency and low latency using a **3-Layer Caching Strategy**.

### Layer 1: Browser Cache (Client-side)

- **Mechanism**: Web Cache API (`caches.open('tts-cache')`)
- **Key**: `/api/tts?text=${encodeURIComponent(text)}`
- **Behavior**: Checks local cache first.
  - **Hit**: Plays instantly (0ms latency, $0 cost). Persists across page reloads.
  - **Miss**: Requests from Server API.

### Layer 2: Supabase Storage (Shared Server-side)

- **Storage Bucket**: `tts-cache` (**Private**)
- **Key**: `MD5(text).mp3` (Content Hash)
- **Role**: Shared cache among all users. Audio generated for User A is reused for User B.
- **Security**: The bucket is **Private**. The API Route (`/api/tts`) accesses it using the **Service Role Key** (Admin) and streams content to the client. No public URL is exposed.

### Layer 3: OpenAI API (Generation)

- **Provider**: OpenAI `tts-1` model
- **Voice**: `nova`
- **Trigger**: Called only if both Browser and Supabase caches miss.
- **Post-Generation**: Audio is saved to Supabase Storage and returned to the client.

### Cache Maintenance (Cleanup)

- **Script**: `scripts/clear-tts-cache.mjs`
- **Trigger**: Executed automatically during `npm run build` (Deployment).
- **Policy**:
  - **Deletes**: Files created _before today_ (JST).
  - **Keeps**: Files created _today_ (JST). This allows testing new content without immediate deletion on deploy.

## 3. Database & Security

### Authentication Strategy

- **Current State**: **No User Login** (Guest Mode).
- **Shared UID**: All users share a single User ID (`eng-hype-shared-user`) for storing progress data.

### Row Level Security (RLS)

- **Table**: `sentence_ranks`
- **Policy**: `"Allow shared user access"`
  - `USING (user_id = 'eng-hype-shared-user')`
  - `WITH CHECK (user_id = 'eng-hype-shared-user')`
- **Purpose**: Restricts database write access to the specific shared UID, preventing arbitrary data insertion by attackers using random IDs.

## 4. Content Management

### Markdown Structure (`/script/*.md`)

- **Levels**:
  - `## Chapter Title`: Starts a new Chapter.
  - `### Scene Title`: Starts a new Scene within a Chapter.
- **Images**: `![Alt Text](/path/to/image.png)`

### Suno AI Music Embedding

- **Syntax**: `[Title](https://suno.com/song/UUID)`
- **Placement**: Inside Chapter content (before Scenes).
- **Processing**: The system parses the URL, extracts the UUID, and renders the `<SunoPlayer>` component.

## 5. Development & Deployment

### Environment Variables (`.env.local`)

| Variable                        | Purpose                                      |
| ------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase API Endpoint                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Key for Client-side RLS               |
| `SUPABASE_SERVICE_ROLE_KEY`     | **Secret** Admin Key for Server-side Storage |
| `OPENAI_API_KEY`                | **Secret** Key for TTS Generation            |
| `NEXT_PUBLIC_SHARED_UID`        | `eng-hype-shared-user`                       |

### Build Command

```bash
npm run build
# Runs: node scripts/clear-tts-cache.mjs && next build
```

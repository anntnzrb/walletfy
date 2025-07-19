# Chat Assistant Component

## Overview

The Chat Assistant is an intelligent financial assistant integrated into Walletfy that allows users to interact with their financial data using natural language. It uses the Chutes API with the DeepSeek-V3.1 model to provide contextualized financial insights and recommendations.

## Features

- **Natural Language Interface**: Users can ask questions about their finances in plain Spanish
- **Contextual Awareness**: The assistant has access to all user financial data including:
  - Events (income/expense transactions)
  - Initial balance
  - Monthly balance flow
  - Recent transactions
- **Streaming Responses**: Real-time response generation with typing indicators
- **Financial Insights**: Provides analysis, summaries, and recommendations
- **Dark/Light Mode Support**: Adapts to the application's theme

## Implementation Details

### Component Structure

The Chat Assistant consists of two main components:

1. **ChatAssistant.tsx**: Main component handling state, API communication, and UI
2. **ChatMessage.tsx**: Individual message component for rendering chat bubbles

### Data Flow

1. User opens the chat by clicking the floating button
2. Component retrieves financial data from Redux store:
   - Events (transactions)
   - Initial balance
   - Theme preference
3. User submits a query
4. Financial context is formatted as JSON with the LATEST data from Redux store and sent to the Chutes API
5. Streaming response is processed and displayed in real-time
6. Conversation history is maintained during the session

### Real-time Data Updates

The chat assistant automatically retrieves the most current financial data from the Redux store for each API request. This ensures that newly created events (income/expense transactions) are immediately available to the AI assistant, even if they were created while the chat session was active.

### Persistent Chat History

Chat conversations are automatically saved to localStorage and will persist across page reloads and browser sessions. When you close the chat or refresh the page, your conversation history will still be available when you reopen the chat. Clearing the chat will remove both the current session messages and the saved history.

### API Integration

The component uses the Chutes API endpoint:

```
POST https://llm.chutes.ai/v1/chat/completions
```

With the DeepSeek-V3.1 model and streaming enabled:

```json
{
  "model": "deepseek-ai/DeepSeek-V3.1",
  "messages": [...],
  "stream": true,
  "max_tokens": 1024,
  "temperature": 0.7
}
```

### Authentication

The component requires a Chutes API token set as an environment variable:

```
VITE_CHUTES_API_TOKEN=your_api_token_here
```

## Usage

### Adding to Application

The Chat Assistant is automatically integrated into the root layout at `src/routes/__root.tsx`:

```tsx
import { ChatAssistant } from "@/components/ChatAssistant/ChatAssistant";

function RootComponent() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <ChatAssistant />
    </>
  );
}
```

### Environment Setup

Create a `.env` file in the project root with your Chutes API token:

```
VITE_CHUTES_API_TOKEN=your_actual_api_token_here
```

You can optionally specify which model to use:

```
VITE_CHUTES_MODEL=deepseek-ai/DeepSeek-V3.1
```

### Model Configuration

You can optionally specify which model to use by setting the `VITE_CHUTES_MODEL` environment variable:

```
VITE_CHUTES_MODEL=deepseek-ai/DeepSeek-V3.1
```

If not specified, the default model `deepseek-ai/DeepSeek-V3.1` will be used.

## Customization

### Styling

The component uses Walletfy's design system CSS variables for consistent styling:

- Color palette based on Solarized theme
- Responsive design with fixed positioning
- Theme-aware components (light/dark mode)

### Modifying Context

To modify the financial context sent to the LLM, update the `getFinancialContext()` function in `ChatAssistant.tsx`.

### Adjusting Model Parameters

Model parameters can be adjusted in the API request:

- `temperature`: Controls randomness (0.0-1.0)
- `max_tokens`: Maximum response length
- `model`: LLM model identifier

## Error Handling

The component includes comprehensive error handling:

- Network error detection
- API error responses
- Streaming interruption recovery
- User-friendly error messages
- Loading states with spinners

## Security

- API token is stored as environment variable
- No sensitive financial data is sent to external services beyond what's necessary for context
- All communication happens over HTTPS
- Financial data is processed client-side before sending to API

## Dependencies

- React with TypeScript
- Mantine UI components
- Tabler Icons
- Redux for state management
- Walletfy's utility functions

<script lang="ts">
    export let message: { role: string; content: string; timestamp: Date };
  
    const isUserMessage = message.role === 'user';
  </script>
  
  <div class="chat-message {isUserMessage ? 'user' : 'assistant'}">
    <div class="message-content">
      <p>{message.content}</p>
      <span class="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
    </div>
  </div>
  
  <style lang="postcss">
    .chat-message {
      @apply p-2 rounded-lg;
    }
  
    .user {
      @apply bg-blue-100 self-end;
    }
  
    .assistant {
      @apply bg-gray-100 self-start;
    }
  
    .message-content {
      @apply flex flex-col;
    }
  
    .timestamp {
      @apply text-xs text-gray-500;
    }
  </style>
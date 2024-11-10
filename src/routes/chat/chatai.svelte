<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import MarkdownRenderer from '../shared/MarkdownRenderer.svelte';
  
    export let domainPath: string;
    export let currentTopic: string | null;
  
    let query = '';
    let isProcessing = false;
    let conversation: Array<{
      role: 'user' | 'assistant';
      content: string;
      resources?: Array<{
        type: string;
        title: string;
        url: string;
      }>;
    }> = [];
  
    let suggestions = [
      "Can you explain this concept?",
      "What are the prerequisites?",
      "Show me an example",
      "How is this applied?",
      "Common mistakes to avoid"
    ];
  
    async function handleSubmit() {
      if (!query.trim() || isProcessing) return;
  
      isProcessing = true;
      conversation = [...conversation, { role: 'user', content: query }];
      query = '';
  
      try {
        const response = await stemCore.getAIResponse({
          domainPath,
          topic: currentTopic,
          query: query,
          context: conversation
        });
  
        conversation = [...conversation, {
          role: 'assistant',
          content: response.content,
          resources: response.resources
        }];
      } catch (error) {
        console.error('AI response error:', error);
      } finally {
        isProcessing = false;
      }
    }
  
    function useSuggestion(suggestion: string) {
      query = suggestion;
      handleSubmit();
    }
  </script>
  
  <div class="ai-helper">
    <header class="helper-header">
      <h3>AI Learning Assistant</h3>
      <p class="context">
        Helping with: {currentTopic || domainPath}
      </p>
    </header>
  
    <div class="conversation">
      {#if conversation.length === 0}
        <div class="suggestions" transition:fade>
          <p>Quick questions to get started:</p>
          <div class="suggestion-grid">
            {#each suggestions as suggestion}
              <button 
                class="suggestion"
                on:click={() => useSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            {/each}
          </div>
        </div>
      {:else}
        {#each conversation as message}
          <div 
            class="message {message.role}"
            transition:fade
          >
            <MarkdownRenderer content={message.content} />
            
            {#if message.resources}
              <div class="resources">
                <h4>Related Resources:</h4>
                <ul>
                  {#each message.resources as resource}
                    <li>
                      <a 
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.title}
                      </a>
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  
    <footer class="helper-footer">
      <div class="input-row">
        <input
          type="text"
          bind:value={query}
          placeholder="Ask anything about this topic..."
          on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button 
          class="submit-button"
          disabled={!query.trim() || isProcessing}
          on:click={handleSubmit}
        >
          {#if isProcessing}
            <span class="loading"></span>
          {:else}
            Ask
          {/if}
        </button>
      </div>
    </footer>
  </div>
  
  <style lang="postcss">
    .ai-helper {
      @apply h-full flex flex-col bg-base-100;
    }
  
    .helper-header {
      @apply p-4 border-b border-base-300;
  
      h3 {
        @apply text-lg font-semibold;
      }
  
      .context {
        @apply text-sm text-base-content/60;
      }
    }
  
    .conversation {
      @apply flex-1 overflow-y-auto p-4 space-y-4;
    }
  
    .suggestions {
      @apply text-center p-4;
  
      .suggestion-grid {
        @apply grid grid-cols-2 gap-2 mt-4;
      }
  
      .suggestion {
        @apply p-3 rounded-lg text-sm text-left
               bg-base-200 hover:bg-base-300
               transition-colors;
      }
    }
  
    .message {
      @apply p-4 rounded-lg;
  
      &.user {
        @apply bg-primary/10 ml-12;
      }
  
      &.assistant {
        @apply bg-base-200 mr-12;
      }
  
      .resources {
        @apply mt-4 pt-4 border-t border-base-300;
  
        h4 {
          @apply font-medium mb-2;
        }
  
        ul {
          @apply space-y-1;
        }
  
        a {
          @apply text-primary hover:underline;
        }
      }
    }
  
    .helper-footer {
      @apply p-4 border-t border-base-300;
    }
  
    .input-row {
      @apply flex items-center gap-2;
  
      input {
        @apply flex-1 px-4 py-2 rounded-lg
               bg-base-200 focus:outline-none
               focus:ring-2 focus:ring-primary;
      }
  
      .submit-button {
        @apply px-4 py-2 rounded-lg
               bg-primary text-primary-content
               hover:bg-primary-focus
               disabled:opacity-50
               disabled:cursor-not-allowed;
  
        .loading {
          @apply block w-4 h-4 border-2
                 border-primary-content
                 border-t-transparent
                 rounded-full animate-spin;
        }
      }
    }
  </style>
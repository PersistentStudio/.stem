<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import ChatInput from './ChatInput.svelte';
    import ChatMessage from './ChatMessage.svelte';
    import AIHelper from './AIHelper.svelte';
    import RelatedPosts from './RelatedPosts.svelte';
    import StemCore from '@/lib/stemcore';
  
    export let activeContext: any;
    
    const dispatch = createEventDispatcher();
    
    let messages: any[] = [];
    let relatedPosts: any[] = [];
    let isAITyping = false;
    let showRelatedPosts = false;
    let chatMode: 'ai' | 'community' = 'ai';
    
    onMount(async () => {
      if (activeContext) {
        relatedPosts = await StemCore.getRelatedPosts(activeContext);
      }
    });
  
    async function handleMessage(event: CustomEvent) {
      const userMessage = event.detail;
      
      // Add user message to chat
      messages = [...messages, {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }];
  
      // Check for related posts
      const related = await StemCore.searchRelatedPosts(userMessage);
      if (related.length > 0) {
        showRelatedPosts = true;
        relatedPosts = related;
      }
  
      // Get AI response
      isAITyping = true;
      try {
        const aiResponse = await StemCore.getAIResponse({
          context: activeContext,
          message: userMessage,
          chatHistory: messages
        });
  
        messages = [...messages, {
          role: 'assistant',
          content: aiResponse.content,
          resources: aiResponse.resources,
          timestamp: new Date()
        }];
      } finally {
        isAITyping = false;
      }
    }
  
    function handleNewPost() {
      dispatch('newPost', {
        context: activeContext,
        initialContent: messages[messages.length - 1]?.content
      });
    }
  </script>
  
  <div class="domain-chat">
    <!-- Chat Header -->
    <header class="chat-header">
      <div class="mode-selector">
        <button
          class:active={chatMode === 'ai'}
          on:click={() => chatMode = 'ai'}
        >
          AI Assistant
        </button>
        <button
          class:active={chatMode === 'community'}
          on:click={() => chatMode = 'community'}
        >
          Community
        </button>
      </div>
  
      {#if showRelatedPosts}
        <button 
          class="related-toggle"
          on:click={() => showRelatedPosts = !showRelatedPosts}
        >
          Show Related Posts
        </button>
      {/if}
    </header>
  
    <!-- Chat Content -->
    <div class="chat-content" class:with-sidebar={showRelatedPosts}>
      <!-- Main Chat -->
      <div class="messages-container">
        <div class="messages">
          {#each messages as message (message.timestamp)}
            <div class="chat-message"  transition:fade>
              <ChatMessage {message} />
            </div>
          {/each}
          
          {#if isAITyping}
            <div class="typing-indicator" transition:fade>
              AI is typing...
            </div>
          {/if}
        </div>
  
        <ChatInput
          on:send={handleMessage}
          disabled={isAITyping}
          context={activeContext}
        />
      </div>
  
      <!-- Related Posts Sidebar -->
      {#if showRelatedPosts}
        <div class="related-sidebar" transition:slide>
          <RelatedPosts
            posts={relatedPosts}
            on:createNew={handleNewPost}
          />
        </div>
      {/if}
    </div>
  </div>
  
  <style lang="postcss">
    .domain-chat {
      @apply flex flex-col h-full;
    }
  
    .chat-header {
      @apply flex items-center justify-between
             p-4 border-b border-base-300;
    }
  
    .mode-selector {
      @apply flex gap-2 p-1 bg-base-200 rounded-full;
  
      &.button {
        @apply px-4 py-1.5 rounded-full
               transition-colors;
  
        &.active {
          @apply bg-primary text-primary-content;
        }
      }
    }
  
    .related-toggle {
      @apply text-sm text-primary;
    }

    .related-toggle:hover {
      @apply underline;
    }
  
    .chat-content {
      @apply flex-1 flex overflow-hidden;
  
      &.with-sidebar {
        @apply grid;
        grid-template-columns: 1fr 20rem;
      }
    }
  
    .messages-container {
      @apply flex flex-col h-full;
    }
  
    .messages {
      @apply flex-1 overflow-y-auto p-4 space-y-4;
    }
  
    .typing-indicator {
      @apply p-3 rounded-lg bg-base-200
             text-sm text-base-content/60;
    }
  
    .related-sidebar {
      @apply border-l border-base-300
             overflow-y-auto;
    }
  </style>
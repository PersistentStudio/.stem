<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import ChatMessage from './ChatMessage.svelte';
    import ChatInput from './ChatInput.svelte';
  
    export let threadId: string;
    
    const dispatch = createEventDispatcher();
    let thread: any = null;
    let replies: any[] = [];
    let isLoading = true;
  
    onMount(async () => {
      await loadThread();
    });
  
    async function loadThread() {
      isLoading = true;
      try {
        const response = await stemCore.getThread(threadId);
        thread = response.thread;
        replies = response.replies;
      } catch (error) {
        console.error('Error loading thread:', error);
      } finally {
        isLoading = false;
      }
    }
  
    async function handleReply(event: CustomEvent) {
      const reply = await stemCore.createReply(threadId, event.detail);
      replies = [...replies, reply];
    }
  </script>
  
  <div class="thread-view" transition:slide>
    <header class="thread-header">
      <h3>Thread</h3>
      <button 
        class="close-button"
        on:click={() => dispatch('close')}
      >
        ✕
      </button>
    </header>
  
    <div class="thread-content">
      {#if isLoading}
        <div class="loading">Loading thread...</div>
      {:else}
        <!-- Original Message -->
        <div class="original-message">
          <ChatMessage message={thread} />
        </div>
  
        <!-- Replies -->
        <div class="replies">
          {#each replies as reply (reply.id)}
            <ChatMessage 
              message={reply}
              on:reaction
            />
          {/each}
        </div>
      {/if}
    </div>
  
    <footer class="thread-footer">
      <ChatInput 
        chatMode="general"
        placeholder="Reply to thread..."
        on:send={handleReply}
      />
    </footer>
  </div>
  
  <style lang="postcss">
    .thread-view {
      @apply h-full flex flex-col bg-base-100;
    }
  
    .thread-header {
      @apply flex items-center justify-between
             p-4 border-b border-base-300;
  
      h3 {
        @apply text-lg font-semibold;
      }
  
      .close-button {
        @apply p-2 rounded-lg
               hover:bg-base-200 transition-colors;
      }
    }
  
    .thread-content {
      @apply flex-1 overflow-y-auto p-4 space-y-4;
    }
  
    .original-message {
      @apply opacity-75;
    }
  
    .replies {
      @apply space-y-4 pl-8 border-l-2 border-base-300;
    }
  
    .thread-footer {
      @apply border-t border-base-300;
    }
  
    .loading {
      @apply flex items-center justify-center
             h-full text-base-content/60;
    }
  </style>
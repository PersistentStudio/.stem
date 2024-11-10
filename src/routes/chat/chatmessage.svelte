<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import MarkdownRenderer from '../shared/MarkdownRenderer.svelte';
    import CodeBlock from '../shared/CodeBlock.svelte';
    import MathFormula from '../shared/MathFormula.svelte';
  
    export let message: {
      id: string;
      content: string;
      author: {
        id: string;
        name: string;
        avatar: string;
        expertise: string;
      };
      timestamp: Date;
      reactions: Array<{
        emoji: string;
        count: number;
        users: string[];
      }>;
      attachments?: Array<{
        type: 'code' | 'image' | 'file' | 'math';
        content: string;
        language?: string;
      }>;
      threadCount?: number;
      isAnswer?: boolean;
      references?: string[];
    };
  
    const dispatch = createEventDispatcher();
    let showReactionPicker = false;
    let isExpanded = false;
  
    const reactions = ['👍', '❤️', '🎯', '🤔', '⭐', '🙏'];
  
    function handleReaction(emoji: string) {
      dispatch('reaction', { messageId: message.id, emoji });
      showReactionPicker = false;
    }
  </script>
  
  <div 
    class="message"
    class:answer={message.isAnswer}
    transition:fade
  >
    <div class="message-header">
      <img 
        src={message.author.avatar} 
        alt={message.author.name}
        class="avatar"
      />
      
      <div class="author-info">
        <div class="name-row">
          <span class="name">{message.author.name}</span>
          <span class="expertise">{message.author.expertise}</span>
          {#if message.isAnswer}
            <span class="answer-badge">✓ Verified Answer</span>
          {/if}
        </div>
        <span class="timestamp">
          {new Date(message.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  
    <div class="message-content" class:expanded={isExpanded}>
      <MarkdownRenderer content={message.content} />
      
      {#if message.attachments}
        <div class="attachments">
          {#each message.attachments as attachment}
            {#if attachment.type === 'code'}
              <CodeBlock 
                code={attachment.content}
                language={attachment.language}
              />
            {:else if attachment.type === 'math'}
              <MathFormula formula={attachment.content} />
            {:else if attachment.type === 'image'}
              <img 
                src={attachment.content}
                alt="Attachment"
                class="image-attachment"
              />
            {/if}
          {/each}
        </div>
      {/if}
  
      {#if message.references?.length}
        <div class="references">
          <h4>References:</h4>
          <ul>
            {#each message.references as ref}
              <li>{ref}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  
    <div class="message-actions">
      <div class="reactions">
        {#each message.reactions as reaction}
          <button 
            class="reaction"
            class:reacted={reaction.users.includes(currentUserId)}
            on:click={() => handleReaction(reaction.emoji)}
          >
            <span>{reaction.emoji}</span>
            <span class="count">{reaction.count}</span>
          </button>
        {/each}
        
        {#if showReactionPicker}
          <div class="reaction-picker" transition:slide>
            {#each reactions as emoji}
              <button 
                class="emoji"
                on:click={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            {/each}
          </div>
        {/if}
        
        <button 
          class="add-reaction"
          on:click={() => showReactionPicker = !showReactionPicker}
        >
          +
        </button>
      </div>
  
      <div class="actions">
        <button 
          class="thread"
          on:click={() => dispatch('threadSelect', message.id)}
        >
          💬 {message.threadCount || 'Reply'}
        </button>
        <button 
          class="share"
          on:click={() => dispatch('share', message.id)}
        >
          📤 Share
        </button>
        <button 
          class="bookmark"
          on:click={() => dispatch('bookmark', message.id)}
        >
          🔖 Save
        </button>
      </div>
    </div>
  </div>
  
  <style lang="postcss">
    .message {
      @apply bg-base-100 rounded-xl p-4
             border border-base-300
             hover:shadow-md transition-all;
  
      &.answer {
        @apply border-success bg-success/5;
      }
    }
  
    .message-header {
      @apply flex items-start gap-3 mb-3;
  
      .avatar {
        @apply w-10 h-10 rounded-full;
      }
  
      .author-info {
        @apply flex-1;
  
        .name-row {
          @apply flex items-center gap-2;
  
          .name {
            @apply font-medium;
          }
  
          .expertise {
            @apply text-sm px-2 py-0.5 rounded-full
                   bg-primary/10 text-primary;
          }
  
          .answer-badge {
            @apply text-sm px-2 py-0.5 rounded-full
                   bg-success/10 text-success;
          }
        }
  
        .timestamp {
          @apply text-sm text-base-content/60;
        }
      }
    }
  
    .message-content {
      @apply prose prose-sm max-w-none
             overflow-hidden transition-all;
  
      &:not(.expanded) {
        @apply max-h-96;
      }
    }
  
    .attachments {
      @apply mt-4 space-y-4;
  
      .image-attachment {
        @apply max-w-full rounded-lg;
      }
    }
  
    .references {
      @apply mt-4 text-sm text-base-content/80;
  
      ul {
        @apply list-disc list-inside;
      }
    }
  
    .message-actions {
      @apply flex items-center justify-between
             mt-4 pt-4 border-t border-base-300;
    }
  
    .reactions {
      @apply flex items-center gap-2 relative;
  
      .reaction {
        @apply flex items-center gap-1 px-2 py-1
               rounded-full bg-base-200
               hover:bg-base-300 transition-colors;
  
        &.reacted {
          @apply bg-primary/10 text-primary;
        }
  
        .count {
          @apply text-sm;
        }
      }
  
      .reaction-picker {
        @apply absolute top-full left-0 mt-2
               flex items-center gap-2 p-2
               bg-base-100 rounded-lg shadow-lg
               border border-base-300;
  
        .emoji {
          @apply p-2 rounded-lg hover:bg-base-200
                 transition-colors;
        }
      }
    }
  
    .actions {
      @apply flex items-center gap-3;
  
      button {
        @apply text-sm text-base-content/60
               hover:text-base-content transition-colors;
      }
    }
  </style>
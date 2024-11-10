<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    
    interface Thread {
        author: {
            avatar_url: string;
            username: string;
            expertise_level: string;
        };
        title: string;
        preview: string;
        tags: string[];
        is_solved: boolean;
        is_featured: boolean;
        reply_count: number;
        view_count: number;
        vote_count: number;
    }

    type View = 'grid' | 'list' | 'focus';
    
    export let thread: Thread;
    export let view: View;
    export let expertiseLevel: string;
    
    const dispatch = createEventDispatcher();
    
    let isHovered = false;
    let showPreview = false;
</script>

  <article
    class="thread-card"
    class:list={view === 'list'}
    class:focus={view === 'focus'}
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
    transition:fade
  >
    <!-- Interactive Header -->
    <header class="card-header">
      <div class="user-info">
        <img 
          src={thread.author.avatar_url} 
          alt={thread.author.username}
          class="avatar"
        />
        <div class="meta">
          <span class="username">{thread.author.username}</span>
          <span class="expertise">
            {thread.author.expertise_level}
          </span>
        </div>
      </div>
      
      <!-- Dynamic Indicators -->
      <div class="indicators">
        {#if thread.is_solved}
          <span class="solved">✓</span>
        {/if}
        {#if thread.is_featured}
          <span class="featured">⭐</span>
        {/if}
      </div>
    </header>
  
    <!-- Content Preview -->
    <div class="content">
      <h3>{thread.title}</h3>
      
      {#if showPreview || view !== 'grid'}
        <p class="preview">{thread.preview}</p>
      {/if}
      
      <!-- Interactive Tags -->
      <div class="tags">
        {#each thread.tags as tag}
          <span class="tag" 
            on:click={() => dispatch('tagSelect', tag)}
          >
            {tag}
          </span>
        {/each}
      </div>
    </div>
  
    <!-- Engagement Metrics -->
    <footer class="card-footer">
      <div class="metrics">
        <span class="replies">
          💬 {thread.reply_count}
        </span>
        <span class="views">
          👁️ {thread.view_count}
        </span>
        <span class="score">
          ⬆️ {thread.vote_count}
        </span>
      </div>
      
      {#if isHovered}
        <div class="quick-actions" transition:slide>
          <button on:click={() => dispatch('save')}>
            🔖 Save
          </button>
          <button on:click={() => dispatch('share')}>
            📤 Share
          </button>
        </div>
      {/if}
    </footer>
  </article>
  
  <style lang="postcss">
    .thread-card {
      @apply bg-base-100 rounded-xl p-4 border border-base-300 transition-all cursor-pointer;
  
      &.list {
        @apply grid grid-cols-[auto_1fr_auto] gap-4 items-start;
      }
      
      &.focus {
        @apply max-w-3xl mx-auto;
      }
    }

    .thread-card:hover {
      @apply shadow-lg;
    }
  
    .card-header {
      @apply flex items-center justify-between mb-3;
    }
  
    .user-info {
      @apply flex items-center gap-3;
      
      &.avatar {
        @apply w-10 h-10 rounded-full ring-2 ring-primary/20;
      }
      
      &.meta {
        @apply flex flex-col;
        
        &.username {
          @apply font-medium;
        }
        
        &.expertise {
          @apply text-sm text-base-content/60;
        }
      }
    }
  
    .content {
      @apply space-y-3;
      
      & h3 {
        @apply text-lg font-semibold line-clamp-2;
      }
      
      &.preview {
        @apply text-sm text-base-content/80 line-clamp-3;
      }
    }
  
    .tags {
      @apply flex flex-wrap gap-2;
      
      &.tag {
        @apply px-2 py-1 text-xs rounded-full
               bg-primary/10 text-primary-content
               transition-colors;
      }

      &.tag:hover {
        @apply bg-primary/20;
      }
    }
  
    .card-footer {
      @apply flex items-center justify-between mt-4
             pt-4 border-t border-base-300;
      
      &.metrics {
        @apply flex gap-4 text-sm text-base-content/60;
      }
      
      &.quick-actions {
        @apply flex gap-2;
        
        & button {
          @apply btn btn-ghost btn-sm;
        }
      }
    }
  </style>
<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { stemCore } from '$lib/core';
  import ThreadCard from './ThreadCard.svelte';
  import TopicNav from './TopicNav.svelte';
  import LearningPathWidget from './LearningPathWidget.svelte';
  import ExpertiseLevel from './ExpertiseLevel.svelte';
  
  export let domainPath: string;
  
  let threads = [];
  let activeView: 'grid' | 'list' | 'focus' = 'grid';
  let selectedTopic: string | null = null;
  let expertiseLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  let isLoading = true;
  let domainStructure: any;
  
  // Interactive elements state
  let showQuickPost = false;
  let searchQuery = '';
  let activeFilters = new Set();
  
  onMount(async () => {
    domainStructure = await stemCore.getDomainTaxonomy(domainPath);
    await loadThreads();
    isLoading = false;
  });

  async function loadThreads() {
    // ... thread loading logic
  }
</script>

<div class="forum-container" class:focus-mode={activeView === 'focus'}>
  <!-- Dynamic Header with Learning Context -->
  <header class="forum-header" transition:slide>
    <div class="domain-context">
      <ExpertiseLevel 
        {expertiseLevel} 
        on:change={(e) => expertiseLevel = e.detail}
      />
      
      <div class="quick-actions">
        <button 
          class="new-post-btn"
          on:click={() => showQuickPost = true}
        >
          <span class="icon">✏️</span>
          Ask or Share
        </button>
        
        <div class="view-toggles">
          <button 
            class:active={activeView === 'grid'}
            on:click={() => activeView = 'grid'}
          >
            <span class="icon">📱</span>
          </button>
          <button 
            class:active={activeView === 'list'}
            on:click={() => activeView = 'list'}
          >
            <span class="icon">📝</span>
          </button>
          <button 
            class:active={activeView === 'focus'}
            on:click={() => activeView = 'focus'}
          >
            <span class="icon">🎯</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Interactive Topic Navigation -->
    <TopicNav 
      {domainStructure}
      bind:selectedTopic
      {expertiseLevel}
    />
  </header>

  <!-- Main Content Area -->
  <div class="content-grid" class:list-view={activeView === 'list'}>
    <!-- Learning Path Context (Sidebar in Grid/List view) -->
    {#if activeView !== 'focus'}
      <aside class="learning-context" transition:slide>
        <LearningPathWidget 
          {domainPath}
          {expertiseLevel}
          {selectedTopic}
        />
      </aside>
    {/if}

    <!-- Thread Grid/List -->
    <main class="thread-container">
      {#if isLoading}
        <div class="loading-skeleton">
          <!-- Animated loading states -->
        </div>
      {:else}
        {#each threads as thread (thread.id)}
          <ThreadCard
            {thread}
            view={activeView}
            {expertiseLevel}
            on:interact={handleThreadInteraction}
          />
        {/each}
      {/if}
    </main>
  </div>
</div>

<style lang="postcss">
  .forum-container {
    @apply h-full flex flex-col gap-4 bg-gradient-to-br from-base-100 to-base-200;
    
    &.focus-mode {
      @apply max-w-3xl mx-auto;
    }
  }

  .forum-header {
    @apply sticky top-0 z-10 backdrop-blur-sm bg-base-100/80 
           border-b border-base-300 p-4;
  }

  .domain-context {
    @apply flex items-center justify-between mb-4;
  }

  .quick-actions {
    @apply flex items-center gap-4;
  }

  .new-post-btn {
    @apply btn btn-primary btn-lg gap-2 rounded-full
           hover:scale-105 transition-transform;
  }

  .view-toggles {
    @apply flex gap-2 p-1 bg-base-200 rounded-full;

    button {
      @apply p-2 rounded-full transition-colors;
      
      &.active {
        @apply bg-primary text-primary-content;
      }
    }
  }

  .content-grid {
    @apply grid gap-6 p-4;
    grid-template-columns: 18rem 1fr;

    &.list-view {
      @apply grid-cols-[14rem_1fr];
    }
  }

  .thread-container {
    @apply grid gap-4;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

    :global(.list-view) & {
      @apply grid-cols-1;
    }
  }

  .learning-context {
    @apply sticky top-24 h-fit;
  }
</style>
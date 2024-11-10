<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    
    export let domainStructure: any;
    export let selectedTopic: string | null;
    export let expertiseLevel: string;
  
    let expandedSubdomain: string | null = null;
    
    $: topics = domainStructure?.topics || [];
    $: subdomains = domainStructure?.subdomains || [];
  
    function isTopicAccessible(topic: any) {
      const levels = ['beginner', 'intermediate', 'advanced'];
      return levels.indexOf(expertiseLevel) >= levels.indexOf(topic.minLevel);
    }
  </script>
  
  <nav class="topic-nav">
    <!-- Quick Topic Chips -->
    <div class="quick-topics">
      {#each topics as topic}
        {#if isTopicAccessible(topic)}
          <button
            class="topic-chip"
            class:active={selectedTopic === topic.path}
            on:click={() => selectedTopic = topic.path}
          >
            {topic.name}
          </button>
        {/if}
      {/each}
    </div>
  
    <!-- Detailed Subdomain Navigation -->
    <div class="subdomain-list">
      {#each subdomains as subdomain}
        <div class="subdomain-group">
          <button
            class="subdomain-header"
            on:click={() => expandedSubdomain = expandedSubdomain === subdomain.path ? null : subdomain.path}
          >
            <span class="icon">{subdomain.icon || '📚'}</span>
            <span class="name">{subdomain.name}</span>
            <span class="arrow" class:expanded={expandedSubdomain === subdomain.path}>▼</span>
          </button>
  
          {#if expandedSubdomain === subdomain.path}
            <div class="topic-list" transition:slide>
              {#each subdomain.topics as topic}
                {#if isTopicAccessible(topic)}
                  <button
                    class="topic-item"
                    class:active={selectedTopic === topic.path}
                    on:click={() => selectedTopic = topic.path}
                  >
                    <div class="topic-info">
                      <span class="name">{topic.name}</span>
                      <span class="description">{topic.description}</span>
                    </div>
                    <div class="progress-indicator">
                      <div 
                        class="progress-bar"
                        style="width: {topic.progress || 0}%"
                      />
                    </div>
                  </button>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </nav>
  
  <style lang="postcss">
    .topic-nav {
      @apply space-y-4;
    }
  
    .quick-topics {
      @apply flex flex-wrap gap-2;
  
      .topic-chip {
        @apply px-3 py-1 rounded-full text-sm
               bg-base-200 hover:bg-base-300
               transition-colors;
  
        &.active {
          @apply bg-primary text-primary-content;
        }
      }
    }
  
    .subdomain-list {
      @apply space-y-2;
    }
  
    .subdomain-header {
      @apply flex items-center gap-2 w-full px-3 py-2
             rounded-lg hover:bg-base-200
             transition-colors;
  
      .arrow {
        @apply ml-auto text-xs transition-transform;
        &.expanded {
          @apply rotate-180;
        }
      }
    }
  
    .topic-list {
      @apply pl-8 space-y-1 mt-1;
    }
  
    .topic-item {
      @apply flex items-center gap-4 w-full px-3 py-2
             rounded-lg hover:bg-base-200
             transition-colors;
  
      &.active {
        @apply bg-primary/10;
      }
  
      .topic-info {
        @apply flex flex-col items-start;
  
        .name {
          @apply font-medium;
        }
  
        .description {
          @apply text-xs text-base-content/60;
        }
      }
  
      .progress-indicator {
        @apply ml-auto w-16 h-1 bg-base-300 rounded-full overflow-hidden;
  
        .progress-bar {
          @apply h-full bg-primary transition-all;
        }
      }
    }
  </style>
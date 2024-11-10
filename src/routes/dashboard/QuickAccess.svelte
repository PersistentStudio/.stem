<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let recentDomains: Array<{
      id: string;
      name: string;
      icon?: string;
      path: string;
    }> = [];
  
    export let savedTopics: Array<{
      id: string;
      title: string;
      domain: string;
      progress: number;
    }> = [];
  
    const dispatch = createEventDispatcher();
  
    function handleDomainSelect(domainPath: string) {
      dispatch('domainSelect', domainPath);
    }
  </script>
  
  <div class="quick-access">
    <section class="recent-domains">
      <h2>Recent Domains</h2>
      <div class="domains-grid">
        {#each recentDomains as domain (domain.id)}
          <button
            class="domain-item"
            on:click={() => handleDomainSelect(domain.path)}
          >
            <span class="domain-icon">
              {#if domain.icon}
                <img src={domain.icon} alt="" />
              {:else}
                🔍
              {/if}
            </span>
            <span class="domain-name">{domain.name}</span>
          </button>
        {/each}
      </div>
    </section>
  
    <section class="saved-topics">
      <h2>Saved Topics</h2>
      <div class="topics-list">
        {#each savedTopics as topic (topic.id)}
          <div class="topic-item">
            <div class="topic-info">
              <h3>{topic.title}</h3>
              <p>{topic.domain}</p>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                style="width: {topic.progress}%"
              />
            </div>
          </div>
        {/each}
      </div>
    </section>
  </div>
  
  <style lang="postcss">
    .quick-access {
      @apply bg-base-200 rounded-xl p-4 space-y-6;
    }
  
    .quick-access h2 {
      @apply text-lg font-semibold mb-3;
    }
  
    .domains-grid {
      @apply grid grid-cols-2 gap-2;
    }
  
    .domain-item {
      @apply flex items-center gap-2 p-3 
             bg-base-100 rounded-lg;
    }

    .domain-item:hover {
        @apply bg-base-300
        transition-colors duration-200;
    }
  
    .domain-icon {
      @apply text-xl;
    }
  
    .domain-icon img {
      @apply w-6 h-6;
    }
  
    .domain-name {
      @apply text-sm font-medium;
    }
  
    .topics-list {
      @apply space-y-2;
    }
  
    .topic-item {
      @apply p-3 bg-base-100 rounded-lg;
    }
  
    .topic-info h3 {
      @apply text-sm font-medium;
    }
  
    .topic-info p {
      @apply text-xs text-base-content/60;
    }
  
    .progress-bar {
      @apply mt-2 h-1.5 bg-base-300 rounded-full overflow-hidden;
    }
  
    .progress-fill {
      @apply h-full bg-primary transition-all duration-300;
    }
  </style>
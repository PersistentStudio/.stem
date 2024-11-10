<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
  
    export let domainPath: string = "";
    export let recentDomains: any[] = [];
    export let savedTopics: any[] = [];
  
    const dispatch = createEventDispatcher();
  </script>
  
  <div class="quick-access" transition:fade>
    <h2>Quick Access</h2>
  
    <!-- Recent Domains -->
    <div class="section">
      <h3>Recent Domains</h3>
      <div class="domain-grid">
        {#each recentDomains as domain}
          <button
            class="domain-card"
            on:click={() => dispatch('domainSelect', domain.path)}
            class:active={domain.path === domainPath}
          >
            <span class="icon">{domain.icon}</span>
            <span class="name">{domain.name}</span>
            <span class="progress">
              {domain.progress}% Complete
            </span>
          </button>
        {/each}
      </div>
    </div>
  
    <!-- Saved Topics -->
    <div class="section">
      <h3>Saved Topics</h3>
      <div class="topic-list">
        {#each savedTopics as topic}
          <a
            href={topic.path}
            class="topic-item"
            class:active={topic.path === domainPath}
          >
            <div class="topic-info">
              <span class="name">{topic.name}</span>
              <span class="domain">{topic.domain}</span>
            </div>
            <span class="arrow">→</span>
          </a>
        {/each}
      </div>
    </div>
  </div>
  
  <style lang="postcss">
    .quick-access {
      @apply bg-base-200 rounded-xl p-6;
  
      & h2 {
        @apply text-lg font-semibold mb-4;
      }
    }
  
    .section {
      @apply mt-6;
  
      & h3 {
        @apply text-sm font-medium text-base-content/60 mb-3;
      }
    }

    .section:first {
      @apply mt-0;
    }
  
    .domain-grid {
      @apply grid grid-cols-2 gap-3;
  
      &.domain-card {
        @apply flex flex-col items-center gap-2
               p-4 rounded-xl bg-base-100;
               
        &.icon {
          @apply text-2xl;
        }
  
        &.name {
          @apply font-medium text-sm text-center;
        }
  
        &.progress {
          @apply text-xs text-base-content/60;
        }
      }
    }
  
    .domain-grid:hover {
      @apply bg-base-300 transition-all;
    }

    .topic-list {
      @apply space-y-2;
  
      &.topic-item {
        @apply flex items-center justify-between
               p-3 rounded-lg bg-base-100;
  
        &.topic-info {
          @apply flex flex-col;
  
          &.name {
            @apply font-medium;
          }
  
          &.domain {
            @apply text-xs text-base-content/60;
          }
        }
  
        &.arrow {
          @apply text-base-content/40;
        }
      }

      &.topic-item:hover {
        @apply bg-base-300 transition-colors;
      }
    }
  </style>
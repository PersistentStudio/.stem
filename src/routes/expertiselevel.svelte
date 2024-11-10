<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade, scale } from 'svelte/transition';
  
    export let expertiseLevel: 'beginner' | 'intermediate' | 'advanced';
    const dispatch = createEventDispatcher();
  
    const levels = [
      {
        id: 'beginner',
        icon: '🌱',
        label: 'Beginner',
        description: 'Learning the basics'
      },
      {
        id: 'intermediate',
        icon: '🌿',
        label: 'Intermediate',
        description: 'Building expertise'
      },
      {
        id: 'advanced',
        icon: '🌳',
        label: 'Advanced',
        description: 'Deep understanding'
      }
    ];
  
    let showSelector = false;
  </script>
  
  <div class="expertise-selector">
    <button 
      class="current-level"
      on:click={() => showSelector = !showSelector}
    >
      <span class="level-icon">
        {levels.find(l => l.id === expertiseLevel)?.icon}
      </span>
      <div class="level-info">
        <span class="label">{levels.find(l => l.id === expertiseLevel)?.label}</span>
        <span class="description">Viewing content for your level</span>
      </div>
      <span class="arrow">▼</span>
    </button>
  
    {#if showSelector}
      <div class="level-options" transition:scale>
        {#each levels as level}
          <button
            class="level-option"
            class:active={level.id === expertiseLevel}
            on:click={() => {
              dispatch('change', level.id);
              showSelector = false;
            }}
          >
            <span class="level-icon">{level.icon}</span>
            <div class="level-info">
              <span class="label">{level.label}</span>
              <span class="description">{level.description}</span>
            </div>
            {#if level.id === expertiseLevel}
              <span class="check" transition:fade>✓</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
  
  <style lang="postcss">
    .expertise-selector {
      @apply relative;
    }
  
    .current-level {
      @apply flex items-center gap-3 px-4 py-2 
             bg-base-200 rounded-lg
             hover:bg-base-300 transition-colors;
    }
  
    .level-icon {
      @apply text-2xl;
    }
  
    .level-info {
      @apply flex flex-col items-start;
  
      .label {
        @apply font-medium;
      }
  
      .description {
        @apply text-xs text-base-content/60;
      }
    }
  
    .arrow {
      @apply ml-2 text-xs text-base-content/40;
    }
  
    .level-options {
      @apply absolute top-full left-0 mt-2 w-64
             bg-base-100 rounded-xl shadow-xl
             border border-base-300
             overflow-hidden z-20;
  
      .level-option {
        @apply flex items-center gap-3 w-full px-4 py-3
               hover:bg-base-200 transition-colors;
  
        &.active {
          @apply bg-primary/10;
        }
  
        .check {
          @apply ml-auto text-primary;
        }
      }
    }
  </style>
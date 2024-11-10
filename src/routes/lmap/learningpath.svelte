<script lang="ts">
    import { onMount } from 'svelte';
    import { stemCore } from '$lib/core';
    
    export let domainPath: string;
    export let expertiseLevel: string;
    export let selectedTopic: string | null;
  
    let learningPath: any = null;
    let recommendations: any[] = [];
    let isLoading = true;
  
    onMount(async () => {
      await loadLearningPath();
      await loadRecommendations();
      isLoading = false;
    });
  
    async function loadLearningPath() {
      learningPath = await stemCore.getUserLearningPath(domainPath);
    }
  
    async function loadRecommendations() {
      recommendations = await stemCore.getRecommendations({
        domainPath,
        expertiseLevel,
        currentTopic: selectedTopic
      });
    }
  </script>
  
  <div class="learning-widget">
    <!-- Current Progress -->
    <section class="progress-section">
      <h3>Your Learning Journey</h3>
      
      {#if isLoading}
        <div class="loading-skeleton" />
      {:else if learningPath}
        <div class="progress-stats">
          <div class="stat">
            <span class="value">{learningPath.completedTopics}</span>
            <span class="label">Topics Complete</span>
          </div>
          <div class="stat">
            <span class="value">{learningPath.streakDays}</span>
            <span class="label">Day Streak</span>
          </div>
          <div class="stat">
            <span class="value">{learningPath.totalPoints}</span>
            <span class="label">Points</span>
          </div>
        </div>
  
        <div class="progress-bar">
          <div 
            class="progress-fill"
            style="width: {learningPath.progress}%"
          />
          <span class="progress-label">
            {learningPath.progress}% Complete
          </span>
        </div>
      {/if}
    </section>
  
    <!-- Next Steps -->
    <section class="recommendations-section">
      <h3>Recommended Next Steps</h3>
      
      {#if isLoading}
        <div class="loading-skeleton" />
      {:else}
        <div class="recommendation-list">
          {#each recommendations as item}
            <button 
              class="recommendation-item"
              on:click={() => window.location.href = item.url}
            >
              <span class="icon">{item.icon}</span>
              <div class="info">
                <span class="title">{item.title}</span>
                <span class="type">{item.type}</span>
              </div>
              <span class="arrow">→</span>
            </button>
          {/each}
        </div>
      {/if}
    </section>
  
    <!-- Learning Resources -->
    <section class="resources-section">
      <h3>Learning Resources</h3>
      <div class="resource-grid">
        <button class="resource-card">
          <span class="icon">📚</span>
          <span class="label">Study Materials</span>
        </button>
        <button class="resource-card">
          <span class="icon">📝</span>
          <span class="label">Practice</span>
        </button>
        <button class="resource-card">
          <span class="icon">👥</span>
          <span class="label">Study Groups</span>
        </button>
        <button class="resource-card">
          <span class="icon">🎯</span>
          <span class="label">Assessments</span>
        </button>
      </div>
    </section>
  </div>
  
  <style lang="postcss">
    .learning-widget {
      @apply space-y-6 p-4 bg-base-100 rounded-xl
             border border-base-300;
    }
  
    section {
      @apply space-y-3;
  
      h3 {
        @apply text-lg font-semibold;
      }
    }
  
    .progress-stats {
      @apply grid grid-cols-3 gap-2;
  
      .stat {
        @apply flex flex-col items-center p-2
               bg-base-200 rounded-lg;
  
        .value {
          @apply text-xl font-bold;
        }
  
        .label {
          @apply text-xs text-base-content/60;
        }
      }
    }
  
    .progress-bar {
      @apply relative h-3 bg-base-200 rounded-full
             overflow-hidden;
  
      .progress-fill {
        @apply absolute h-full bg-primary
               transition-all duration-500;
      }
  
      .progress-label {
        @apply absolute inset-0 flex items-center justify-center
               text-xs font-medium text-primary-content;
      }
    }
  
    .recommendation-list {
      @apply space-y-2;
  
      .recommendation-item {
        @apply flex items-center gap-3 w-full p-3
               bg-base-200 rounded-lg
               hover:bg-base-300 transition-colors;
  
        .icon {
          @apply text-xl;
        }
  
        .info {
          @apply flex flex-col items-start;
  
          .title {
            @apply font-medium;
          }
  
          .type {
            @apply text-xs text-base-content/60;
          }
        }
  
        .arrow {
          @apply ml-auto text-base-content/40;
        }
      }
    }
  
    .resource-grid {
      @apply grid grid-cols-2 gap-2;
  
      .resource-card {
        @apply flex flex-col items-center gap-2 p-4
               bg-base-200 rounded-lg
               hover:bg-base-300 transition-colors;
  
        .icon {
          @apply text-2xl;
        }
  
        .label {
          @apply text-sm font-medium;
        }
      }
    }
  
    .loading-skeleton {
      @apply h-32 bg-base-200 rounded-lg
             animate-pulse;
    }
  </style>
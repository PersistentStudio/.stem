<script lang="ts">
    import { fade } from 'svelte/transition';
    import { timeAgo } from '$lib/utils';
  
    export let recentActivity: Array<{
      type: 'completion' | 'post' | 'achievement' | 'group';
      timestamp: Date;
      content: string;
      domain?: string;
      url?: string;
    }>;
  </script>
  
  <div class="activity-feed" transition:fade>
    <h2>Recent Activity</h2>
  
    <div class="activity-list">
      {#each recentActivity as activity}
        <div class="activity-item">
          <div class="activity-icon">
            {#if activity.type === 'completion'}
              🎯
            {:else if activity.type === 'post'}
              ✍️
            {:else if activity.type === 'achievement'}
              🏆
            {:else if activity.type === 'group'}
              👥
            {/if}
          </div>
  
          <div class="activity-content">
            {#if activity.url}
              <a href={activity.url} class="content">
                {activity.content}
              </a>
            {:else}
              <span class="content">
                {activity.content}
              </span>
            {/if}
  
            <div class="metadata">
              {#if activity.domain}
                <span class="domain">{activity.domain}</span>
              {/if}
              <span class="timestamp">
                {timeAgo(activity.timestamp)}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <style lang="postcss">
    .activity-feed {
      @apply bg-base-200 rounded-xl p-6;
  
      h2 {
        @apply text-lg font-semibold mb-4;
      }
    }
  
    .activity-list {
      @apply space-y-4;
    }
  
    .activity-item {
      @apply flex gap-3 p-3 rounded-lg
             bg-base-100 hover:bg-base-300
             transition-colors;
  
      .activity-icon {
        @apply text-xl;
      }
  
      .activity-content {
        @apply flex-1;
  
        .content {
          @apply block text-sm;
        }
  
        .metadata {
          @apply flex items-center gap-2 mt-1
                 text-xs text-base-content/60;
  
          .domain {
            @apply px-2 py-0.5 rounded-full
                   bg-primary/10 text-primary;
          }
        }
      }
    }
  </style>
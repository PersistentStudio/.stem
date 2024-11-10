<script lang="ts">
    export let recentActivity: Array<{
      id: string;
      type: string;
      title: string;
      timestamp: string;
      description: string;
    }>;
  
    function formatTimestamp(timestamp: string): string {
      return new Date(timestamp).toLocaleString();
    }
  </script>
  
  <div class="activity-feed">
    <h2 class="feed-title">Recent Activity</h2>
    <div class="feed-list">
      {#each recentActivity as activity (activity.id)}
        <div class="activity-item">
          <div class="activity-icon">
            {#if activity.type === 'achievement'}
              🏆
            {:else if activity.type === 'learning'}
              📚
            {:else if activity.type === 'social'}
              👥
            {:else}
              📝
            {/if}
          </div>
          <div class="activity-content">
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <span class="timestamp">{formatTimestamp(activity.timestamp)}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <style lang="postcss">
    .activity-feed {
      @apply bg-base-200 rounded-xl p-4;
    }
  
    .feed-title {
      @apply text-lg font-semibold mb-4;
    }
  
    .feed-list {
      @apply space-y-3;
    }
  
    .activity-item {
      @apply flex gap-3 p-3 bg-base-100 rounded-lg;
    }
  
    .activity-icon {
      @apply text-2xl;
    }
  
    .activity-content {
      @apply flex-1;
    }
  
    .activity-content h3 {
      @apply text-sm font-medium;
    }
  
    .activity-content p {
      @apply text-sm text-base-content/70;
    }
  
    .timestamp {
      @apply text-xs text-base-content/50;
    }
  </style>
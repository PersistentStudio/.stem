<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import { clickOutside } from '$lib/actions';
    import StemCore from '$lib/stemcore';

    export let notifications: Array<{
      id: string;
      type: 'achievement' | 'mention' | 'reply' | 'group' | 'system';
      content: string;
      timestamp: Date;
      read: boolean;
      url?: string;
      action?: {
        label: string;
        handler: () => void;
      };
    }>;
  
    let showNotifications = false;
    $: unreadCount = notifications.filter(n => !n.read).length;
  
    async function markAsRead(notificationId: string) {
      await StemCore.markNotificationRead(notificationId);
      notifications = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
    }
  
    function handleClickOutside() {
      showNotifications = false;
    }

    // Function to calculate time ago
    function timeAgo(date: Date): string {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      const weeks = Math.floor(diff / 604800000);
      const months = Math.floor(diff / 2629800000);
      const years = Math.floor(diff / 31536000000);

      if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
      if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
      if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      return 'just now';
    }
  </script>
  
  <div class="notifications" use:clickOutside={handleClickOutside}>
    <!-- Notification Bell -->
    <button 
      class="notification-bell"
      class:has-unread={unreadCount > 0}
      on:click={() => showNotifications = !showNotifications}
    >
      <span class="icon">🔔</span>
      {#if unreadCount > 0}
        <span class="unread-badge" transition:fade>
          {unreadCount}
        </span>
      {/if}
    </button>
  
    <!-- Notification Panel -->
    {#if showNotifications}
      <div class="notification-panel" transition:slide>
        <header class="panel-header">
          <h3>Notifications</h3>
          {#if unreadCount > 0}
            <button 
              class="mark-all-read"
              on:click={() => {
                notifications.forEach(n => markAsRead(n.id));
              }}
            >
              Mark all read
            </button>
          {/if}
        </header>
  
        <div class="notification-list">
          {#each notifications as notification (notification.id)}
            <button 
              class="notification-item"
              class:unread={!notification.read}
              on:click={() => markAsRead(notification.id)}
            >
              <div class="notification-icon">
                {#if notification.type === 'achievement'}
                  🏆
                {:else if notification.type === 'mention'}
                  @
                {:else if notification.type === 'reply'}
                  💬
                {:else if notification.type === 'group'}
                  👥
                {:else}
                  ℹ️
                {/if}
              </div>
  
              <div class="notification-content">
                {#if notification.url}
                  <a href={notification.url} class="content">
                    {notification.content}
                  </a>
                {:else}
                  <span class="content">
                    {notification.content}
                  </span>
                {/if}
  
                <span class="timestamp">
                  {timeAgo(notification.timestamp)}
                </span>
              </div>
  
              {#if notification.action}
                <button 
                  class="action-button"
                  on:click|stopPropagation={notification.action.handler}
                >
                  {notification.action.label}
                </button>
              {/if}
            </button>
          {:else}
            <div class="empty-state">
              No notifications
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  <style lang="postcss">
    .notifications {
      @apply relative;
    }
  
    .notification-bell {
      @apply relative p-2 rounded-lg;
  
      &.has-unread {
        @apply text-primary;
      }
  
      &.unread-badge {
        @apply absolute -top-1 -right-1
               w-5 h-5 rounded-full
               bg-primary text-primary-content
               text-xs flex items-center justify-center;
      }
    }

    .notification-bell:hover {
      @apply bg-base-200 transition-colors;
    }
  
    .notification-panel {
      @apply absolute top-full right-0 mt-2
             w-80 bg-base-100 rounded-xl
             shadow-xl border border-base-300
             overflow-hidden z-50;
    }
  
    .panel-header {
      @apply flex items-center justify-between
             p-4 border-b border-base-300;
  
      & h3 {
        @apply font-semibold;
      }
  
      &.mark-all-read {
        @apply text-sm text-primary;
      }

      &.mark-all-read:hover {
        @apply underline;
      }
    }
  
    .notification-list {
      @apply max-h-96 overflow-y-auto;
    }
  
    .notification-item {
      @apply flex items-start gap-3 p-4;
  
      &.unread {
        @apply bg-primary/5;
      }
    }

    .notification-items:hover {
      @apply bg-base-200 transition-colors
             cursor-pointer;
    }
  
    .notification-icon {
      @apply text-xl;
    }
  
    .notification-content {
      @apply flex-1;
  
      &.content {
        @apply block text-sm;
      }
  
      &.timestamp {
        @apply block text-xs text-base-content/60 mt-1;
      }
    }
  
    .action-button {
      @apply px-3 py-1 rounded-lg text-sm
             bg-primary text-primary-content
             transition-colors;
    }

    .action {
      @apply bg-primary-focus;
    }
  
    .empty-state {
      @apply p-8 text-center text-base-content/60;
    }
  </style>
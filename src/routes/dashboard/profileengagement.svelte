<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
  
    export let peerGroups: Array<{
      id: string;
      name: string;
      domain: string;
      members: Array<{
        id: string;
        name: string;
        avatar: string;
        status: 'online' | 'offline' | 'busy';
      }>;
      lastActivity: Date;
    }>;
  
    const dispatch = createEventDispatcher();
  </script>
  
  <div class="peer-groups" transition:fade>
    <h2>Study Groups</h2>
  
    <div class="group-list">
      {#each peerGroups as group}
        <button
          class="group-card"
          on:click={() => dispatch('groupSelect', group)}
        >
          <div class="group-info">
            <h3>{group.name}</h3>
            <span class="domain">{group.domain}</span>
          </div>
  
          <div class="members">
            {#each group.members.slice(0, 3) as member}
              <div 
                class="member-avatar"
                class:online={member.status === 'online'}
                class:busy={member.status === 'busy'}
              >
                <img 
                  src={member.avatar}
                  alt={member.name}
                />
              </div>
            {/each}
            {#if group.members.length > 3}
              <span class="more-members">
                +{group.members.length - 3}
              </span>
            {/if}
          </div>
        </button>
      {/each}
  
      <button class="create-group">
        Create New Group
      </button>
    </div>
  </div>
  
  <style lang="postcss">
    .peer-groups {
      @apply bg-base-200 rounded-xl p-6;
  
      h2 {
        @apply text-lg font-semibold mb-4;
      }
    }
  
    .group-list {
      @apply space-y-3;
    }
  
    .group-card {
      @apply flex items-center justify-between
             w-full p-4 rounded-lg bg-base-100
             hover:bg-base-300 transition-colors;
  
      .group-info {
        h3 {
          @apply font-medium;
        }
  
        .domain {
          @apply text-sm text-base-content/60;
        }
      }
  
      .members {
        @apply flex items-center -space-x-2;
  
        .member-avatar {
          @apply relative w-8 h-8 rounded-full
                 border-2 border-base-100
                 overflow-hidden;
  
          &.online::after {
            content: "";
            @apply absolute bottom-0 right-0
                   w-2.5 h-2.5 rounded-full
                   bg-success border-2 border-base-100;
          }
  
          &.busy::after {
            content: "";
            @apply absolute bottom-0 right-0
                   w-2.5 h-2.5 rounded-full
                   bg-warning border-2 border-base-100;
          }
  
          img {
            @apply w-full h-full object-cover;
          }
        }
  
        .more-members {
          @apply ml-4 text-sm text-base-content/60;
        }
      }
    }
  
    .create-group {
      @apply w-full p-4 rounded-lg
             bg-primary/10 text-primary
             hover:bg-primary/20
             transition-colors;
    }
  </style>
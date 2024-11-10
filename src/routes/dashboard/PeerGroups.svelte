<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let peerGroups: Array<{
      id: string;
      name: string;
      memberCount: number;
      avatar?: string;
      lastActive: string;
    }>;
  
    const dispatch = createEventDispatcher();
  
    function handleGroupClick(group: any) {
      dispatch('groupSelect', group);
    }
  </script>
  
  <div class="peer-groups">
    <h2 class="section-title">Peer Groups</h2>
    <div class="groups-list">
      {#each peerGroups as group (group.id)}
        <button
          class="group-item"
          on:click={() => handleGroupClick(group)}
        >
          <div class="group-avatar">
            {#if group.avatar}
              <img src={group.avatar} alt={group.name} />
            {:else}
              <div class="avatar-placeholder">
                {group.name[0]}
              </div>
            {/if}
          </div>
          <div class="group-info">
            <h3>{group.name}</h3>
            <p>{group.memberCount} members</p>
          </div>
        </button>
      {/each}
    </div>
  </div>
  
  <style lang="postcss">
    .peer-groups {
      @apply bg-base-200 rounded-xl p-4;
    }
  
    .section-title {
      @apply text-lg font-semibold mb-4;
    }
  
    .groups-list {
      @apply space-y-2;
    }
  
    .group-item {
      @apply w-full flex items-center gap-3 p-3 
             bg-base-100 rounded-lg;
    }

    .group-item:hover {
      @apply bg-base-300
      transition-colors duration-200;
    }
  
    .group-avatar {
      @apply w-10 h-10 rounded-full overflow-hidden 
             flex items-center justify-center 
             bg-primary text-primary-content;
    }
  
    .group-avatar img {
      @apply w-full h-full object-cover;
    }
  
    .avatar-placeholder {
      @apply text-lg font-semibold;
    }
  
    .group-info {
      @apply text-left;
    }
  
    .group-info h3 {
      @apply text-sm font-medium;
    }
  
    .group-info p {
      @apply text-xs text-base-content/60;
    }
  </style>
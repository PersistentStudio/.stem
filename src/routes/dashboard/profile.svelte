<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import StemCore from '$lib/stemcore';
    import LearningPathWidget from '$components/learning/LearningPathWidget.svelte';
    import DomainChat from '$components/chat/DomainChat.svelte';
    import ActivityFeed from './ActivityFeed.svelte';
    import PeerGroups from './PeerGroups.svelte';
    import QuickAccess from './QuickAccess.svelte';
    import Notifications from './Notifications.svelte';
  
    let user: any;
    let recentActivity: any[] = [];
    let activeDomain: string | null = null;
    let activeContext: any = null;
    let peerGroups: any[] = [];
    let notifications: any[] = [];
    let isLoading = true;
  
    onMount(async () => {
      await loadDashboardData();
    });
  
    async function loadDashboardData() {
      const [userData, activity, groups, notifs] = await Promise.all([
        StemCore.getCurrentUser(),
        StemCore.getUserActivity(),
        StemCore.getUserPeerGroups(),
        StemCore.getUserNotifications()
      ]);
  
      user = userData;
      recentActivity = activity;
      peerGroups = groups;
      notifications = notifs;
      isLoading = false;
    }
  
    function handleContextChange(event: CustomEvent) {
      activeContext = event.detail;
      // Update relevant components based on new context
    }
  </script>
  
  <div class="dashboard-layout">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="user-context">
        <img 
          src={user?.avatar} 
          alt={user?.name}
          class="avatar"
        />
        <div class="user-info">
          <h1>Welcome back, {user?.name}</h1>
          <p class="status">
            {#if activeContext}
              Exploring {activeContext.name}
            {:else}
              What would you like to learn today?
            {/if}
          </p>
        </div>
      </div>
      
      <Notifications {notifications} />
    </header>
  
    <div class="dashboard-grid">
      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Learning Context -->
        <section class="learning-context" transition:fade>
          <LearningPathWidget
            domainPath={activeDomain}
            on:contextChange={handleContextChange}
          />
        </section>
  
        <!-- Interactive Chat & Posts -->
        <section class="interaction-area">
          <DomainChat
            {activeContext}
            on:newPost={(event) => {
              // Handle new post creation
              console.log('Creating new post:', event.detail);
            }}
          />
        </section>
      </main>
  
      <!-- Right Sidebar -->
      <aside class="right-sidebar">
        <QuickAccess
          recentDomains={user?.recentDomains}
          savedTopics={user?.savedTopics}
          on:domainSelect={(event) => {
            activeDomain = event.detail;
          }}
        />
  
        <ActivityFeed {recentActivity} />
        
        <PeerGroups 
          {peerGroups}
          on:groupSelect={(event) => {
            // Handle group selection
            console.log('Selected group:', event.detail);
          }}
        />
      </aside>
    </div>
  </div>
  
  <style lang="postcss">
    .dashboard-layout {
      @apply h-screen flex flex-col bg-base-100;
    }
  
    .dashboard-header {
      @apply sticky top-0 z-20 flex items-center justify-between
             px-6 py-4 bg-base-100/80 backdrop-blur-sm
             border-b border-base-300;
    }

    .user-context {
      @apply flex items-center gap-4;
    }

    .avatar {
      @apply w-12 h-12 rounded-full;
    }

    .user-info h1 {
      @apply text-xl font-semibold;
    }

    .user-info .status {
      @apply text-sm text-base-content/60;
    }
  
    .dashboard-grid {
      @apply flex-1 grid gap-6 p-6 overflow-hidden;
      grid-template-columns: 1fr 22rem;
    }
  
    .main-content {
      @apply space-y-6 overflow-y-auto;
    }
  
    .learning-context {
      @apply bg-base-200 rounded-xl p-6;
    }
  
    .interaction-area {
      @apply bg-base-200 rounded-xl;
    }
  
    .right-sidebar {
      @apply space-y-6 overflow-y-auto;
    }
  </style>
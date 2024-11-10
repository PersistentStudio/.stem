<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import ChatMessage from './ChatMessage.svelte';
    import ChatInput from './ChatInput.svelte';
    import ThreadView from './ThreadView.svelte';
    import AIHelper from './AIHelper.svelte';
  
    export let domainPath: string;
    export let currentTopic: string | null = null;
  
    let messages: any[] = [];
    let activeThread: string | null = null;
    let chatMode: 'general' | 'help' | 'study-group' = 'general';
    let subdomains: any[] = [];
    let activeSubdomain: string | null = null;
    let websocket: WebSocket;
    let isAIHelperActive = false;
    let studyGroups: any[] = [];
  
    // Presence tracking
    let onlineUsers: Set<string> = new Set();
    let userTyping: Map<string, boolean> = new Map();
  
    onMount(async () => {
      await initializeChat();
      connectWebSocket();
    });
  
    onDestroy(() => {
      websocket?.close();
    });
  
    async function initializeChat() {
      // Load domain structure and chat history
      const structure = await stemCore.getDomainStructure(domainPath);
      subdomains = structure.subdomains;
      
      // Load recent messages
      messages = await stemCore.getChatHistory({
        domainPath,
        subdomain: activeSubdomain,
        topic: currentTopic
      });
  
      // Load active study groups
      studyGroups = await stemCore.getStudyGroups(domainPath);
    }
  
    function connectWebSocket() {
      websocket = new WebSocket(`${WS_URL}/chat/${domainPath}`);
      
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
            handleNewMessage(data.message);
            break;
          case 'presence':
            updatePresence(data.users);
            break;
          case 'typing':
            updateTypingStatus(data.user, data.isTyping);
            break;
          case 'thread_update':
            updateThread(data.threadId, data.update);
            break;
        }
      };
    }
  </script>
  
  <div class="domain-chat">
    <!-- Chat Navigation -->
    <nav class="chat-nav">
      <div class="domain-selector">
        <h3>{domainPath}</h3>
        <div class="subdomain-tabs">
          <button 
            class:active={!activeSubdomain}
            on:click={() => activeSubdomain = null}
          >
            General
          </button>
          {#each subdomains as subdomain}
            <button 
              class:active={activeSubdomain === subdomain.path}
              on:click={() => activeSubdomain = subdomain.path}
            >
              {subdomain.name}
            </button>
          {/each}
        </div>
      </div>
  
      <!-- Chat Mode Selector -->
      <div class="mode-selector">
        <button 
          class:active={chatMode === 'general'}
          on:click={() => chatMode = 'general'}
        >
          💬 Discussion
        </button>
        <button 
          class:active={chatMode === 'help'}
          on:click={() => chatMode = 'help'}
        >
          🤔 Get Help
        </button>
        <button 
          class:active={chatMode === 'study-group'}
          on:click={() => chatMode = 'study-group'}
        >
          👥 Study Groups
        </button>
      </div>
    </nav>
  
    <!-- Main Chat Area -->
    <div class="chat-container">
      <!-- Messages Area -->
      <div class="messages-area">
        {#each messages as message (message.id)}
          <ChatMessage 
            {message}
            on:threadSelect={(threadId) => activeThread = threadId}
            on:reaction={(reaction) => handleReaction(message.id, reaction)}
          />
        {/each}
      </div>
  
      <!-- Active Users -->
      <div class="active-users">
        {#each Array.from(onlineUsers) as userId}
          <UserAvatar {userId} isTyping={userTyping.get(userId)} />
        {/each}
      </div>
  
      <!-- Input Area -->
      <ChatInput 
        on:send={handleSend}
        on:typing={handleTyping}
        {chatMode}
      />
    </div>
  
    <!-- Side Panel -->
    <div class="side-panel">
      {#if activeThread}
        <ThreadView 
          threadId={activeThread}
          on:close={() => activeThread = null}
        />
      {:else if chatMode === 'study-group'}
        <!-- Study Groups Panel -->
        <div class="study-groups">
          <h3>Active Study Groups</h3>
          {#each studyGroups as group}
            <div class="study-group-card">
              <h4>{group.name}</h4>
              <p>{group.description}</p>
              <div class="members">
                {#each group.members as member}
                  <UserAvatar userId={member.id} size="sm" />
                {/each}
              </div>
              <button on:click={() => joinStudyGroup(group.id)}>
                Join Group
              </button>
            </div>
          {/each}
          <button class="create-group-btn">
            Create New Study Group
          </button>
        </div>
      {:else if chatMode === 'help'}
        <AIHelper 
          bind:this={isAIHelperActive}
          {domainPath}
          {currentTopic}
        />
      {/if}
    </div>
  </div>
  
  <style lang="postcss">
    .domain-chat {
      @apply grid grid-cols-[auto_1fr_300px] h-full
             bg-base-100 rounded-xl overflow-hidden
             border border-base-300;
    }
  
    .chat-nav {
      @apply w-64 border-r border-base-300
             flex flex-col;
  
      .domain-selector {
        @apply p-4 border-b border-base-300;
  
        h3 {
          @apply text-lg font-semibold mb-3;
        }
      }
  
      .subdomain-tabs {
        @apply flex flex-col gap-1;
  
        button {
          @apply px-3 py-2 text-left rounded-lg
                 hover:bg-base-200 transition-colors;
  
          &.active {
            @apply bg-primary text-primary-content;
          }
        }
      }
    }
  
    .mode-selector {
      @apply flex flex-col gap-2 p-4;
  
      button {
        @apply flex items-center gap-2 px-4 py-2
               rounded-lg hover:bg-base-200
               transition-colors;
  
        &.active {
          @apply bg-primary/10 text-primary;
        }
      }
    }
  
    .chat-container {
      @apply flex flex-col h-full;
    }
  
    .messages-area {
      @apply flex-1 overflow-y-auto p-4 space-y-4;
    }
  
    .active-users {
      @apply flex items-center gap-2 p-2
             border-t border-base-300;
    }
  
    .side-panel {
      @apply border-l border-base-300
             overflow-y-auto;
    }
  
    .study-groups {
      @apply p-4 space-y-4;
  
      .study-group-card {
        @apply p-4 bg-base-200 rounded-lg space-y-2;
  
        .members {
          @apply flex items-center gap-1;
        }
      }
  
      .create-group-btn {
        @apply w-full p-3 rounded-lg
               bg-primary text-primary-content
               hover:bg-primary-focus transition-colors;
      }
    }
  </style>
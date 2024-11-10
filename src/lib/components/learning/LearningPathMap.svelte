<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { stemCore } from '$lib/core';
  
    export let domainPath: string;
    export let userProgress: any;
    
    const dispatch = createEventDispatcher();
    
    let container: HTMLElement;
    let activeNode: string | null = null;
    let hoveredNode: string | null = null;
    let connections: any[] = [];
    let nodes: Map<string, HTMLElement> = new Map();
    let pathData: any;
    let isLoading = true;
    
    // Track viewport for infinite canvas
    let viewportOffset = { x: 0, y: 0 };
    let isDragging = false;
    let startDrag = { x: 0, y: 0 };
    let zoom = 1;
  
    onMount(async () => {
      pathData = await stemCore.getLearningPathStructure(domainPath);
      isLoading = false;
      requestAnimationFrame(drawConnections);
    });
  
    function drawConnections() {
      if (!container) return;
      
      connections = [];
      pathData.connections.forEach((conn: any) => {
        const fromNode = nodes.get(conn.from);
        const toNode = nodes.get(conn.to);
        
        if (fromNode && toNode) {
          const fromRect = fromNode.getBoundingClientRect();
          const toRect = toNode.getBoundingClientRect();
          
          connections.push({
            id: `${conn.from}-${conn.to}`,
            path: generatePath(fromRect, toRect),
            status: getConnectionStatus(conn),
            prerequisite: conn.prerequisite
          });
        }
      });
    }
  
    function generatePath(from: DOMRect, to: DOMRect): string {
      const start = {
        x: from.left + from.width / 2,
        y: from.top + from.height / 2
      };
      
      const end = {
        x: to.left + to.width / 2,
        y: to.top + to.height / 2
      };
  
      const controlPoint1 = {
        x: start.x + (end.x - start.x) / 2,
        y: start.y
      };
  
      const controlPoint2 = {
        x: start.x + (end.x - start.x) / 2,
        y: end.y
      };
  
      return `M ${start.x} ${start.y} 
              C ${controlPoint1.x} ${controlPoint1.y},
                ${controlPoint2.x} ${controlPoint2.y},
                ${end.x} ${end.y}`;
    }
  
    function getConnectionStatus(conn: any) {
      const fromProgress = userProgress[conn.from] || 0;
      const toProgress = userProgress[conn.to] || 0;
      
      if (toProgress > 0) return 'completed';
      if (fromProgress >= 100) return 'available';
      return 'locked';
    }
  
    function handleNodeClick(nodeId: string) {
      if (activeNode === nodeId) {
        activeNode = null;
      } else {
        activeNode = nodeId;
      }
      dispatch('nodeSelect', { nodeId });
    }
  
    // Pan and zoom handlers
    function handleMouseDown(e: MouseEvent) {
      isDragging = true;
      startDrag = { x: e.clientX - viewportOffset.x, y: e.clientY - viewportOffset.y };
    }
  
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      viewportOffset = {
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y
      };
      drawConnections();
    }
  
    function handleMouseUp() {
      isDragging = false;
    }
  
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      zoom = Math.max(0.5, Math.min(2, zoom * delta));
      drawConnections();
    }
  </script>
  
  <div 
    class="learning-map"
    bind:this={container}
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    on:wheel={handleWheel}
  >
    {#if isLoading}
      <div class="loading-overlay">
        <div class="loading-spinner" />
        <span>Loading Learning Path...</span>
      </div>
    {:else}
      <svg class="connections-layer">
        {#each connections as conn}
          <path
            class="connection {conn.status}"
            d={conn.path}
            marker-end="url(#arrowhead)"
          />
        {/each}
        
        <!-- SVG Definitions -->
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
      </svg>
  
      <div 
        class="nodes-container"
        style="transform: translate({viewportOffset.x}px, {viewportOffset.y}px) scale({zoom})"
      >
        {#each pathData.nodes as node}
          <div
            class="node {node.type}"
            class:active={activeNode === node.id}
            class:completed={userProgress[node.id] === 100}
            class:in-progress={userProgress[node.id] > 0 && userProgress[node.id] < 100}
            data-node-id={node.id}
            bind:this={nodes.set(node.id, null)}
            on:click={() => handleNodeClick(node.id)}
            on:mouseenter={() => hoveredNode = node.id}
            on:mouseleave={() => hoveredNode = null}
          >
            <div class="node-icon">{node.icon}</div>
            <div class="node-content">
              <h4>{node.title}</h4>
              {#if userProgress[node.id]}
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    style="width: {userProgress[node.id]}%"
                  />
                </div>
              {/if}
            </div>
  
            {#if hoveredNode === node.id}
              <div class="node-tooltip" transition:fade>
                <h5>{node.title}</h5>
                <p>{node.description}</p>
                <div class="stats">
                  <span>🎯 {node.estimatedHours}h</span>
                  <span>📚 {node.resourceCount} resources</span>
                  <span>👥 {node.activeUsers} learning</span>
                </div>
                {#if node.prerequisites?.length}
                  <div class="prerequisites">
                    <h6>Prerequisites:</h6>
                    <ul>
                      {#each node.prerequisites as prereq}
                        <li class={userProgress[prereq.id] === 100 ? 'completed' : ''}>
                          {prereq.title}
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
  
      <!-- Controls -->
      <div class="map-controls">
        <button on:click={() => zoom = Math.min(2, zoom * 1.2)}>
          <span class="icon">🔍+</span>
        </button>
        <button on:click={() => zoom = Math.max(0.5, zoom * 0.8)}>
          <span class="icon">🔍-</span>
        </button>
        <button on:click={() => {
          viewportOffset = { x: 0, y: 0 };
          zoom = 1;
        }}>
          <span class="icon">⟲</span>
        </button>
      </div>
    {/if}
  </div>
  
  <style lang="postcss">
    .learning-map {
      @apply relative w-full h-[600px] overflow-hidden
             bg-base-200 rounded-xl border border-base-300;
    }
  
    .connections-layer {
      @apply absolute inset-0 pointer-events-none;
  
      .connection {
        @apply fill-none stroke-2 transition-all;
  
        &.completed {
          @apply stroke-success;
        }
  
        &.available {
          @apply stroke-primary;
        }
  
        &.locked {
          @apply stroke-base-300;
        }
      }
    }
  
    .nodes-container {
      @apply absolute inset-0 transition-transform;
    }
  
    .node {
      @apply absolute flex items-center gap-3 p-3
             bg-base-100 rounded-xl shadow-md
             border-2 border-transparent
             cursor-pointer transition-all
             hover:shadow-lg hover:scale-105;
  
      &.completed {
        @apply border-success bg-success/10;
      }
  
      &.in-progress {
        @apply border-primary bg-primary/10;
      }
  
      &.active {
        @apply ring-2 ring-primary ring-offset-2;
      }
  
      .node-icon {
        @apply text-2xl;
      }
  
      .node-content {
        @apply flex flex-col min-w-[150px];
  
        h4 {
          @apply font-medium;
        }
      }
  
      .progress-bar {
        @apply mt-2 h-1 bg-base-200 rounded-full overflow-hidden;
  
        .progress-fill {
          @apply h-full bg-primary transition-all;
        }
      }
    }
  
    .node-tooltip {
      @apply absolute top-full left-0 mt-2 p-4
             bg-base-100 rounded-xl shadow-xl
             border border-base-300
             w-64 z-10;
  
      h5 {
        @apply text-lg font-semibold mb-2;
      }
  
      p {
        @apply text-sm text-base-content/80 mb-3;
      }
  
      .stats {
        @apply flex flex-wrap gap-3 text-sm text-base-content/60 mb-3;
      }
  
      .prerequisites {
        @apply text-sm;
  
        h6 {
          @apply font-medium mb-1;
        }
  
        ul {
          @apply space-y-1;
        }
  
        li {
          @apply flex items-center gap-2;
  
          &.completed {
            @apply text-success;
            &::before {
              content: "✓";
            }
          }
        }
      }
    }
  
    .map-controls {
      @apply absolute bottom-4 right-4
             flex gap-2 p-2
             bg-base-100 rounded-lg shadow-lg;
  
      button {
        @apply p-2 rounded-lg
               hover:bg-base-200 transition-colors;
      }
    }
  
    .loading-overlay {
      @apply absolute inset-0
             flex flex-col items-center justify-center
             bg-base-200/80 backdrop-blur-sm;
  
      .loading-spinner {
        @apply w-8 h-8 border-4 border-primary
               border-t-transparent rounded-full
               animate-spin mb-4;
      }
    }
  </style>
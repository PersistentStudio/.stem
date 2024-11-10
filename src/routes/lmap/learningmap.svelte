<script lang="ts">
    import LearningPathMap from '$components/learning/LearningPathMap.svelte';
    import { stemCore } from '$lib/core';
    
    export let data;
    const { domainPath } = data;
    
    let userProgress = {};
    
    onMount(async () => {
      userProgress = await stemCore.getUserProgress(domainPath);
    });
  </script>
  
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Your Learning Journey</h1>
    
    <LearningPathMap
      {domainPath}
      {userProgress}
      on:nodeSelect={({ detail }) => {
        // Handle node selection
        console.log('Selected node:', detail.nodeId);
      }}
    />
  </div>
<script lang="ts">
    import LearningPathMap from '$components/learning/LearningPathMap.svelte';
    import StemCore from '@/lib/stemcore';
    import { onMount } from 'svelte';
    
    export let data: { domainPath: string } = { domainPath: "" };
    const { domainPath } = data;
    
    let userProgress = {};
    
    onMount(async () => {
      userProgress = await StemCore.getUserProgress(domainPath);
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
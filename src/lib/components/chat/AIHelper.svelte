<script lang="ts">
    export let aiResponse: string;
  
    // You can add more functionality or props as needed
  </script>
  
  <div class="ai-helper">
    <p>{aiResponse}</p>
  </div>
  
  <style lang="postcss">
    .ai-helper {
      @apply p-4 bg-green-100 rounded-lg;
    }
  </style>
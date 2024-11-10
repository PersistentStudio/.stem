<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let posts: Array<{ id: string; title: string; content: string }>;
  
    const dispatch = createEventDispatcher();
  
    function createNewPost(post: any) {
      dispatch('createNew', post);
    }
  </script>
  
  <div class="related-posts">
    <h2>Related Posts</h2>
    <div class="posts-list">
      {#each posts as post (post.id)}
        <button class="post-item" on:click={() => createNewPost(post)}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </button>
      {/each}
    </div>
  </div>
  
  <style lang="postcss">
    .related-posts {
      @apply p-4 bg-base-200 rounded-lg;
    }
  
    .posts-list {
      @apply space-y-2;
    }
  
    .post-item {
      @apply p-2 border-b border-base-300 cursor-pointer;
    }
  
    .post-item:hover {
      @apply bg-gray-100;
    }
  </style>
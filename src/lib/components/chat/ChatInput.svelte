<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let disabled: boolean = false;
    export let context: any;
  
    const dispatch = createEventDispatcher();
    let inputMessage: string = '';
  
    function sendMessage() {
      if (inputMessage.trim()) {
        dispatch('send', inputMessage);
        inputMessage = '';
      }
    }
  </script>
  
  <div class="chat-input">
    <input
      type="text"
      bind:value={inputMessage}
      placeholder="Type your message..."
      on:keydown={(e) => e.key === 'Enter' && sendMessage()}
      disabled={disabled}
      class="input-field"
    />
    <button on:click={sendMessage} disabled={disabled}>Send</button>
  </div>
  
  <style lang="postcss">
    .chat-input {
      @apply flex items-center p-2 border-t border-base-300;
    }
  
    .input-field {
      @apply flex-1 p-2 border rounded-lg;
    }
  
    button {
      @apply ml-2 px-4 py-2 bg-primary text-white rounded-lg;
    }
  
    button:disabled {
      @apply bg-gray-400 cursor-not-allowed;
    }
  </style>
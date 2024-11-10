<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import EmojiPicker from '../shared/EmojiPicker.svelte';
    import FileUpload from '../shared/FileUpload.svelte';
  
    export let chatMode: 'general' | 'help' | 'study-group';
    export let replyTo: any = null;
    export let placeholder = 'Type a message...';
  
    const dispatch = createEventDispatcher();
    let message = '';
    let showEmojiPicker = false;
    let showFormatting = false;
    let isUploading = false;
    let attachments: any[] = [];
    let inputElement: HTMLTextAreaElement;
  
    let typingTimeout: NodeJS.Timeout;
  
    function handleInput() {
      // Auto-resize textarea
      inputElement.style.height = 'auto';
      inputElement.style.height = `${inputElement.scrollHeight}px`;
  
      // Emit typing status
      clearTimeout(typingTimeout);
      dispatch('typing', true);
      typingTimeout = setTimeout(() => dispatch('typing', false), 1000);
    }
  
    async function handleSubmit() {
      if (!message.trim() && !attachments.length) return;
  
      dispatch('send', {
        content: message,
        attachments,
        replyTo: replyTo?.id
      });
  
      message = '';
      attachments = [];
      inputElement.style.height = 'auto';
    }
  
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  
    function insertText(text: string) {
      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;
      message = 
        message.substring(0, start) + 
        text + 
        message.substring(end);
      
      // Move cursor after inserted text
      setTimeout(() => {
        inputElement.selectionStart = 
        inputElement.selectionEnd = start + text.length;
      });
    }
  </script>
  
  <div class="chat-input">
    {#if replyTo}
      <div class="reply-to" transition:fade>
        <span>Replying to {replyTo.author.name}</span>
        <button on:click={() => replyTo = null}>✕</button>
      </div>
    {/if}
  
    <div class="input-container">
      <!-- Formatting Toolbar -->
      {#if showFormatting}
        <div class="formatting-toolbar" transition:fade>
          <button on:click={() => insertText('**bold**')}>B</button>
          <button on:click={() => insertText('*italic*')}>I</button>
          <button on:click={() => insertText('`code`')}>{'<>'}</button>
          <button on:click={() => insertText('```\ncode block\n```')}>
            {'{ }'}
          </button>
          <button on:click={() => insertText('$math$')}>∑</button>
          <button on:click={() => insertText('[link](url)')}>🔗</button>
        </div>
      {/if}
  
      <!-- Main Input Area -->
      <div class="input-row">
        <button 
          class="format-toggle"
          on:click={() => showFormatting = !showFormatting}
        >
          Aa
        </button>
  
        <textarea
          bind:this={inputElement}
          bind:value={message}
          on:input={handleInput}
          on:keydown={handleKeydown}
          {placeholder}
          rows="1"
        />
  
        <button 
          class="emoji-toggle"
          on:click={() => showEmojiPicker = !showEmojiPicker}
        >
          😊
        </button>
  
        <FileUpload
          on:upload={(files) => attachments = [...attachments, ...files]}
          on:uploading={(status) => isUploading = status}
        />
  
        <button 
          class="send-button"
          disabled={isUploading || (!message.trim() && !attachments.length)}
          on:click={handleSubmit}
        >
          Send
        </button>
      </div>
  
      <!-- Attachments Preview -->
      {#if attachments.length}
        <div class="attachments-preview" transition:fade>
          {#each attachments as file}
            <div class="attachment">
              <span>{file.name}</span>
              <button on:click={() => {
                attachments = attachments.filter(f => f !== file);
              }}>
                ✕
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  
    {#if showEmojiPicker}
      <div class="emoji-picker" transition:fade>
        <EmojiPicker 
          on:select={(emoji) => {
            insertText(emoji);
            showEmojiPicker = false;
          }}
        />
      </div>
    {/if}
  </div>
  
  <style lang="postcss">
    .chat-input {
      @apply p-4 border-t border-base-300 relative;
    }
  
    .reply-to {
      @apply flex items-center justify-between
             px-4 py-2 mb-2 rounded-lg
             bg-base-200 text-sm;
    }
  
    .input-container {
      @apply space-y-2;
    }
  
    .formatting-toolbar {
      @apply flex items-center gap-2 p-2
             bg-base-200 rounded-lg;
  
      button {
        @apply p-2 rounded-lg
               hover:bg-base-300 transition-colors;
      }
    }
  
    .input-row {
      @apply flex items-end gap-2;
  
      textarea {
        @apply flex-1 p-3 rounded-lg
               bg-base-200 resize-none
               min-h-[2.5rem] max-h-[10rem]
               focus:outline-none focus:ring-2
               focus:ring-primary;
      }
  
      button {
        @apply p-3 rounded-lg
               hover:bg-base-200 transition-colors;
  
        &.send-button {
          @apply bg-primary text-primary-content
                 hover:bg-primary-focus
                 disabled:opacity-50
                 disabled:cursor-not-allowed;
        }
      }
    }
  
    .attachments-preview {
      @apply flex flex-wrap gap-2;
  
      .attachment {
        @apply flex items-center gap-2 px-3 py-1
               bg-base-200 rounded-full text-sm;
  
        button {
          @apply ml-2 opacity-60 hover:opacity-100;
        }
      }
    }
  
    .emoji-picker {
      @apply absolute bottom-full right-0 mb-2;
    }
  </style>
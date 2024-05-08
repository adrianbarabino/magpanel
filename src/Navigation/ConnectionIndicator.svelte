<!-- src/ConnectionIndicator.svelte -->
<script>
    import { isOnline } from '../stores.js';
  </script>
  
  <div class="connection-indicator" class:online={$isOnline}></div>
  

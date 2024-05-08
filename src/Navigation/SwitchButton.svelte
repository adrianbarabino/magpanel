<script>
    import { darkMode } from "../routes";

function toggle() {
    let currentMode = $darkMode;
    darkMode.set(!currentMode);
    window.document.body.classList.toggle('dark-mode');
}
</script>

<button class="ml-1 btn btn-text dmSwitch" on:click={toggle}>
    {#if darkMode}
        <i class="fas fa-sun"></i>
    {:else}
        <i class="fas fa-moon"></i>
    {/if}
</button>

<style>
    button {
        background-color: #f76027;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem;
        text-transform: uppercase;
    }
    :global(body.dark-mode) button {
        background-color: #0084f6;
        color: white;
    }
</style>
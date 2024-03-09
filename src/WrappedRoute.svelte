<script>
    import { Route } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { getContext } from 'svelte';
  
    export let path;
    export let component;
    export let title;
    export let slug;
  
    const Component = component;
  
    onMount(() => {
      document.title = title; // Actualiza el título
      document.body.className = ''; // Limpia las clases anteriores
      document.body.classList.add(slug); // Agrega el nuevo slug como clase
    });
  </script>
  
  <Route path={path} let:params>
    <svelte:component this={Component} {params} />
  </Route>
  
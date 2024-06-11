<script>
    import { onMount, onDestroy } from 'svelte';
    import flatpickr from 'flatpickr';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let id;
    export let name;
    export let value; // No se asigna un valor predeterminado aquí
  
    let inputElement;
    let fpInstance;
  
    onMount(() => {
      // Si no se proporciona un valor, se utiliza la fecha y hora actuales
      if (value === undefined || value === '') {
        const now = new Date();
        value = flatpickr.formatDate(now, "Y-m-d H:i");
      }
  
      fpInstance = flatpickr(inputElement, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate: value,
        onChange: (selectedDates, dateStr) => {
          value = dateStr; // Asegura que el valor se actualice con la entrada del usuario
        }
      });
    });
    function handleChannge(event) {
        console.log(event.target.value)
      value = event.target.value;
      dispatch('change', value); // Dispara un evento personalizado para notificar a los padres
    }
    onDestroy(() => {
      if (fpInstance) {
        fpInstance.destroy(); // Limpia la instancia al desmontar el componente
      }
    });
  </script>
  
  <input type="text" on:change={handleChannge} bind:this={inputElement} {id} {name} class="form-control" bind:value={value} />
  
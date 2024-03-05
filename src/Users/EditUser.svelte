<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition'; // Importa la transición slide

    import { broteNavigate } from '../utils/navigation'; // Usa navigate para la navegación
    const checkPassword = (password, confirmPassword) => {
    if (!password) { return 'La contraseña no puede estar vacía'; }
    if (password !== confirmPassword) { return 'Las contraseñas no coinciden'; }
    if (password.length < 8) { return 'La contraseña debe tener al menos 8 caracteres'; }
    if (!/[a-z]/.test(password)) { return 'La contraseña debe contener al menos una letra minúscula'; }
    if (!/[A-Z]/.test(password)) { return 'La contraseña debe contener al menos una letra mayúscula'; }
    if (!/\d/.test(password)) { return 'La contraseña debe contener al menos un número'; }
    for (let i = 0; i < password.length - 3; i++) {
      if (password[i] === password[i+1] && password[i+1] === password[i+2] && password[i+2] === password[i+3]) {
        return 'La contraseña no puede contener 4 caracteres iguales consecutivos';
      }
    }
    for (let i = 0; i < password.length - 3; i++) {
      if (password.charCodeAt(i) + 1 === password.charCodeAt(i+1) &&
          password.charCodeAt(i+1) + 1 === password.charCodeAt(i+2) &&
          password.charCodeAt(i+2) + 1 === password.charCodeAt(i+3)) {
        return 'La contraseña no puede contener 4 caracteres consecutivos';
      }
    }

    return true;
  };
  let passwordError = ''; // Añade esta variable para almacenar el mensaje de error

  $: {
    if (user.verify_password) {
      passwordStrength = 0;
      if (/[a-z]/.test(user.verify_password)) passwordStrength++;
      if (/[A-Z]/.test(user.verify_password)) passwordStrength++;
      if (/\d/.test(user.verify_password)) passwordStrength++;
      if (user.verify_password.length >= 8) passwordStrength++;
    } else {
      passwordStrength = 0;
    }
  }

  export let id; // ID del usuario para editar
  let verifyPassword = false;
  let originalPassword = '';
  let passwordStrength = 0; // 0 a 4

  let user = {
    name: '',
    username: '',
    rank: '0',
    email: '',
    password_hash: '',
    verify_password: ''
  };

    let isLoading = true; // Añade esta variable para controlar el estado de carga

onMount(async () => {
    try {
      // Si la contraseña no ha cambiado, la establecemos a una cadena vacía
      if (user.password_hash === originalPassword) {
        user.password_hash = '';
      }

      const response = await fetch(`https://api.mag-servicios.com/users/${id}`, {
        headers: {
          'Authorization': 'token-secreto',
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del usuario');
      }

      user = await response.json();
      console.log(user);
      user.rank = user.rank.toString(); // Convierte el rango a una cadena

      originalPassword = user.password_hash;

    isLoading = false; // Establece isLoading en false una vez que los datos están cargados

    } catch (error) {
      console.error(error.message);
    }
  });
  $: if (user.password_hash !== originalPassword) {
    verifyPassword = true;
  } else {
    verifyPassword = false;
  }

  let passwordStatus = 'valid form-control'; // 'valid', 'invalid', or ''

  $: {
    if (user.verify_password || user.password_hash !== originalPassword) {
      const passwordCheck = checkPassword(user.password_hash, user.verify_password);
      if (passwordCheck === true) {
        passwordStatus = 'valid form-control';
        passwordError = '';
      } else {
        passwordStatus = 'invalid form-control';
        passwordError = passwordCheck;
      }
    } else {
      passwordStatus = '';
      passwordError = '';
    }
  }

  const saveUser = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      // Manejo post actualización exitosa, p.ej., redireccionar al usuario
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const submitForm = async () => {
    try {
      const response = await fetch(`https://api.mag-servicios.com/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token-secreto'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      // Manejar la respuesta exitosa
      console.log('Usuario actualizado con éxito');
                broteNavigate('/');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Editar Usuario <small class="text-muted">Editar un nuevo usuario</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={() => broteNavigate('/users')}>Usuarios</a></li>
    <li class="breadcrumb-item active" aria-current="page">Editar</li>
  </ol>
</nav>
<form on:submit|preventDefault={submitForm}>
  <div class="form-group">
    <label for="name">Nombre</label>
    <input id="name" class="form-control" type="text" bind:value={user.name} required>
  </div>
  
  <div class="form-group">
    <label for="username">Usuario</label>
    <input id="username" class="form-control" type="text" bind:value={user.username} required>
  </div>
  
  <div class="form-group">
    <label for="rank">Rango</label>
    <select id="rank" class="form-control" bind:value={user.rank}>
      <option value="0">Empleado</option>
      <option value="1">Supervisor</option>
      <option value="2">Administrador</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" class="form-control" type="email" bind:value={user.email} required>
  </div>
  
  <div class="form-group">
    <label for="password">Contraseña</label>
    <input id="password" class="form-control" type="password" bind:value={user.password_hash}>
  </div>
  
{#if verifyPassword}
<div class="form-group" transition:slide={{duration: 300}}>
  <label for="verifyPassword">Confirmar nueva contraseña</label>
  <input id="verifyPassword" class={passwordStatus}  type="password" bind:value={user.verify_password}>
  {#if passwordStatus === 'invalid form-control'}
  <small class="form-text text-danger">{passwordError}</small>
  {/if}
  <div class="progress">
    <div class="progress-bar" style="width: {passwordStrength * 25}%"></div>
  </div>
</div>
{/if}

<style>
  .valid {
    border-color: green;
  }

  .invalid {
    border-color: red;
  }

  .progress {
    height: 10px;
    background-color: #f3f3f3;
  }

  .progress-bar {
    height: 100%;
    background-color: green;
  }
  .btn-primary:disabled {
  background-color: #cccccc;
  border-color: #cccccc;
}
</style>
  

<button type="submit" class="btn btn-primary" disabled={passwordStatus === 'invalid form-control'}>Actualizar Usuario</button>
</form>

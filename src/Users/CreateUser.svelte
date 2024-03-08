<script>
  import { slide } from 'svelte/transition'; // Importa la transición slide
  import Swal from 'sweetalert2';

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

  let verifyPassword = false;

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

    $: if (user.password_hash) {
    verifyPassword = true;
  } else {
    verifyPassword = false;
  }

  let passwordStatus = 'valid form-control'; // 'valid', 'invalid', or ''

  $: {
    if (user.verify_password) {
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

  const submitForm = async () => {
    try {
      user.rank = parseInt(user.rank);

      const response = await fetch('https://api.mag-servicios.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('accessToken') // Asegúrate de reemplazar 'Bearer '+localStorage.getItem('accessToken') con tu token real
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }

      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de usuarios
      console.log('Usuario creado con éxito');
Swal.fire({
        title: 'Usuario creado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
          broteNavigate('/users');

    } catch (error) {
      console.error(error.message);
    }
  };
</script>
<h1 class="mb-4">Crear Usuario <small class="text-muted">Crear un nuevo usuario</small></h1>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/users')}>Usuarios</a></li>
    <li class="breadcrumb-item active" aria-current="page">Agregar</li>
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

  <button type="submit" class="btn btn-primary" disabled={passwordStatus === 'invalid form-control'}>Crear Usuario</button>
</form>

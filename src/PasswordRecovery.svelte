<script>
    import { slide } from 'svelte/transition'; // Importa la transición slide
    import Swal from 'sweetalert2';
  
    import { broteNavigate } from './utils/navigation';
      
      
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
   
    let verify_password = '';

    // receive the token from the url
    export let token; // ID del usuario para editar


    $: {
      if (verify_password) {
        passwordStrength = 0;
        if (/[a-z]/.test(verify_password)) passwordStrength++;
        if (/[A-Z]/.test(verify_password)) passwordStrength++;
        if (/\d/.test(verify_password)) passwordStrength++;
        if (verify_password.length >= 8) passwordStrength++;
      } else {
        passwordStrength = 0;
      }
    }
  
    let confirmPassword = false;
  
    let passwordStrength = 0; // 0 a 4
  
    let newPassword = '';
  
      let isLoading = true; // Añade esta variable para controlar el estado de carga
  
      $: if (newPassword) {
      confirmPassword = true;
    } else {
      confirmPassword = false;
    }
  
    let passwordStatus = 'valid form-control'; // 'valid', 'invalid', or ''
  
    $: {
      if (verify_password) {
        const passwordCheck = checkPassword(newPassword, verify_password);
        if (passwordCheck === true) {
          passwordStatus = 'valid form-control';
          passwordError = '';
        } else {
          passwordStatus = 'invalid form-control';
          passwordError = passwordCheck;
        }
      } else {
        passwordStatus = 'form-control';
        passwordError = '';
      }
    }
  
    const submitForm = async () => {
      try {
        const user = {
          token: token,
          newPassword: newPassword
        };
  
        const response = await fetch('https://api.mag-servicios.com/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user)
        });
  
        if (!response.ok) {
          throw new Error('Error al crear el usuario');
        }
  
        // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario a la lista de usuarios
        console.log('Usuario modificado con éxito');
  Swal.fire({
          title: 'Contraseña modificada con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',

        }).then((result) => {
        if (result.isConfirmed) {
            broteNavigate('/users');
        }
    });

      } catch (error) {
        console.error(error.message);
      }
    };
  </script>

<h2 class="mb-4">Recuperación de Contraseña</h2>  

  <form on:submit|preventDefault={submitForm}>
    
    
    <div class="form-group">
      <label for="username">Token</label>
      <input id="username" class="form-control" type="text" bind:value={token} required>
    </div>
    
    <div class="form-group">
      <label for="password">Contraseña</label>
      <input id="password" class="form-control" type="password" bind:value={newPassword}>
    </div>
    
  {#if confirmPassword}
  <div class="form-group" transition:slide={{duration: 300}}>
    <label for="confirmPassword">Confirmar nueva contraseña</label>
    <input id="confirmPassword" class={passwordStatus}  type="password" bind:value={verify_password}>
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
  
    <button type="submit" class="btn btn-primary" disabled={passwordStatus === 'invalid form-control'}>Cambiar contraseña</button>
  </form>
  
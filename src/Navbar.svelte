<script>
  import { broteNavigate } from './utils/navigation';
  import { username } from './routes';
	import SwitchButton from './SwitchButton.svelte'

  // generar distintos greetings dependiendo de la hora del día, para que el saludo sea más amigable, varias opciones
  let greeting = '';
  let date = new Date();
  let hour = date.getHours();
  let allGreetings = [];
  
if (hour < 12) {
    allGreetings = [
        `¡Buen día, ${username}!`,
        `¡Hola, ${username}!`,
        `¿Cómo amaneciste, ${username}?`,
        `¡Genial verte, ${username}!`,
        `¡Vamos arrancando, ${username}!`
    ];
} else if (hour < 18) {
    allGreetings = [
        `¡Buenas, ${username}!`,
        `¡Hola, ${username}!`,
        `¿Cómo va la tarde, ${username}?`,
        `¡Excelente verte, ${username}!`,
        `¡A seguir, ${username}!`
    ];
} else {
    allGreetings = [
        `¡Buenas noches, ${username}!`,
        `¡Hola, ${username}!`,
        `¿Cómo te trata la noche, ${username}?`,
        `¡Bueno verte, ${username}!`,
        `¡A relajarse, ${username}!`,
        `¡A descansar, ${username}!`
    ];
}
greeting = allGreetings[Math.floor(Math.random() * allGreetings.length)];

</script>

        <nav class="navbar navbar-expand-lg fixed-top  navbar-dark bg-dark">
          <div class="container-fluid">
           <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')} class="logo">
                <figure>
                    <img src="https://mag-servicios.com/wp-content/uploads/2019/10/04-Blanco-800x362.png" height="40" alt="">
                </figure>
            </a>


            <button class="btn btn-dark d-inline-block d-lg-none ms-auto" type="button" id="sidebarCollapseTop" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fa fa-bars"></i>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="nav navbar-nav ms-auto">
                <li class="nav-item active">
                    <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')} class="nav-link">Panel de Control</a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-client')} class="nav-link">Crear cliente</a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-contact')} class="nav-link">Crear contacto</a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-provider')} class="nav-link">Crear proveedor</a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/create-project')} class="nav-link">Crear proyecto</a>
                </li>
                
              </ul>
             
            </div>
            
            {#if username}
            <div class="greeting text-white">
              <span>{greeting}
                
              <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/logout')} class="text-white 
                  badge bg-danger">Salir</a>
              </span>
            </div>  
            
            <div>
              <SwitchButton></SwitchButton>
            </div>
            {/if}
          </div>
        </nav>
<style>
body{
	padding:0;
}
</style>

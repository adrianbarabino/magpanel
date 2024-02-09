<script>
  import { navigate } from 'svelte-routing';
</script>

        <nav class="navbar navbar-expand-lg fixed-top  navbar-dark bg-dark">
          <div class="container-fluid">
           <a href="javascript:void(0);" on:click={() => navigate('/')} class="logo">
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
                    <a href="javascript:void(0);" on:click={() => navigate('/')} class="nav-link">Panel de Control</a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0);" on:click={() => navigate('/create-client')} class="nav-link">Crear cliente</a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0);" on:click={() => navigate('/create-project')} class="nav-link">Crear proyecto</a>
                </li>
                
              </ul>
            </div>
          </div>
        </nav>
<style>
body{
	padding:0;
}
</style>

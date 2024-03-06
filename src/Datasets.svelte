<script>
    import { broteNavigate } from './utils/navigation';
  </script>
<style>

</style>

<div class="container mt-4">
    <h1 class="mb-4">Tablas <small class="text-muted"> Explorá la base de datos 
    </small></h1>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/')}>Inicio</a></li>
          <li class="breadcrumb-item active" aria-current="page">Tablas</li>
        </ol>
      </nav>
    <div class="welcome-section">

        
        <div class="features">
            <div class="container">
                <div class="row">
                  <a href="javascript:void(0);" on:click={() => broteNavigate('/logs')}  class="col-4 bg-primary text-white text-center py-3">
                    
                      <span class="fa fa-clipboard-list"></span> Registros
                    </a>
                  
                  <a href="javascript:void(0);" on:click={() => broteNavigate('/users')}  class="col-8 bg-warning text-black text-center py-3">
                    
                      <span class="fa fa-user"></span> Usuarios
                    </a>
                    <a href="javascript:void(0);" on:click={() => broteNavigate('/project-statuses')}  class="col-4 bg-info text-white text-center py-3">
                        
                        <span class="fa fa-tag"></span> Estados de Proyectos
                      </a>
                  <a href="javascript:void(0);" on:click={() => broteNavigate('/categories')}  class="col-5 bg-success text-white text-center py-3">
                    
                      <span class="fa fa-tags"></span> Categorías
                    </a>

                    <a href="javascript:void(0);" on:click={() => broteNavigate('/locations')}  class="col-3 bg-danger text-white text-center py-3">
                      
                        <span class="fa fa-map"></span> Ubicaciones
                      </a>
                  
                      
                  
                </div>
              </div>
        </div>
    </div>
</div>

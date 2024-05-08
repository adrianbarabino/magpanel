<script>
      import { onMount } from 'svelte';
  import { broteNavigate } from '../utils/navigation';
  let projects = [];
  onMount(async () => {
            // Do the fetch with the access token
            const projectsResponse = await fetch('https://api.mag-servicios.com/projects?limit=3', {
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('accessToken')
                }
            });



            if (!projectsResponse.ok) {
                throw new Error('Hubo un problema al cargar los datos');
            }

            projects = await projectsResponse.json();
        
    });

</script>

    <nav id="sidebar" class=" ">
   

            
                <ul class="list-unstyled components ">
                    <li>
                    
                        <a href="/home" on:click={(event) =>  broteNavigate('/home', {}, event)}><span class="fa fa-home"></span> Escritorio</a>
                    </li>
                    <li>
                    
                        <a href="/clients" on:click={(event) =>  broteNavigate('/clients', {}, event)}><span class="fa fa-users"></span> Clientes</a>
                    </li>
                    <li>
                        <a href="/contacts" on:click={(event) =>  broteNavigate('/contacts', {}, event)}><span class="fa fa-vcard"></span> Contactos</a>
                    </li>

                    <li>
                        <a href="/providers" on:click={(event) =>  broteNavigate('/providers', {}, event)}><span class="fa fa-helmet-safety"></span> Proveedores</a>
                    </li>

                    <li>
                        <a href="/projects" on:click={(event) =>  broteNavigate('/projects', {}, event)}><span class="fa fa-briefcase"></span> Proyectos</a>
                    </li>
                    <!-- <li>
                        <a href="/categories" on:click={(event) =>  broteNavigate('/categories', {}, event)}><span class="fa fa-tags"></span> Categorías</a>
                    </li>
                    <li>
                        <a href="/locations" on:click={(event) =>  broteNavigate('/locations', {}, event)}><span class="fa fa-map"></span> Ubicaciones</a>
                    </li> -->
                    <li>
                        <a href="/datasets" on:click={(event) =>  broteNavigate('/datasets', {}, event)}><span class="fa fa-database"></span> Tablas</a>
                    </li>
   
                    <!-- <li>
                        <a href="/logs"><span class="fa fa-clipboard-list"></span> Registros</a>
                    </li>
                    <li>
                        <a href="/users"><span class="fa fa-user"></span> Usuarios</a>
                    </li> -->
                    <li>
                        <a href="/settings" on:click={(event) =>  broteNavigate('/settings', {}, event)}><span class="fa fa-cog"></span> Ajustes</a>
                    </li>
                    <li>
                        <a href="/logout" on:click={(event) =>  broteNavigate('/logout', {}, event)}><span class="fa fa-sign-out-alt"></span> Salir</a>
                    </li>
                    <li>
                        
                    <button type="button" id="sidebarCollapse" class="btn btn-primary fixed-bottom">
                        <i class="fa fa-bars"></i>
                        <span class="sr-only">Toggle Menu</span>
                      </button></li>
                </ul>
                <div class="latest-projects">
                    <h4>Últimos Proyectos</h4>
                    <ul>
                        {#if projects.length === 0}
                        {#each [1, 2, 3] as project}
                        <li>
                            <a href="#" class="skeleton-link">
                                <span class="skeleton-text">Cargando...</span>
                            </a>
                        </li>
                              
                        {/each}
                          
                          {:else}
                      {#each projects as project}
                        <li>
                          <a href={`/view-project/${project.id}`} on:click={(event) => broteNavigate(`/view-project/${project.id}`, {}, event)}>
                            {project.name}
                          </a>
                        </li>
                      {/each}
                      {/if}
                    </ul>
                  </div>
                <div class="footer">
                    <p>
                    </p>
                </div>
            </nav>


        
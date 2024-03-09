<script>
  import { broteNavigate } from './utils/navigation';
</script>

    <nav id="sidebar" class=" ">
                <ul class="list-unstyled components ">
                    <li>
                    
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/clients')}><span class="fa fa-users"></span> Clientes</a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/contacts')}><span class="fa fa-vcard"></span> Contactos</a>
                    </li>

                    <li>
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/providers')}><span class="fa fa-helmet-safety"></span> Proveedores</a>
                    </li>

                    <li>
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/projects')}><span class="fa fa-briefcase"></span> Proyectos</a>
                    </li>
                    <!-- <li>
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/categories')}><span class="fa fa-tags"></span> Categorías</a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/locations')}><span class="fa fa-map"></span> Ubicaciones</a>
                    </li> -->
                    <li>
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/datasets')}><span class="fa fa-database"></span> Tablas</a>
                    </li>
   
                    <!-- <li>
                        <a href="/logs"><span class="fa fa-clipboard-list"></span> Registros</a>
                    </li>
                    <li>
                        <a href="/users"><span class="fa fa-user"></span> Usuarios</a>
                    </li> -->
                    <li>
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/settings')}><span class="fa fa-cog"></span> Ajustes</a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" on:click={(event) =>  broteNavigate('/logout')}><span class="fa fa-sign-out-alt"></span> Salir</a>
                    </li>
                    <li>
                        
                    <button type="button" id="sidebarCollapse" class="btn btn-primary fixed-bottom">
                        <i class="fa fa-bars"></i>
                        <span class="sr-only">Toggle Menu</span>
                      </button></li>
                </ul>
            
                <div class="footer">
                    <p>
                        Copyright &copy;2024 Todos los derechos reservados. MAG-Servicios
                    </p>
                </div>
            </nav>


        
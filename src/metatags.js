// src/metatags.js
import { pageMeta } from './stores.js';

export function updateMeta(route) {
  console.log("Cambiamos la ruta: " + route);
  // Definir una función para extraer la ruta base
  function getBaseRoute(route) {
    // Expresión regular que busca segmentos de ruta y excluye números o parámetros al final
    const baseRouteMatch = route.match(/\/[a-z-]+(?:\/[a-z-]+)*(?=\/\d+|$)/);
    return baseRouteMatch ? baseRouteMatch[0] : route;
  }
  
  const baseRoute = getBaseRoute(route);
  console.log("Cambiamos la ruta: " + baseRoute);

  const metatags = {
    '/': {
        title: 'Inicio - MAG Servicios',
        slug: 'inicio',
        description: 'Página principal del Panel de Gestión de MAG Servicios, tu solución integral para la gestión empresarial.',
        keywords: 'MAG Servicios, gestión empresarial, panel de control, inicio'
      },
      '/home': {
        title: 'Inicio - MAG Servicios',
        slug: 'inicio',
        description: 'Accede al resumen de tu actividad y gestiona tu negocio de manera eficiente con MAG Servicios.',
        keywords: 'resumen, actividad empresarial, MAG Servicios'
      },
      '/clients': {
        title: 'Clientes - MAG Servicios',
        slug: 'clientes',
        description: 'Gestiona tu cartera de clientes y mantiene toda la información importante a mano con MAG Servicios.',
        keywords: 'clientes, gestión de clientes, MAG Servicios'
      },
      '/create-client': {
        title: 'Crear Cliente - MAG Servicios',
        slug: 'crear-cliente',
        description: 'Añade nuevos clientes a tu cartera y expande tu negocio con MAG Servicios.',
        keywords: 'nuevo cliente, añadir cliente, MAG Servicios'
      },
      '/edit-client': {
        title: 'Editar Cliente - MAG Servicios',
        slug: 'editar-cliente',
        description: 'Actualiza la información de tus clientes para mantener tus registros precisos y al día con MAG Servicios.',
        keywords: 'editar cliente, actualizar cliente, MAG Servicios'
      },
      '/view-client': {
        title: 'Ver Cliente - MAG Servicios',
        slug: 'ver-cliente',
        description: 'Consulta detalladamente la información de cada cliente en tu cartera con MAG Servicios.',
        keywords: 'detalle cliente, información cliente, MAG Servicios'
      },
      '/projects': {
        title: 'Proyectos - MAG Servicios',
        slug: 'proyectos',
        description: 'Gestiona tus proyectos y sigue el progreso de cada uno para asegurar la entrega a tiempo con MAG Servicios.',
        keywords: 'gestión de proyectos, proyectos, MAG Servicios'
      },
      '/create-project': {
        title: 'Crear Proyecto - MAG Servicios',
        slug: 'crear-proyecto',
        description: 'Inicia nuevos proyectos y asigna recursos con facilidad usando MAG Servicios.',
        keywords: 'nuevo proyecto, iniciar proyecto, MAG Servicios'
      },
      '/edit-project': {
        title: 'Editar Proyecto - MAG Servicios',
        slug: 'editar-proyecto',
        description: 'Ajusta los detalles y recursos de tus proyectos para adaptarte a cualquier cambio con MAG Servicios.',
        keywords: 'editar proyecto, ajustar proyecto, MAG Servicios'
      },
      '/view-project': {
        title: 'Ver Proyecto - MAG Servicios',
        slug: 'ver-proyecto',
        description: 'Obtén una visión completa de cada proyecto y su estado actual con MAG Servicios.',
        keywords: 'detalle proyecto, estado proyecto, MAG Servicios'
      },
      '/categories': {
        title: 'Categorías - MAG Servicios',
        slug: 'categorias',
        description: 'Organiza tus proyectos y clientes en categorías para una gestión más eficiente con MAG Servicios.',
        keywords: 'categorías, organización, MAG Servicios'
      },
      '/create-category': {
        title: 'Crear Categoría - MAG Servicios',
        slug: 'crear-categoria',
        description: 'Define nuevas categorías para segmentar mejor tus proyectos y clientes con MAG Servicios.',
        keywords: 'nueva categoría, añadir categoría, MAG Servicios'
      },
      '/edit-category': {
        title: 'Editar Categoría - MAG Servicios',
        slug: 'editar-categoria',
        description: 'Actualiza tus categorías para reflejar cambios en tu estrategia de gestión con MAG Servicios.',
        keywords: 'editar categoría, actualizar categoría, MAG Servicios'
      },
      '/view-category': {
        title: 'Ver Categoría - MAG Servicios',
        slug: 'ver-categoria',
        description: 'Consulta los detalles y proyectos asociados a cada categoría en MAG Servicios.',
        keywords: 'detalle categoría, proyectos por categoría, MAG Servicios'
      },
      '/locations': {
        title: 'Ubicaciones - MAG Servicios',
        slug: 'ubicaciones',
        description: 'Gestiona las ubicaciones de tus proyectos y oficinas para mantener a tu equipo sincronizado con MAG Servicios.',
        keywords: 'ubicaciones, gestión de ubicaciones, MAG Servicios'
      },
      '/create-location': {
        title: 'Crear Ubicación - MAG Servicios',
        slug: 'crear-ubicacion',
        description: 'Añade nuevas ubicaciones a tu sistema para ampliar el alcance de tus operaciones con MAG Servicios.',
        keywords: 'nueva ubicación, añadir ubicación, MAG Servicios'
      },
      '/edit-location': {
        title: 'Editar Ubicación - MAG Servicios',
        slug: 'editar-ubicacion',
        description: 'Actualiza la información de tus ubicaciones para mantener a tu equipo informado con MAG Servicios.',
        keywords: 'editar ubicación, actualizar ubicación, MAG Servicios'
      },
      '/view-location': {
        title: 'Ver Ubicación - MAG Servicios',
        slug: 'ver-ubicacion',
        description: 'Visualiza los detalles de cada ubicación para asegurar una coordinación efectiva con MAG Servicios.',
        keywords: 'detalle ubicación, información ubicación, MAG Servicios'
      },
      '/project-statuses': {
        title: 'Estados de Proyecto - MAG Servicios',
        slug: 'estados-proyecto',
        description: 'Controla los estados de tus proyectos para seguir su avance y gestionar expectativas con MAG Servicios.',
        keywords: 'estados de proyecto, control de avance, MAG Servicios'
      },
      '/create-project-status': {
        title: 'Crear Estado de Proyecto - MAG Servicios',
        slug: 'crear-estado-proyecto',
        description: 'Define nuevos estados para tus proyectos y adapta tu gestión a cada fase con MAG Servicios.',
        keywords: 'nuevo estado proyecto, definir estado, MAG Servicios'
      },
      '/edit-project-status': {
        title: 'Editar Estado de Proyecto - MAG Servicios',
        slug: 'editar-estado-proyecto',
        description: 'Actualiza los estados de tus proyectos para reflejar cambios en su desarrollo con MAG Servicios.',
        keywords: 'editar estado proyecto, actualizar estado, MAG Servicios'
      },
      '/view-project-status': {
        title: 'Ver Estado de Proyecto - MAG Servicios',
        slug: 'ver-estado-proyecto',
        description: 'Consulta el estado actual de tus proyectos y planifica los siguientes pasos con MAG Servicios.',
        keywords: 'detalle estado proyecto, visualizar estado, MAG Servicios'
      },
      '/logout': {
        title: 'Cerrar Sesión - MAG Servicios',
        slug: 'cerrar-sesion',
        description: 'Cierra sesión de forma segura en el Panel de Gestión de MAG Servicios.',
        keywords: 'cerrar sesión, logout, MAG Servicios'
      }
  };

  console.log(metatags[baseRoute]);
  const meta = metatags[baseRoute] || {
    title: 'Título Predeterminado - MAG Servicios',
    slug: 'slug-predeterminado',
    description: 'Descripción predeterminada del Panel de Gestión de MAG Servicios.',
    keywords: 'MAG, servicios, gestión, predeterminado'
  };
  pageMeta.set(meta);
}

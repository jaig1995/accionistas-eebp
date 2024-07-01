import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { FinancieroComponent } from './modules/admin/financiero/financiero.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: '/inicio' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: '/inicio' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'inicio', loadChildren: () => import('app/modules/admin/inicio/inicio.routes') },
            { path: 'reset-password/:id', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            // * seguridad
            { path: 'seguridad/agregar-usuarios', loadChildren: () => import('app/modules/admin/seguridad/addusuario/addusuario.routes') },
            { path: 'seguridad/permisos-usuarios', loadChildren: () => import('app/modules/admin/seguridad/permisos/users.routes') },
            { path: 'seguridad/permisos-usuarios/detalles/:id', loadChildren: () => import('app/modules/admin/seguridad/detalles/detalles.routes') },
            { path: 'seguridad/permisos-usuarios/detalles/:id/asignar', loadChildren: () => import('app/modules/admin/seguridad/asignar-permiso/asignar-permiso.routes') },
            // * accionistas
            { path: 'accionistas/agregar', loadChildren: () => import('app/modules/admin/control-accionistas/addaccionista/addaccionista.routes') },
            { path: 'accionistas/agregar/autorizacion/:id', loadChildren: () => import('app/modules/admin/control-accionistas/autorizacion/autorizacion.routes') },
            { path: 'accionistas/informacion', loadChildren: () => import('app/modules/admin/control-accionistas/informacion-accionistas/informacion-accionistas.routes') },
            { path: 'accionistas/hojaderuta/:id', loadChildren: () => import('app/modules/admin/control-accionistas/hojaderuta/hojaderuta.routes') },
            { path: 'accionistas/registrar', loadChildren: () => import('app/modules/admin/control-accionistas/registraraccionista/registraraccionista.routes') },
            { path: 'accionistas/agregar/declaracion/:id', loadChildren: () => import('app/modules/admin/control-accionistas/declaracion/declaracion.routes') },
            { path: 'accionista/aprobar', loadChildren: () => import('app/modules/admin/control-accionistas/aprobaraccionista/aprobaraccionista.routes') },
            { path: 'accionista/modificar', loadChildren: () => import('app/modules/admin/control-accionistas/modificarapoderado/modificarapoderado.routes') },
            { path: 'accionistas/actualizar/autorizacion/:id', loadChildren: () => import('app/modules/admin/control-accionistas/actualizarautorizacion/actualizarautorizacion.routes') },
            { path: 'accionistas/actualizar/declaracion/:id', loadChildren: () => import('app/modules/admin/control-accionistas/actualizardeclaracion/actualizardeclaracion.routes') },
            { path: 'accionistas/actualizar', loadChildren: () => import('app/modules/admin/control-accionistas/modificaraccionista/modificaraccionista.routes') },
            // * Personas
            { path: 'persona/actualizar', loadChildren: () => import('app/modules/admin/seguridad/infopersonas/infopersonas.routes') },
            { path: 'persona/actualizar/:id', loadChildren: () => import('app/modules/admin/seguridad/actualizarinfopersona/actualizarinfopersona.routes') },
            // * Transacciones
            { path: 'transacciones/pendientes', loadChildren: () => import('app/modules/admin/transacciones/aprobacionespendientes/aprobacionespendientes.routes') },
            { path: 'transacciones/pendientes/:id', loadChildren: () => import('app/modules/admin/transacciones/aprobaciones/aprobaciones.routes') },
            // * Parametrización
            { path: 'parametrizacion', loadComponent: () => import('app/modules/admin/parametrizacion/parametrizacion.component').then(c => c.ParametrizacionComponent), title: "Parametrización General" },
            // * Titulos
            { path: 'titulo/registro', loadComponent: () => import('app/modules/admin/controlTitulos/titulosGeneral/titulosGeneral.component').then(c => c.TitulosGeneralComponent), title: "Información General de Títulos" },
            { path: 'acciones/transacciones', loadComponent: () => import('app/modules/admin/controlTitulos/gestionTitulos/gestionTitulos.component').then(c => c.GestionTitulosComponent), title: "Gestión de Títulos" },
            { path: 'acciones/aprobacion-control-interno', loadComponent: () => import('app/modules/admin/controlTitulos/aprobarTitulosControlInterno/aprobarControlInterno.component').then(c => c.AprobarControlInternoComponent), title: "Aprobación Control Interno" },
            { path: 'acciones/aprobacion-juridica', loadComponent: () => import('app/modules/admin/controlTitulos/aprobarJuridica/aprobarJuridica.component').then(c => c.AprobarJuridicaComponent), title: "Aprobación Juridica" },
            { path: 'acciones/aprobacion', loadComponent: () => import('app/modules/admin/controlTitulos/aprobarTitulos/aprobarTitulos.component').then(c => c.AprobarTitulosComponent), title: "Aprobación Gerencia" },
            { path: 'acciones/venta', loadComponent: () => import('app/modules/admin/controlTitulos/publicacionVentas/publicacionVentas.component').then(c => c.PublicacionVentasComponent), title: "Publicación de Títulos" },
            // * asamblea
            { path: 'asamblea/registrar-poderes', loadComponent: () => import('app/modules/admin/asamblea/registroPoderes/registroPoderes.component').then(c => c.RegistroPoderesComponent), title: "Registro De Poderes" },
            { path: 'asamblea/postulaciones', loadComponent: () => import('app/modules/admin/asamblea/postulaciones/postulaciones.component').then(c => c.PostulacionesComponent), title: "Postulaciones" },
            { path: 'asamblea/agregar', loadComponent: () => import('app/modules/admin/asamblea/crearAsamblea/crearAsamblea.component').then(c => c.default), title: "Crear Asamblea" },
            { path: 'asamblea/asistencia', loadComponent: () => import('app/modules/admin/asamblea/asistencia/asistencia.component').then(c => c.AsistenciaComponent), title: "Asistencia Asamblea" },
            { path: 'asamblea/crear-plantillas', loadComponent: () => import('app/modules/admin/asamblea/creacionPlantillas/creacionPlantillas.component').then(c => c.CreacionPlantillasComponent), title: "Crear Plantillas Preguntas" },
            { path: 'asamblea/votaciones', loadComponent: () => import('app/modules/admin/asamblea/votaciones/votaciones.component').then(c => c.VotacionesComponent), title: "Votaciones Asamblea" },
            { path: 'asamblea/quorum', loadComponent: () => import('app/modules/admin/asamblea/quorum/quorum.component').then(c => c.QuorumComponent), title: "Quorum" },
            { path: 'asamblea/resultados', loadComponent: () => import('app/modules/admin/asamblea/resultadoVotacion/resultadoVotacion.component').then(c => c.ResultadoVotacionComponent), title: "Resultados de la Votación" },
            { path: 'asamblea/cierre', loadComponent: () => import('app/modules/admin/asamblea/cierreAsamblea/cierreAsamblea.component').then(c => c.CierreAsambleaComponent), title: "Cierre de Asamblea" },
            { path: 'asamblea/votaciones-postulantes', loadComponent: () => import('app/modules/admin/asamblea/votacionPostulantes/votacionPostulantes.component').then(c => c.VotacionPostulantesComponent), title: "Votación Postulantes" },
            //Reportes
            { path: 'reportes', loadComponent: () => import('app/modules/admin/reportes/reportes/reportes.component').then(c => c.ReportesComponent), title: "Reportes Asamblea" },
            //Financiero
            { path: 'financiero', loadComponent: () => import('app/modules/admin/financiero/financiero.component').then(c => c.FinancieroComponent), title: "Reportes Asamblea" },

        ]
    }
];

import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: '/inicio'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: '/inicio'},

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
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')},
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
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
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
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
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
            {path: 'inicio', loadChildren: () => import('app/modules/admin/inicio/inicio.routes')},
            {path: 'reset-password/:id', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'seguridad/agregar-usuarios', loadChildren: () => import('app/modules/admin/seguridad/addusuario/addusuario.routes')},
            {path: 'seguridad/permisos-usuarios', loadChildren: () => import('app/modules/admin/seguridad/permisos/users.routes')},
            {path: 'seguridad/permisos-usuarios/detalles/:id', loadChildren: () => import('app/modules/admin/seguridad/detalles/detalles.routes')},
            {path: 'seguridad/permisos-usuarios/detalles/:id/asignar', loadChildren: () => import('app/modules/admin/seguridad/asignar-permiso/asignar-permiso.routes')},
            {path: 'accionistas/agregar', loadChildren: () => import('app/modules/admin/control-accionistas/addaccionista/addaccionista.routes')},
            {path: 'accionistas/agregar/autorizacion/:id', loadChildren: () => import('app/modules/admin/control-accionistas/autorizacion/autorizacion.routes')},
            {path: 'accionistas/agregar/declaracion/:id', loadChildren: () => import('app/modules/admin/control-accionistas/declaracion/declaracion.routes')},
            {path: 'accionistas/informacion', loadChildren: () => import('app/modules/admin/control-accionistas/informacion-accionistas/informacion-accionistas.routes')},
            {path: 'accionistas/actualizar/:id', loadChildren: () => import('app/modules/admin/control-accionistas/actualizar-informacion-accionistas/actualizar-informacion-accionistas.routes')}
        ]   
    }
];

import { Routes } from '@angular/router';
import { RegistrotitulosComponent } from 'app/modules/admin/controlTitulos/registrotitulos/registrotitulos.component';
import { GestionTitulosComponent } from './gestionTitulos.component';

export default [
    {
        path     : '',
        component: GestionTitulosComponent,
    },
] as Routes;

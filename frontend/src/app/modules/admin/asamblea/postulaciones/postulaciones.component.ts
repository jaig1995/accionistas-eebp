import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PostulanteComponent } from 'app/shared/components/postulante/postulante.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ResumenPostulacionesComponent } from './resumenPostulaciones/resumenPostulaciones.component';
import { PlanchaPostulanteComponent } from 'app/shared/components/planchaPostulante/planchaPostulante.component';

@Component({
    selector: 'app-postulaciones',
    standalone: true,
    imports: [
        CommonModule,
        PostulanteComponent,
        ResumenPostulacionesComponent,
        PlanchaPostulanteComponent,
        AngularMaterialModules
    ],
    templateUrl:'postulaciones.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostulacionesComponent {

}

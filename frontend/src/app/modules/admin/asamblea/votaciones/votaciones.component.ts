import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { FormularioVotacionesComponent } from './formularioVotaciones/formularioVotaciones.component';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';

@Component({
    selector: 'app-votaciones',
    standalone: true,
    imports: [
        CommonModule,
        FormularioVotacionesComponent,
        FuseAlertComponent,
        AngularMaterialModules
    ],
    templateUrl: 'votaciones.component.html',
    encapsulation: ViewEncapsulation.Emulated,
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class VotacionesComponent {

    // poderDantes = ["Mayerlin Yandar", "John Chicaiza", "Mireya Rosero","Martin"]

    pruebas = {
        apoderado: [
            {codUsuario:'1144160583', Nombres:'John Aelxander Chicaiza'}
        ],
        poderDantes: [
            {codUsuario:'1085786543', Nombres:'Mayerlin Yandar Rosero'},
            {codUsuario:'1085786543', Nombres:'Juan Alejandro Lopez'},
            {codUsuario:'1085786543', Nombres:'Camilo Andres Botero'},
            {codUsuario:'1085786543', Nombres:'Julian Felipe Paz'},
            {codUsuario:'1085786543', Nombres:'Mireya Jimena Ipaz'},
        ]
    }


}

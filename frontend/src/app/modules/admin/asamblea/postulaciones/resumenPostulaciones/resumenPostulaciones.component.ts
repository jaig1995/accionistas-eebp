import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { PlanchaPostulanteComponent } from 'app/shared/components/planchaPostulante/planchaPostulante.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-resumen-postulaciones',
    standalone: true,
    imports: [
        CommonModule,
        PlanchaPostulanteComponent,
        AngularMaterialModules,
    ],
    templateUrl: './resumenPostulaciones.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenPostulacionesComponent {
    @ViewChild(MatAccordion) accordion: MatAccordion;

    postulantes =2

 }

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule, FormArray } from '@angular/forms';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-plancha-postulante',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AngularMaterialModules,
        ReactiveFormsModule

    ],
    templateUrl: 'planchaPostulante.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class PlanchaPostulanteComponent implements OnInit {

    @Input() modoVotacion: any;
    @Input() datos: any;

    //variables voto
    voto

    nombrePlancha: any;
    nombresApellidos: any;

    ngOnInit(): void {
        this.recuperarPlanchaNombres()
        console.log('Consola desde:         clg');
    }

    recuperarPlanchaNombres() {
        const primerElemento = this.datos[0];
        this.nombrePlancha = Object.keys(primerElemento)[0];
        const accionistas = primerElemento[this.nombrePlancha];
        this.nombresApellidos = accionistas.map(accionista => accionista.nombresApellidos);
    }



}

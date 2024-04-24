import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-plancha-postulante',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules

    ],
    templateUrl: 'planchaPostulante.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanchaPostulanteComponent implements OnInit {

    @Input() modoVotacion: any;
    @Input() datos: any;

    nombrePlancha:any;
    nombresApellidos: any;

    ngOnInit(): void {
        this.recuperarPlanchaNombres()
    }


    recuperarPlanchaNombres() {
        const primerElemento = this.datos[0];
        this.nombrePlancha = Object.keys(primerElemento)[0];
        const accionistas = primerElemento[this.nombrePlancha];
        this.nombresApellidos = accionistas.map(accionista => accionista.nombresApellidos);
    }




}

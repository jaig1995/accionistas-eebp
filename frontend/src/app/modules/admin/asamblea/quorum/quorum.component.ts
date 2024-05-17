import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PorcentajeDirective } from 'app/shared/directives/porcentaje.directive';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import Chart, { ChartType } from 'chart.js/auto';
import { AsambleaService } from '../asamblea.service';
import { PorcentajesPipe } from 'app/shared/pipes/procentajes.pipe';

@Component({
    selector: 'app-quorum',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PorcentajesPipe,
        ReactiveFormsModule,
        AngularMaterialModules,
        PorcentajeDirective

    ],
    templateUrl: 'quorum.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class QuorumComponent implements OnInit {

    //Inyeccion de dependencias
    private _asambleaService = inject(AsambleaService)

    //variables data informacion quorum
    datosQuorum: any

    public chart: Chart;

    ngOnInit(): void {
        this.obtenerDatosQuorum()

        const data = {
            labels: [
                'Asistentes',
                'Faltante',
            ],
            datasets: [{
                label: 'Numero de asistentes',
                data: [400, 300],
                backgroundColor: [
                    '#5A9C30',
                    '#002E5F',
                ],
                hoverOffset: 4
            }]
        };
        // Creamos la gráfica
        this.chart = new Chart("chart", {
            type: 'doughnut' as ChartType,
            data
        })
    }


    validarQuorum(){

    }

    obtenerDatosQuorum() {
        this._asambleaService.obtenerDatosAsamblea().subscribe({
            next: (data) => {
                this.datosQuorum = data
                console.log(data)
            },
            error: (error) => {

            }
        })
    }
}

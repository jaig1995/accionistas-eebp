import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PorcentajeDirective } from 'app/shared/directives/porcentaje.directive';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import Chart, { ChartType } from 'chart.js/auto';

@Component({
    selector: 'app-quorum',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModules,
        PorcentajeDirective

    ],
    templateUrl: 'quorum.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuorumComponent {
    valor:any =123
    public chart: Chart;

    ngOnInit(): void {

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


    mostrar(){
        console.log("desde ", this.valor)
        this.valor = "2"
    }
}

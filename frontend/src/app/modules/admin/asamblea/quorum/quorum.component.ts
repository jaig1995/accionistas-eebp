import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PorcentajeDirective } from 'app/shared/directives/porcentaje.directive';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import Chart, { ChartType } from 'chart.js/auto';
import { AsambleaService } from '../asamblea.service';
import { PorcentajesPipe } from 'app/shared/pipes/procentajes.pipe';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-quorum',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PorcentajesPipe,
        ReactiveFormsModule,
        AngularMaterialModules,
        PorcentajeDirective,
        FuseLoadingBarComponent,

    ],
    templateUrl: 'quorum.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.Emulated,
    animations: fuseAnimations,
})
export class QuorumComponent implements OnInit {

    //Inyeccion de dependencias
    private _asambleaService = inject(AsambleaService)
    pantallaDeCarga:boolean = true

    //variables data informacion quorum
    datosQuorum: any

    public chart: Chart;

    ngOnInit(): void {
        this.obtenerDatosQuorum()


    }


    validarQuorum(){
        this.obtenerDatosQuorum()
    }

    obtenerDatosQuorum() {
        this._asambleaService.obtenerDatosAsamblea().subscribe({
            next: (datos) => {
                this.datosQuorum = datos
                const totalAccionesAccionesAsamblea = this.datosQuorum .totalAccionesAsamblea
                const totalAcciones = this.datosQuorum .totalAcciones
                const data = {
                    labels: [
                        'Acciones En Asamblea',
                        'Total Acciones',
                    ],
                    datasets: [{
                        label: 'Numero de asistentes',
                        data: [totalAccionesAccionesAsamblea, totalAcciones],
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
            },
            error: (error) => {

            },
            complete:()=>{
                this.pantallaDeCarga= false
            }
        })
    }
}

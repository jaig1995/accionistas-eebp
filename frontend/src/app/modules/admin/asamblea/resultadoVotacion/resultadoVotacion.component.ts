import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { AsambleaService } from '../asamblea.service';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';

@Component({
    selector: 'app-resultado-votacion',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules,
        FuseLoadingBarComponent,
    ],
    templateUrl: 'resultadoVotacion.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ResultadoVotacionComponent implements OnInit {

    //inyeccion de dependencias
    private _asambleaService = inject(AsambleaService);

    resultadosVotacion: any
    pantallaDeCarga: boolean = true;
    consecutivoEncuestaActual: any;

    ngOnInit(): void {
            this.obtenerIdEncuestaActual()
    }



    obtenerIdEncuestaActual() {
        this._asambleaService.obtenerIdEncuesta().subscribe({
            next: (data) => {
                this.consecutivoEncuestaActual = data.ultimoConsecutivo
                this.obtenerResultados(parseInt(this.consecutivoEncuestaActual))
                console.log('💻🔥 180, creacionPlantillas.component.ts: ', this.consecutivoEncuestaActual);
            },
            error: (error) => {
                console.log('💻🔥 185, creacionPlantillas.component.ts: ', error);
            }
        })
    }


    obtenerResultados(id) {
        this._asambleaService.obtenerResultadosVotaciones(id).subscribe({
            next: (data) => {
                this.resultadosVotacion = data;
            },
            error: (error) => {
                console.log(error)
            },
            complete: () => {
                this.pantallaDeCarga = false
            }
        })
    }
}


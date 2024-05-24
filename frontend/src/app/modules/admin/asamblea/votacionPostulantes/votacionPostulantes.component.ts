import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ResumenPostulacionesComponent } from '../postulaciones/resumenPostulaciones/resumenPostulaciones.component';
import { AsambleaService } from '../asamblea.service';

@Component({
    selector: 'app-votacion-postulantes',
    standalone: true,
    imports: [
        CommonModule,
        FuseLoadingBarComponent,
        AngularMaterialModules,
        ResumenPostulacionesComponent
    ],
    templateUrl: 'votacionPostulantes.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class VotacionPostulantesComponent implements OnInit {

    private _asambleaService = inject(AsambleaService);


    //alertas o validaciones
    showSuccesAlert = false;
    showFailedAlert = false;
    resultadosPostulantes: any;




    ngOnInit(): void {
            this.obtenerResultados()
        // this.resultadosPostulantes = dataPrueba
        console.log('💻🔥 35, votacionPostulantes.component.ts: ', this.resultadosPostulantes);
    }

    obtenerResultados() {
        this._asambleaService.obtenerResultadosPostulantes().subscribe({
            next: (data) => {
                this.resultadosPostulantes = data
                console.log('💻🔥 40, votacionPostulantes.component.ts: ', this.resultadosPostulantes);
            },
            error: (error) => {

            }
        })
    }


    //alertas
    mostrarAlertaExitosa(): void {
        this.showSuccesAlert = true;
        setTimeout(() => {
            this.showSuccesAlert = false;
        }, 3000);
    }

    mostrarAlertaFallida(): void {
        this.showFailedAlert = true;
        setTimeout(() => {
            this.showFailedAlert = false;
        }, 3000);
    }
}

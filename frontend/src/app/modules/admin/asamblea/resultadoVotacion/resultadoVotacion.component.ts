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

    resultadosVotacion:any
    pantallaDeCarga: boolean = true;

    ngOnInit(): void {
        this.obtenerResultados()
        // this.resultadosVotacion = data
    }

    obtenerResultados() {
        this._asambleaService.obtenerResultadosVotaciones(15).subscribe({
            next:(data)=>{
                this.resultadosVotacion = data;
            },
            error:(error)=>{
                console.log(error)
            },
            complete:()=>{
                this.pantallaDeCarga = false
            }
        })
    }
}


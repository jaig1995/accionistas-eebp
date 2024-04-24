import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

import { AsambleaService } from '../../asamblea.service';
import { PlanchaPostulanteComponent } from 'app/shared/components/planchaPostulante/planchaPostulante.component';

@Component({
    selector: 'app-resumen-postulaciones',
    standalone: true,
    imports: [
        CommonModule,
        PlanchaPostulanteComponent,
        AngularMaterialModules,
    ],
    templateUrl: './resumenPostulaciones.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ResumenPostulacionesComponent implements OnInit {

    private asambleaService = inject(AsambleaService);

    @ViewChild(MatAccordion) accordion: MatAccordion;
    comiteEscrutador: any;
    aprobacionActa: any;
    presidenteAsamblea: any;

    ngOnInit(): void {
        this.obtenerPostulantes();
    }


    obtenerPostulantes(){
        this.asambleaService.obtenerPostulantes().subscribe({
            next:(data:any)=>{
                this.comiteEscrutador = data.comiteEscrutador
                this.aprobacionActa = data.aprobacionActa
                this.presidenteAsamblea = data.presidenteAsamblea
            },
            error:(data)=>{
                console.log(data)
            }
        })
    }

 }

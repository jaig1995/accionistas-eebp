import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

import { AsambleaService } from '../../asamblea.service';
import { PlanchaPostulanteComponent } from 'app/shared/components/planchaPostulante/planchaPostulante.component';
import { FormsModule } from '@angular/forms';
import CryptoJS from 'crypto-js';

@Component({
    selector: 'app-resumen-postulaciones',
    standalone: true,
    imports: [
        CommonModule,
        PlanchaPostulanteComponent,
        AngularMaterialModules,
        FormsModule
    ],
    templateUrl: './resumenPostulaciones.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ResumenPostulacionesComponent implements OnInit {

    //inyecccion de dependencias
    private _asambleaService = inject(AsambleaService);


    //variables votacion
    selectedOption: any;

    votacionDeshabilitada : boolean = false
    //validaciones
    existeVotoJD: any;
    existeVotoRF: any;
    validacionJD:boolean = false

    @ViewChild(MatAccordion) accordion: MatAccordion;
    @Input() modoVotaciones: any = false;
    datosPostulados: any;
    validacionRF: boolean;

    ngOnInit(): void {
        this.validacionVotos()
        console.log('💻🔥 33, resumenPostulaciones.component.ts: ', this.datosPostulados);
        this.obtenerPostulantes();
    }


    obtenerPostulantes() {

        this._asambleaService.obtenerResumenGeneralPostulantes().subscribe({
            next: (data: any) => {
                console.log('💻🔥 51, resumenPostulaciones.component.ts: ', data.juntaDirectiva.postulantes.length);
                this.datosPostulados = data

            },
            error: (data) => {
                console.log(data)
            }
        })
    }

    validacionVotos() {
        const idUsuario = JSON.parse(this.decryptToken())
        this._asambleaService.validacionVoto(idUsuario.id).subscribe({
            next: (data) => {
                console.log('💻🔥 59, votacionPostulantes.component.ts: ', data);
                this.existeVotoJD = data?.juntaDirectiva;
                this.existeVotoRF = data?.revisorFiscal;

            },
            error: (error) => {

            }
        })
    }



    votar() {
        console.log('💻🔥 82, resumenPostulaciones.component.ts: ', this.selectedOption);

        // let datosVotacion = { ...this.selectedOption, idPersona: codUsuario?.id }
        // this.enviarVotacion(datosVotacion)

    }

    enviarPeticionVotacion(votacion) {
        this._asambleaService.votarPorPostulante(votacion).subscribe({
            next: (data) => {
                console.log('💻🔥 65, resumenPostulaciones.component.ts: ', data);
            },
            error: (error) => {
                console.log('💻🔥 68, resumenPostulaciones.component.ts: ', error);
            }
        })
    }



    //metodo desemcriptar y  obtener informacion del usuario desde el token y el localstorage
    decryptToken(): string {
        const encryptedToken = localStorage.getItem('encryptedToken');
        if (encryptedToken) {
            const bytes = CryptoJS.AES.decrypt(encryptedToken, 'secret-key');
            return bytes.toString(CryptoJS.enc.Utf8);
        } else {
            return null;
        }
    }



    enviarVotacion(seccion) {

        if (!this.selectedOption) return;

        const codUsuario = JSON.parse(this.decryptToken())

        if(seccion === 'validacionJD'){
            this.validacionJD = true
        }else if(seccion === 'validacionRF'){
            this.validacionRF = true
        }

        console.log('💻🔥 126, resumenPostulaciones.component.ts: ',{ ...this.selectedOption, codUsuario: codUsuario?.id } );
        this.enviarPeticionVotacion({ ...this.selectedOption, idPersona: codUsuario?.id })
        this.accordion.closeAll()

    }


}


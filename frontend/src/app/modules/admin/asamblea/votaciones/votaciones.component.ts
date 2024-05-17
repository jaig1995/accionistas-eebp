import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { FormularioVotacionesComponent } from './formularioVotaciones/formularioVotaciones.component';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';
import { EscogerModoModalComponent } from './EscogerModoModal/EscogerModoModal.component';
import { AsambleaService } from '../asamblea.service';
import { Votantes } from './interfaces/Votantes.interface';
import CryptoJS from 'crypto-js';


@Component({
    selector: 'app-votaciones',
    standalone: true,
    imports: [
        CommonModule,
        FormularioVotacionesComponent,
        FuseAlertComponent,
        AngularMaterialModules,

    ],
    templateUrl: 'votaciones.component.html',
    encapsulation: ViewEncapsulation.Emulated,
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class VotacionesComponent implements OnInit, AfterViewInit {


    ngAfterViewInit(): void {
        // this.obetenerDatosVotaciones()
    }
    //inyeccion de dependencias
    private _dialog = inject(MatDialog)
    private _asambleaService = inject(AsambleaService)

    //validaciones
    bloque: boolean = false
    individual: boolean = false;
    modoSeleccionado: number;


    //Datos poderdantes y datos del votante(apoderado)
    datosVotoPoderdante: any;
    datosVotoApoderado: any;

    ngOnInit(): void {

        this.obetenerDatosVotaciones()
        console.log(this.datosVotoApoderado)

    }

    //TODO: cambiar por el documento el numero 2, en el service esta quemado el numero de documento
    obetenerDatosVotaciones() {
        const {id:documentoVotante} = JSON.parse(this.decryptToken());
        console.log(documentoVotante)
        this._asambleaService.obtenerpoderDantes(documentoVotante).subscribe({
            next: (data) => {
                console.log(data)
                if (data) {

                    this.datosVotoPoderdante = data.poderDantes
                    this.datosVotoApoderado = data.apoderado;
                    if ( this.datosVotoPoderdante.length === 0) {
                        this.individual = true;
                        this.modoSeleccionado = 0
                    } else {
                        let modoSeleccionadoVotar = localStorage.getItem('mode')
                        console.log(modoSeleccionadoVotar)

                        if(modoSeleccionadoVotar){

                            if(modoSeleccionadoVotar === 'individual'){
                                this.individual = true;
                                this.modoSeleccionado = 0
                            }else{
                                this.bloque = true;
                                this.modoSeleccionado = 1
                            }
                        }else{
                            this.openModal()

                        }

                    }
                } else {
                    this.datosVotoPoderdante = []
                    this.datosVotoApoderado = [];
                }
            },
            error: (error) => {
                console.log(error)
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




    openModal() {
        const dialogRef = this._dialog.open(EscogerModoModalComponent, {
            width: '600px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.bloque = true;
                this.modoSeleccionado = 1
                localStorage.setItem('mode', 'bloque')
            } else {
                this.individual = true;
                this.modoSeleccionado = 0
                localStorage.setItem('mode', 'individual')
            }

        });
    }
}

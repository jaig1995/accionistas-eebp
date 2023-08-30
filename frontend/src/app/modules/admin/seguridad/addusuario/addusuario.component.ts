import { Component, ViewEncapsulation } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import {FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from "@angular/router";
import { ServicesConfig } from 'app/services.config';
import { UserDataService } from '../permisos/user-data.service';


@Component({
    selector: 'agregar-usuarios',
    standalone   : true,
    templateUrl: './addusuario.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        MatIconModule,
        FormsModule,
        NgFor,
        NgIf, ReactiveFormsModule],
})

export class AddusuarioComponent {

    private _baseUrl: string = ServicesConfig.apiUrl;

    nom_pri: string;
    nom_seg: string;
    ape_pri: string;
    ape_seg: string;
    identificacion: string;
    perfil: number;
    email: string;
    selectedFile: File;
    private _fuseConfirmationService;

    constructor(private http: HttpClient, fuseConfirmationService: FuseConfirmationService, private router: Router, private userService: UserDataService) {
        this._fuseConfirmationService = fuseConfirmationService;
        
    }
    onSubmit() {
        const data = {
            nombreUsuario: this.nom_pri + " " + this.nom_seg,
            apellidoUsuario: this.ape_pri + " " + this.ape_seg,
            codUsuario: this.identificacion,
            perfil: this.perfil,
            email: this.email
        };

        this.http.post(this._baseUrl + '/api/usuarios', data).subscribe(response => {

            const formData = new FormData();
            formData.append("file", this.selectedFile, this.identificacion.toString() + ".jpg");
            this.http.post(this._baseUrl + '/api/uploadFile', formData).subscribe(response2 => {
                console.log(response2)
            });

            const confirmation = this._fuseConfirmationService.open({
                "title": "Usuario creado exitosamente!",
                "message": "El usuario recibirá un correo con la confirmación del registro y una contraseña temporal la " +
                    "cual podrá ser cambiada desde el panel de usuario.",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:check-circle",
                    "color": "accent"
                },
                "actions": {
                    "confirm": {
                        "show": false,
                        "label": "Remove",
                        "color": "warn"
                    },
                    "cancel": {
                        "show": false,
                        "label": "Cancel"
                    }
                },
                "dismissible": true
            });

            this.identificacion = null;
            this.email = null;
            this.ape_pri = null;
            this.ape_seg = null;
            this.nom_pri = null;
            this.nom_seg = null;
            this.perfil = null;

        }, error => {
            const errorDialog = this._fuseConfirmationService.open({
                "title": "No se pudo crear el usuario",
                    "message": "Contacte al administrador del sistema para más información.",
                    "icon": {
                    "show": true,
                        "name": "heroicons_outline:x-circle",
                        "color": "error"
                },
                "actions": {
                    "confirm": {
                        "show": false,
                            "label": "Remove",
                            "color": "warn"
                    },
                    "cancel": {
                        "show": false,
                            "label": "Cancel"
                    }
                },
                "dismissible": true
            });
        });
    }

    onChange(){
        console.log(this.identificacion);
        this.userService.obtenerUsuario(this.identificacion).subscribe(response => {
            const confirmation = this._fuseConfirmationService.open({
                "title": "El usuario ya existe!",
                "message": "Verifica su identificación",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:exclamation-triangle",
                    "color": "warn"
                },
                "actions": {
                    "confirm": {
                    "show": false,
                    "label": "Remove",
                    "color": "warn"
                    },
                    "cancel": {
                    "show": false,
                    "label": "Cancel"
                    }
                },
                "dismissible": true
            });
            this.identificacion = '';
        });

    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0] ?? null;
    }
}

import { Component, ViewEncapsulation } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from "@angular/router";
import { ServicesConfig } from 'app/services.config';
import { UserDataService } from '../permisos/user-data.service';
import { AccionistasService } from '../../control-accionistas/addaccionista/accionistas.service';
import { RegAccionistas } from '../../control-accionistas/registraraccionista/registraraccionista.model';
import { Actualizar } from '../../control-accionistas/actualizar-informacion-accionistas/actualizar-informacion-accionistas.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'agregar-usuarios',
    standalone   : true,
    templateUrl: './addusuario.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatButtonModule,
        CommonModule,
        MatAutocompleteModule,
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

    identificacion: string;
    perfil: number;
    usuarioEncontrado: any;
    private _fuseConfirmationService;
    datosAutocompletado: Actualizar[] = []; // Lista de objetos Actualizar para el autocompletado
    valorSeleccionado: string = '';

    filtroControl = new FormControl(); // Control para filtrar
    opcionesFiltradas: Observable<Actualizar[]>;

    constructor(private http: HttpClient, fuseConfirmationService: FuseConfirmationService, private router: Router, private userService: UserDataService, private accionistasService: AccionistasService) {
        this._fuseConfirmationService = fuseConfirmationService;
        
    }

    ngOnInit() {

        this.accionistasService.obtenerCodigos().subscribe((datos: Actualizar[]) => {
          this.datosAutocompletado = datos;
          this.opcionesFiltradas = this.filtroControl.valueChanges.pipe(
            startWith(''), // Inicia con una cadena vacía
            map(value => this._filtrarOpciones(value))
          );
        });
    }

    private _filtrarOpciones(value: string): Actualizar[] {
        const filtro = value.toLowerCase();
        return this.datosAutocompletado.filter(opcion => opcion.codUsuario.toLowerCase().includes(filtro));
    }

    onSubmit() {
        const data = {
            codUsuario: this.identificacion,
            perfil: this.perfil
        };

        this.http.post(this._baseUrl + '/api/usuarios/administrativo', data).subscribe(response => {

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

    usuarioExistente(){
        
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

    consultarUsuario() {
        this.accionistasService.obtenerPersona(this.identificacion).subscribe(
          (data: Actualizar) => {
            if (data.codUsuario != null){
                this.usuarioEncontrado = data
            }else{
                this.usuarioEncontrado = null;
            }
          },
          (error) => {
            console.error('Error al obtener los datos:', error);
            const confirmation = this._fuseConfirmationService.open({
    
              "title": "La persona no existe en el sistema",
              "message": "Verifique el código de usuario.",
              "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation-triangle",
                "color": "warn"
              },
              "actions": {
                "confirm": {
                  "show": true,
                  "label": "Aceptar",
                  "color": "warn"
                },
                "cancel": {
                  "show": false,
                  "label": "Cancel"
                }
              },
              "dismissible": false
      
            });
            this.identificacion = '';
            this.usuarioEncontrado = null;
          }
        );
      }

}

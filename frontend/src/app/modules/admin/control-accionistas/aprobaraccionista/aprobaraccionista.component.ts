import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RegAccionistas } from "../registraraccionista/registraraccionista.model"
import { AccionistasService } from '../addaccionista/accionistas.service';
import { NgFor, NgIf } from '@angular/common';
import { InformacionAccionistasService } from '../informacion-accionistas/accionistas-data.service';
import { ServicesConfig } from 'app/services.config';
import { NgClass } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { startWith, map, switchMap } from 'rxjs/operators';
import { Actualizar } from '../actualizar-informacion-accionistas/actualizar-informacion-accionistas.model';
import { Observable } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { Archivos } from './archivos.model';


@Component({
  selector: 'aprobaraccionista',
  standalone   : true,
  templateUrl: './aprobaraccionista.component.html',
  imports: [MatDividerModule,
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    NgIf,
    TextFieldModule
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AprobaraccionistaComponent implements OnInit{

  datosAccionista: RegAccionistas[];
  archivosAccionista: Archivos[];
  mostrarCampos: boolean = false;
  mostrarBotones: boolean = false;
  mostrarTablas: boolean = false;

  displayedColumns: string[] = ['avatar', 'tipDocumento', 'codUsuario', 'nombreUsuario', 'email', 'pdf_datos', 'pdf_autorizacion', 'pdf_declaracion'];
  displayedColumnsArchivos: string[] = ['archivos', 'descarga'];
  private _fuseConfirmationService;
  private _baseUrl: string = ServicesConfig.apiUrl;
  botonDesactivado: boolean = false;

  codigoUsuarioAccionista: string;
  descripcionRechazo: string;

  datosAutocompletado: Actualizar[] = []; 
  valorSeleccionado: string = '';

  
  opcionesFiltradas: Observable<Actualizar[]>;

  constructor(private userDatos: InformacionAccionistasService,private router: Router, private route: ActivatedRoute,private accionistasService: AccionistasService,fuseConfirmationService: FuseConfirmationService){
    this._fuseConfirmationService = fuseConfirmationService;
  }
  
  ngOnInit() {

    this.accionistasService.obtenerCodigos().subscribe((datos: Actualizar[]) => {
      this.datosAutocompletado = datos;
      this.opcionesFiltradas = this.registroForm.get('codUsuario').valueChanges.pipe(
        startWith(''), 
        map(value => this._filtrarOpciones(value))
      );
    });
  }

  private _filtrarOpciones(value: string): Actualizar[] {
      const filtro = value.toLowerCase();
      return this.datosAutocompletado.filter(opcion => opcion.codUsuario.toLowerCase().includes(filtro));
  }
  
  registroForm = new FormGroup({
    'codUsuario': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
  })

  onSubmit(){
      
    const formDataAccionista = {
      codUsuario: this.codigoUsuarioAccionista,
    };

    if (this.registroForm.valid) {
      this.accionistasService.aprobar(this.codigoUsuarioAccionista).subscribe(
        (response) => {
          this.router.navigate(['/accionista/aprobar']);
          const confirmation = this._fuseConfirmationService.open({

            "title": "Datos enviados exitosamente!",
            "message": "Los datos fueron enviados.",
            "icon": {
              "show": true,
              "name": "heroicons_outline:exclamation-triangle",
              "color": "success"
            },
            "actions": {
              "confirm": {
                "show": true,
                "label": "Aceptar",
                "color": "primary"
              },
              "cancel": {
                "show": false,
                "label": "Cancel"
              }
            },
            "dismissible": false
    
          });

          this.registroForm.get('codUsuario').setValue('');
          this.datosAccionista = null;
          this.mostrarBotones = false;
          this.mostrarTablas = false;

        },
        (error) => {
          console.error('Error en la petición - Accionista:', error);
        }
      );
    }
    this.botonDesactivado = true;
  }
   


  consultarUsuario() {
    const codUsuario = this.registroForm.get('codUsuario').value;
    
    this.accionistasService.obtenerDatosRegistro(codUsuario).subscribe(
      (data: RegAccionistas) => {
        this.codigoUsuarioAccionista = codUsuario;
        this.datosAccionista = [data];
        this.mostrarTablas = true;
        this.accionistasService.obtenerArchivos(codUsuario).subscribe(
          (dataArchivos: Archivos[]) => {
           
            this.archivosAccionista = dataArchivos;
            //console.log(this.archivosAccionista);
          }
          
        );

        if(data.esAccionista === 'N'){
          const confirmation = this._fuseConfirmationService.open({
            "title": "El usuario aún no es accionista.",
            "message": "",
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
          confirmation.afterClosed().subscribe(() => {
            this.datosAccionista = null;
          });
          this.registroForm.get('codUsuario').setValue('');
          this.mostrarBotones = false;
          this.mostrarTablas = false;
        }
  
        this.accionistasService.obtenerAccionista(codUsuario).subscribe(
          (accionistaData) => {
            if (accionistaData.aprobado === 'S') {
              const confirmation = this._fuseConfirmationService.open({
                "title": "Ya se encuentra aprobado.",
                "message": "",
                "icon": {
                  "show": true,
                  "name": "feather:alert-circle",
                  "color": "success"
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
              confirmation.afterClosed().subscribe(() => {
                this.datosAccionista = null;
              });
              this.registroForm.get('codUsuario').setValue('');
              this.mostrarBotones = false;
              this.mostrarTablas = false;
            } else if (accionistaData.descripcionRechazo != null && accionistaData.aprobado === 'N') {
              const confirmation = this._fuseConfirmationService.open({
                "title": "El usuario fue rechazado con la siguiente descripción:",
                "message": accionistaData.descripcionRechazo,
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
              confirmation.afterClosed().subscribe(() => {
                this.datosAccionista = null;
              });
              this.registroForm.get('codUsuario').setValue('');
              this.mostrarBotones = false;
              this.mostrarTablas = false;
            } 
          },
          (error) => {
            console.error('Error al obtener el estado de aprobación y rechazo:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        const confirmation = this._fuseConfirmationService.open({
          "title": "Usuario no encontrado",
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
          "dismissible": true
        });
        confirmation.afterClosed().subscribe(() => {
          this.datosAccionista = null;
        });
        this.mostrarBotones = false;
      }
    );
  }

  camposRechazo() {
    this.mostrarCampos = true;
  }

  botones() {
    this.mostrarBotones = true;
  }

  desactivarBotones(){
    this.botonDesactivado = true;
  }

  tablas() {
    this.mostrarTablas = true;
  }

  rechazarUsuario(){
    const formDataRechazo = {
      codUsuario: this.codigoUsuarioAccionista,
      descripcionRechazo: this.descripcionRechazo
    };
    console.log(formDataRechazo);
      this.accionistasService.rechazar(this.codigoUsuarioAccionista, this.descripcionRechazo).subscribe(
        (response) => {
          console.log('Respuesta del servidor - Accionista: Datos enviados', response);
          const confirmation = this._fuseConfirmationService.open({

            "title": "Datos enviados exitosamente!",
            "message": "Los datos fueron enviados.",
            "icon": {
              "show": true,
              "name": "heroicons_outline:exclamation-triangle",
              "color": "success"
            },
            "actions": {
              "confirm": {
                "show": true,
                "label": "Aceptar",
                "color": "primary"
              },
              "cancel": {
                "show": false,
                "label": "Cancel"
              }
            },
            "dismissible": false
    
          });
          this.registroForm.get('codUsuario').setValue('');
          this.descripcionRechazo = null;
          this.datosAccionista = null;
          this.mostrarCampos = null;
          this.mostrarTablas = null;
          this.mostrarBotones = false;

        },
        (error) => {
          console.error('Error en la petición - Accionista:', error);
        }
      );
    this.botonDesactivado = true;
  }

  convertToUpperCase(event: Event) {
    const valor = (event.target as HTMLTextAreaElement).value;

    // Convertir el valor a mayúsculas y asignarlo de nuevo a la variable
    this.descripcionRechazo = valor.toUpperCase();
  }
  
}



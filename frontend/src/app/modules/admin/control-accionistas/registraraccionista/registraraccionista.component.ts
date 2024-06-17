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
import { RegAccionistas } from './registraraccionista.model';
import { AccionistasService } from '../addaccionista/accionistas.service';
import { NgFor, NgIf } from '@angular/common';
import { items } from 'app/mock-api/apps/file-manager/data';
import { MatSelectModule } from '@angular/material/select';

import { startWith, map, switchMap } from 'rxjs/operators';
import { Actualizar } from '../actualizar-informacion-accionistas/actualizar-informacion-accionistas.model';
import { Observable } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'registroaccionista',
  standalone   : true,
  templateUrl: './registraraccionista.component.html',
  imports: [MatDividerModule,
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RegistraraccionistaComponent implements OnInit{

  datosAccionista: RegAccionistas[];
  datosRepresentante: RegAccionistas[];
  displayedColumns: string[] = ['avatar', 'tipDocumento', 'codUsuario', 'nombreUsuario', 'email', 'estadoCivil', 'celular', 'profesion', 'direccionDomicilio'];
  private _fuseConfirmationService;
  mostrarCampoAdicionalFueraTabla: boolean = false;

  codigoUsuarioAccionista: string;
  codigoUsuarioRepresentante: string;
  tipoAccionista: string;
  numCarnet: string;

  errorMessage: string | undefined; 
  selectedFileMultiple: File[] = [];

  datosAutocompletado: Actualizar[] = []; 
  valorSeleccionado: string = '';


  opcionesFiltradas: Observable<Actualizar[]>;
  opcionesFiltradasRepresentante: Observable<Actualizar[]>;


  constructor(private router: Router, private route: ActivatedRoute,private accionistasService: AccionistasService,fuseConfirmationService: FuseConfirmationService){
    this._fuseConfirmationService = fuseConfirmationService;
  }
  
  registroForm = new FormGroup({
    'codUsuario': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'codRepresentante': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'tipoAccionista': new FormControl('', Validators.required),
    'tipoRepresentante': new FormControl('', Validators.required),
    'numCarnet': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'file': new FormControl(''),
  })

  ngOnInit() {

    this.accionistasService.obtenerCodigos().subscribe((datos: Actualizar[]) => {
      this.datosAutocompletado = datos;
      this.opcionesFiltradas = this.registroForm.get('codUsuario').valueChanges.pipe(
        startWith(''), 
        map(value => this._filtrarOpciones(value))
      );
    });
    this.accionistasService.obtenerCodigos().subscribe((datos: Actualizar[]) => {
      this.datosAutocompletado = datos;
      this.opcionesFiltradasRepresentante = this.registroForm.get('codRepresentante').valueChanges.pipe(
        startWith(''), 
        map(value => this._filtrarOpcionesRepresentante(value))
      );
    });
  }

  
  private _filtrarOpciones(value: string): Actualizar[] {
    const filtro = value.toLowerCase();
    return this.datosAutocompletado.filter(opcion => opcion.codUsuario.toLowerCase().includes(filtro));
  }

  private _filtrarOpcionesRepresentante(value: string): Actualizar[] {
    const filtro = value.toLowerCase();
    return this.datosAutocompletado.filter(opcion => opcion.codUsuario.toLowerCase().includes(filtro));
  }

  onSubmit(){

    if (this.registroForm.get('codRepresentante').value === null || this.registroForm.get('tipoRepresentante').value === null) {
      
      console.error('CodRepresentante y TipoRepresentante deben estar seleccionados.');
      return; 
    }
      
    const formDataAccionista = {
      codUsuario: this.registroForm.get('codUsuario').value,
      codRepresentante: this.registroForm.get('codRepresentante').value,
      tipoAccionista: this.registroForm.get('tipoAccionista').value,
      numCarnet: this.registroForm.get('numCarnet').value,
      tipoRepresentante: this.registroForm.get('tipoRepresentante').value,
    };

    if (this.registroForm.get('codRepresentante').value !== '' && this.registroForm.get('tipoRepresentante').value) {
      formDataAccionista.codRepresentante = this.registroForm.get('codRepresentante').value;
      formDataAccionista.tipoRepresentante = this.registroForm.get('tipoRepresentante').value;
      
    } else {
      this.registroForm.get('codRepresentante').clearValidators();
      this.registroForm.get('tipoRepresentante').clearValidators();
      this.registroForm.get('codRepresentante').updateValueAndValidity();
      this.registroForm.get('tipoRepresentante').updateValueAndValidity();
      formDataAccionista.codRepresentante = null;
      formDataAccionista.tipoRepresentante = null;
    }

    if(this.registroForm.get('codRepresentante').value === this.registroForm.get('codUsuario').value){
      const confirmation = this._fuseConfirmationService.open({
  
        "title": "El usuario menor de edad no puede ser su propio representante.",
        "message": "Intente con otro código de usuario.",
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
      
      this.registroForm.get('codRepresentante').setValue('');
      this.registroForm.invalid;
    }
    console.log(this.registroForm)
    if (this.registroForm.valid) {
      this.accionistasService.enviarDatosRegistro(formDataAccionista).subscribe(
        (response) => {

          
          
          for (const selectedFile of this.selectedFileMultiple) {

            const formDataArchivo = new FormData();
            formDataArchivo.append("file", selectedFile, "raccionista_" + formDataAccionista.codUsuario + "_" + selectedFile.name); 
      
            this.accionistasService.enviarArchivo(formDataArchivo).subscribe(
              (response) => {
                console.log(formDataArchivo);
              },
              (error) => {
                console.error('Error al cargar la foto', error);
              }
            );
          }

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

          this.router.navigate(['accionistas/agregar/autorizacion/' + this.registroForm.get('codUsuario').value]);
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      const confirmation = this._fuseConfirmationService.open({

        "title": "Los datos no fueron enviados!",
        "message": "Por favor revisa que los campos estén diligenciados de forma correcta.",
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
    }
  }
   


  consultarUsuario() {
    const codUsuario = this.registroForm.get('codUsuario').value; 
  
    this.accionistasService.obtenerDatosRegistro(codUsuario).subscribe(
      (data: RegAccionistas) => {
        this.codigoUsuarioAccionista = codUsuario;
        this.datosAccionista = [data];
        this.mostrarCampoAdicionalFueraTabla = data.tipDocumento === 'TI' || data.tipDocumento ==='RC';
        if (data.esAccionista === 'S'){
          const confirmation = this._fuseConfirmationService.open({

            "title": "El usuario que intenta consultar ya es Accionista",
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
          this.registroForm.get('codUsuario').setValue('');
          this.datosAccionista = null;

        }
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
        this.registroForm.get('codUsuario').setValue('');
      }
    );
  }
  consultarRepresentante() {
    const codRepresentante = this.registroForm.get('codRepresentante').value; 
    const codUsuario = this.registroForm.get('codUsuario').value;
    if (codRepresentante === codUsuario) {

      const confirmation = this._fuseConfirmationService.open({
  
        "title": "El usuario menor de edad no puede ser su propio representante.",
        "message": "Intente con otro código de usuario.",
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
      
      this.registroForm.get('codRepresentante').setValue('');
      
      
    }else{

      this.accionistasService.obtenerDatosRegistro(codRepresentante).subscribe(
        (data: RegAccionistas) => {
          if (data.tipDocumento === 'TI' || data.tipDocumento === 'RC') {
            
            const confirmation = this._fuseConfirmationService.open({
              "title": "El representante no puede ser menor de edad.",
              "message": "Asigne un representante mayor de edad.",
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
            this.registroForm.get('codRepresentante').setValue('');
          } else {
            // 
            this.codigoUsuarioRepresentante = codRepresentante;
            this.datosRepresentante = [data];
          }
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
          this.registroForm.get('codRepresentante').setValue('');
        }
      );

    }
    
  }

  onFileSelectedMultiple(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFileMultiple.push(files[i]);
    }
    console.log(files);
  }
}



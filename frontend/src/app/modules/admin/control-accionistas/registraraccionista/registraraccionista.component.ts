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

@Component({
  selector: 'registroaccionista',
  standalone   : true,
  templateUrl: './registraraccionista.component.html',
  imports: [MatDividerModule,
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
export class RegistraraccionistaComponent{

  datosAccionista: RegAccionistas[];
  datosRepresentante: RegAccionistas[];
  displayedColumns: string[] = ['avatar', 'tipDocumento', 'codUsuario', 'nombreUsuario', 'apellidoUsuario', 'email', 'estadoCivil', 'celular', 'profesion', 'direccionDomicilio', 'tipoVivienda'];
  private _fuseConfirmationService;
  mostrarCampoAdicionalFueraTabla: boolean = false;

  codigoUsuarioAccionista: string;
  codigoUsuarioRepresentante: string;
  tipoAccionista: string;
  numCarnet: string;

  errorMessage: string | undefined; 
  selectedFileMultiple: File[] = [];


  constructor(private router: Router, private route: ActivatedRoute,private accionistasService: AccionistasService,fuseConfirmationService: FuseConfirmationService){
    this._fuseConfirmationService = fuseConfirmationService;
  }
  
  registroForm = new FormGroup({
    'codUsuario': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'codRepresentante': new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'tipoAccionista': new FormControl('', Validators.required),
    'numCarnet': new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'file': new FormControl(''),
  })

  onSubmit(){
      
    const formDataAccionista = {
      codUsuario: this.registroForm.get('codUsuario').value,
      codRepresentante: this.registroForm.get('codRepresentante').value,
      tipoAccionista: this.registroForm.get('tipoAccionista').value,
      numCarnet: this.registroForm.get('numCarnet').value,
    };
    if (this.registroForm.get('codRepresentante').value !== '') {
      formDataAccionista.codRepresentante = this.registroForm.get('codRepresentante').value;
    } else {
      formDataAccionista.codRepresentante = null;
    }
    console.log(formDataAccionista);
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
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error desconocido';
          }
        }
      );
    }
  }
   


  consultarUsuario() {
    const codUsuario = this.registroForm.get('codUsuario').value; // Obtener el valor del campo codUsuario
  
    this.accionistasService.obtenerDatosRegistro(codUsuario).subscribe(
      (data: RegAccionistas) => {
        this.codigoUsuarioAccionista = codUsuario;
        this.datosAccionista = [data];
        this.mostrarCampoAdicionalFueraTabla = data.tipDocumento === 'TI';
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
    const codRepresentante = this.registroForm.get('codRepresentante').value; // Obtener el valor del campo codRepresentante
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
          if (data.tipDocumento === 'TI') {
            // El tipo de documento es 'TI', realiza alguna acción o muestra un mensaje de error
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



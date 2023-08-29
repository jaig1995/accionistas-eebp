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

@Component({
  selector: 'aprobaraccionista',
  standalone   : true,
  templateUrl: './aprobaraccionista.component.html',
  imports: [MatDividerModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NgFor,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AprobaraccionistaComponent{

  datosAccionista: RegAccionistas[];

  displayedColumns: string[] = ['avatar', 'tipDocumento', 'codUsuario', 'nombreUsuario', 'apellidoUsuario', 'email', 'estadoCivil', 'celular', 'profesion', 'direccionDomicilio', 'tipoVivienda'];
  private _fuseConfirmationService;

  codigoUsuarioAccionista: string;


  constructor(private router: Router, private route: ActivatedRoute,private accionistasService: AccionistasService,fuseConfirmationService: FuseConfirmationService){
    this._fuseConfirmationService = fuseConfirmationService;
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

          this.router.navigate(['/accionista/aprobar']);
        },
        (error) => {
          console.error('Error en la petición - Accionista:', error);
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
      }
    );
  }
}



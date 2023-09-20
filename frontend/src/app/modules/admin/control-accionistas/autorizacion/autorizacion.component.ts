import { Component, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, Validators,FormControl, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AccionistasService } from '../addaccionista/accionistas.service';
import { Autorizacion } from './autorizacion.model';
import { NgFor, NgIf } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'autorizacion',
  standalone   : true,
  imports: [MatDividerModule, 
    RouterModule,
    ReactiveFormsModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    NgFor,
    NgIf,
    MatCheckboxModule
   ],
  templateUrl: './autorizacion.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AutorizacionComponent  {
  datosAutorizacion: Autorizacion;
  fechaActual: string;
  id : string;
  messageFirma : string;
  private _fuseConfirmationService;

  constructor(fuseConfirmationService: FuseConfirmationService,private route: ActivatedRoute, private accionistasService: AccionistasService, private router: Router) {
    this.fechaActual = new Date().toLocaleDateString();
    this._fuseConfirmationService = fuseConfirmationService;
  }

  autorizacionForm = new FormGroup({
    // Agrega más campos si es necesario según tu interfaz Accionistas
    'numSuscripcion':  new FormControl('', [Validators.pattern('^[0-9]*$')]),
    'nomPri':  new FormControl({ value: '', disabled: true }),
    'codUsuario':  new FormControl({ value: '', disabled: true },  Validators.required),
    'dirDomicilio':  new FormControl({ value: '', disabled: true }, Validators.required),
    'correoPersona':  new FormControl({ value: '', disabled: true }, Validators.required),
    'telfDomicilio':  new FormControl({ value: '', disabled: true }, Validators.required),
    'celPersona':  new FormControl({ value: '', disabled: true }, Validators.required),
    'tipoVivienda':  new FormControl('', Validators.required),
    'numPersonas':  new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
    'autorizaCorreo':  new FormControl(true),
    'autorizaLlamada':  new FormControl(true),
    'autorizaTodas':  new FormControl(true),
    'autorizaMensaje':  new FormControl(true),
    'autorizaFisico':  new FormControl(true),
    'firma':  new FormControl(''),

    
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.obtenerDatos(); // Llamado del método al inicializar el componente
  }

  obtenerDatos() {
    this.accionistasService.obtenerDatosAutorizacion(this.id).subscribe(
      (datos: Autorizacion) => {
        this.datosAutorizacion = datos;

        const nombreCompleto = datos.nomPri + ' ' + datos.nomSeg + ' ' + datos.apePri + ' ' + datos.apeSeg;

        // Establecer el valor de los campos con el valor obtenido de la API
        this.autorizacionForm.patchValue({
          codUsuario: datos.codUsuario,
          nomPri: nombreCompleto,
          dirDomicilio: datos.dirDomicilio,
          correoPersona: datos.correoPersona,
          telfDomicilio: datos.telfDomicilio,
          celPersona: datos.celPersona,
          firma: datos.firma,

        });

        this.messageFirma = 'data:image/png;base64,' + datos.firma;
        //this.autorizacionForm.get('firma').setValue(messageFirma);
      },
      error => {
        console.error('Error en la solicitud GET:', error);
      }
    );
  }


  onSubmit() { 
    if (this.autorizacionForm.valid) {
      const formData = {
        numSuscripcion: this.autorizacionForm.get('numSuscripcion').value,
        tipoVivienda: this.autorizacionForm.get('tipoVivienda').value,
        numPersonas: this.autorizacionForm.get('numPersonas').value,
        autorizaCorreo: this.autorizacionForm.get('autorizaCorreo').value,
        autorizaLlamada: this.autorizacionForm.get('autorizaLlamada').value,
        autorizaMensaje: this.autorizacionForm.get('autorizaMensaje').value,
        autorizaTodas: this.autorizacionForm.get('autorizaTodas').value,
        autorizaFisico: this.autorizacionForm.get('autorizaFisico').value,
        codUsuario: this.autorizacionForm.get('codUsuario').value
      };
      
      this.accionistasService.enviarDatosAutorizacion(formData).subscribe(
        (response) => {
          const confirmation = this._fuseConfirmationService.open({

            "title": "Envio de datos exitoso!",
            "message": "Pendiente de aprobación.",
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
          this.router.navigate(['accionistas/agregar/declaracion/' + this.autorizacionForm.get('codUsuario').value]);
        },
        (error) => {
          
        }
      );
    }else{
      const confirmation = this._fuseConfirmationService.open({

        "title": "Los datos no fueron enviados!",
        "message": "Por favor revise si el diligenciamento de datos es correcto.",
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
    }
  }

  todasLasAnteriores() {
    const todosLosAnteriores = this.autorizacionForm.get('autorizaTodas');
    if (todosLosAnteriores.value) {
      this.autorizacionForm.patchValue({
        autorizaCorreo: true,
        autorizaLlamada: true,
        autorizaMensaje: true,
        autorizaFisico: true,
      });
    } else {
      this.autorizacionForm.patchValue({
        autorizaCorreo: false,
        autorizaLlamada: false,
        autorizaMensaje: false,
        autorizaFisico: false,
      });
    }
  }

  actualizarAutorizaTodas() {
    const autorizaCorreo = this.autorizacionForm.get('autorizaCorreo').value;
    const autorizaLlamada = this.autorizacionForm.get('autorizaLlamada').value;
    const autorizaMensaje = this.autorizacionForm.get('autorizaMensaje').value;
    const autorizaFisico = this.autorizacionForm.get('autorizaFisico').value;
  
    const todosLosAnteriores = this.autorizacionForm.get('autorizaTodas');
  
    if (!autorizaCorreo || !autorizaLlamada || !autorizaMensaje || !autorizaFisico) {
      todosLosAnteriores.setValue(false);
    }
  }

}

import { Component, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, Validators,FormControl, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AccionistasService } from '../accionistas.service';
import { Accionistas } from '../accionistas.model';
import { Autorizacion } from './autorizacion.model';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
   ],
  templateUrl: './autorizacion.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AutorizacionComponent {
  datosAutorizacion: Autorizacion;

  constructor(private accionistasService: AccionistasService, private router: Router) {}

  autorizacionForm = new FormGroup({
    // Agrega más campos si es necesario según tu interfaz Accionistas
    'numSuscripcion':  new FormControl('', Validators.required),
    'nomPri':  new FormControl(''),
    'codUsuario':  new FormControl('', Validators.required),
    'dirPerDomicilio':  new FormControl('', Validators.required),
    'correoPersona':  new FormControl('', Validators.required),
    'telfDomicilio':  new FormControl('', Validators.required),
    'celPersona':  new FormControl('', Validators.required),
    'tipoVivienda':  new FormControl('', Validators.required),
    'numPersonas':  new FormControl('', Validators.required),
    'opcCorreo':  new FormControl('', Validators.required),
    'opcLlamada':  new FormControl('', Validators.required),
    'opcTodas':  new FormControl('', Validators.required),
    'opcMensaje':  new FormControl('', Validators.required),
    'opcFisico':  new FormControl('', Validators.required),
    
  });

  ngOnInit() {
    this.obtenerDatos(); // Llamado del método al inicializar el componente
  }

  obtenerDatos() {
    this.accionistasService.obtenerDatosAutorizacion().subscribe(
      (datos: Autorizacion) => {
        this.datosAutorizacion = datos;

        const nombreCompleto = datos.nomPri + ' ' + datos.nomSeg + ' ' + datos.apePri + ' ' + datos.apeSeg;

        // Establecer el valor de los campos con el valor obtenido de la API
        this.autorizacionForm.patchValue({
          codUsuario: datos.codUsuario,
          nomPri: nombreCompleto,
          dirPerDomicilio: datos.dirPerDomicilio,
          correoPersona: datos.correoPersona,
          telfDomicilio: datos.telfDomicilio,
          celPersona: datos.celPersona,

        });
      },
      error => {
        console.error('Error en la solicitud GET:', error);
      }
    );
  }


  onSubmit() { 
    console.log('hola');
    if (this.autorizacionForm.valid) {
      const formDataAutorizacion = this.autorizacionForm.value;
      this.accionistasService.enviarDatosAutorizacion(formDataAutorizacion).subscribe(
        (response) => {
          // Aquí puedes manejar la respuesta del servidor
          console.log('Respuesta del servidor: Datos enviados', response);
          this.router.navigate(['control-accionistas/agregar-accionistas/autorizacion/declaracion']);
        },
        (error) => {
          // Manejo de errores si la petición falla
          console.error('Error en la petición:', error);
        }
      );
    }
  }

  createPdf(){

    const pdfDefinition: any = {

      content:[
        {text: 'Hola'}
      ]
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();

  }

}

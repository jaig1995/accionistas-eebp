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
import { Declaracion } from './declaracion.model';

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
  templateUrl: './declaracion.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DeclaracionComponent {
  datosDeclaracion: Declaracion;

  constructor(private accionistasService: AccionistasService) {}

  declaracionForm = new FormGroup({
    // Agrega más campos si es necesario según tu interfaz Accionistas
    'nomPri':  new FormControl(''),
    'codUsuario':  new FormControl('', Validators.required),
    'expIdentificacion':  new FormControl('', Validators.required),
    'nomRepresentante':  new FormControl('', Validators.required),
    'codRepresentante':  new FormControl('', Validators.required),
    'recursos':  new FormControl('', Validators.required),
    'ingresos':  new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.obtenerDatos(); // Llamado del método al inicializar el componente
  }

  obtenerDatos() {
    this.accionistasService.obtenerDatosDeclaracion().subscribe(
      (datos: Declaracion) => {
        this.datosDeclaracion = datos;

        const nombreCompleto = datos.nomPri + ' ' + datos.nomSeg + ' ' + datos.apePri + ' ' + datos.apeSeg;

        // Establecer el valor de los campos con el valor obtenido de la API
        this.declaracionForm.patchValue({
          codUsuario: datos.codUsuario,
          nomPri: nombreCompleto,
          expIdentificacion: datos.expIdentificacion,
          nomRepresentante: nombreCompleto,
          codRepresentante: datos.codRepresentante

        });
      },
      error => {
        console.error('Error en la solicitud GET:', error);
      }
    );
  }


  onSubmit() { 
    console.log('hola');
    if (this.declaracionForm.valid) {
      const formDataAutorizacion = this.declaracionForm.value;
      this.accionistasService.enviarDatosDeclaracion(formDataAutorizacion).subscribe(
        (response) => {
          // Aquí puedes manejar la respuesta del servidor
          console.log('Respuesta del servidor: Datos enviados', response);
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

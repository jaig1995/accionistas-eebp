import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, Validators, FormControl} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';


interface Documento {
  tipoIdPer: string;
}

interface Sexo{
  genPersona: string;
}

interface Correspondencia{
  corresLaboral: string;
}

interface Potestad{
  potestad: string;
}

interface Representante{
  tipoIdRepresentante: string;
}
interface Sexo_repre{
  genRepresentante: string;
}

@Component({
  selector: 'agregar-accionista',
  standalone   : true,
  templateUrl: './addaccionista.component.html',
  imports: [MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDividerModule,
    FormsModule, 
    ReactiveFormsModule, 
    NgFor, 
    NgIf],
  encapsulation: ViewEncapsulation.None,
})


export class AddaccionistaComponent {

  


 //----------------------------

  nomPri: string;
  nomSeg: string;
  apePri: string;
  apeSeg: string;
  identificacion: number;
  expIdentificacion: number;
  nomDep: string;
  fecNacimiento: Date;
  lugNacimiento: string;
  estCivPersona: string;
  celPersona: number;
  profPersona: string;
  actEcoPersona: string;
  correoPersona: string;
  dirPerDomicilio: string;
  barrio: string;
  municipio: string;
  pais: string;
  telfDomicilio: number;
  indTelDomicilio: number;
  nomEmpresa: string;
  dirLaboral: string;
  barLab: string;
  munLaboral: string;
  depLaboral: string;
  paisLab: string;
  telfLaboral: number;
  extLaboral: number;
  cualLaboratorio: string;
  nomRepresentante: string;
  codRepresentante: number;
  expIdeRepresentante: string;
  nomDepRepresentante: string;
  fecNacRepresentante: Date;
  lugNacRepresentante: string;
  estCivRepresentante: string;
  celRepresentante: number;
  profActRepresentante: string;
  correoRepresentante: string;

  constructor(private http: HttpClient) { }
  onSubmit() {
    const data = {
      nomPri: this.nomPri,
      nomSeg: this.nomSeg,
      apePri: this.apePri,
      apeSeg: this.apeSeg,
      identificacion: this.identificacion,
      expIdentificacion: this.expIdentificacion,
      nomDep: this.nomDep,
      fecNacimiento: this.fecNacimiento,
      lugNacimiento: this.lugNacimiento,
      estCivPersona: this.estCivPersona,
      celPersona: this.celPersona,
      profPersona: this.profPersona,
      actEcoPersona: this.actEcoPersona,
      correoPersona: this.correoPersona,
      dirPerDomicilio: this.dirPerDomicilio,
      barrio: this.barrio,
      municipio: this.municipio,
      pais: this.pais,
      telfDomicilio: this.telfDomicilio,
      indTelDomicilio: this.indTelDomicilio,
      nomEmpresa: this.nomEmpresa,
      dirLaboral: this.dirLaboral,
      barLab: this.barLab,
      munLaboral: this.munLaboral,
      depLaboral: this.depLaboral,
      paisLab: this.paisLab,
      telfLaboral: this.telfLaboral,
      extLaboral: this.extLaboral,
      cualLaboratorio: this.cualLaboratorio,
      nomRepresentante: this.nomRepresentante,
      codRepresentante: this.codRepresentante,
      expIdeRepresentante: this.expIdeRepresentante,
      nomDepRepresentante: this.nomDepRepresentante,
      fecNacRepresentante: this.fecNacRepresentante,
      lugNacRepresentante:this.lugNacRepresentante,
      estCivRepresentante: this.estCivRepresentante,
      celRepresentante: this.celRepresentante,
      profActRepresentante: this.profActRepresentante,
      correoRepresentante: this.correoRepresentante
    };
    this.http.post('http://localhost:3000/agregar/accionistas', data).subscribe(response => {
      console.log('Datos enviados:', response);
    });
  }
  documentoControl = new FormControl<Documento | null>(null, Validators.required);
  selectFormControlDocumento = new FormControl('', Validators.required);
  documentos: Documento[] = [
    {tipoIdPer: 'CC'},
    {tipoIdPer: 'CE'},
    {tipoIdPer: 'TI'},
    {tipoIdPer: 'RC'},
  ];

  representanteControl = new FormControl<Representante | null>(null, Validators.required);
  selectFormControlRepresentante = new FormControl('', Validators.required);
  representante: Representante[] = [
    {tipoIdRepresentante: 'CC'},
    {tipoIdRepresentante: 'CE'},
    {tipoIdRepresentante: 'Otro'},
  ];

  sexoControl = new FormControl<Sexo | null>(null, Validators.required);
  selectFormControlSexo = new FormControl('', Validators.required);
  sexo: Sexo[] = [
    {genPersona: 'M'},
    {genPersona: 'F'},
  ];

  sexorepreControl = new FormControl<Sexo_repre | null>(null, Validators.required);
  selectFormControlSexo_Repre = new FormControl('', Validators.required);
  sexo_repre: Sexo_repre[] = [
    {genRepresentante: 'M'},
    {genRepresentante: 'F'},
  ];

  correspondenciaControl = new FormControl<Correspondencia | null>(null, Validators.required);
  selectFormControlCorrespondencia = new FormControl('', Validators.required);
  correspondencia: Correspondencia[] = [
    {corresLaboral: 'Direccion laboral'},
    {corresLaboral: 'Direccion domicilio'},
    {corresLaboral: 'Otra'}
  ];

  potestadControl = new FormControl<Potestad | null>(null, Validators.required);
  selectFormControlPotestad = new FormControl('', Validators.required);
  potestad: Potestad[] = [
    {potestad: 'Si'},
    {potestad: 'No'}
  ];

}

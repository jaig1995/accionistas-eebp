import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, Validators, FormControl} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

interface Animal {
  tipo_id_per: string;
}

interface Sexo{
  gen_per: string;
}

interface Correspondencia{
  corre_lab: string;
}

interface Potestad{
  potestad: string;
}

@Component({
  selector: 'agregaraccionista',
  standalone   : true,
  templateUrl: './addaccionista.component.html',
  imports: [MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
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
  nom_pri: string;
  nom_seg: string;
  ape_pri: string;
  ape_seg: string;
  identificacion: number;
  perfil: string;
  div_exp_ide: number;
  nom_dep: string;
  fec_nac: Date;
  lug_nac: string;
  est_civ_per: string;
  cel_per: number;
  prof_per: string;
  act_eco_per: string;
  correo_per: string;
  dir_per_dom: string;
  barrio: string;
  municipio: string;
  pais: string;
  telf_dom: number;
  ind_tel_dom: number;
  nom_empre: string;
  dir_lab: string;
  bar_lab: string;
  mun_lab: string;
  dep_lab: string;
  pais_lab: string;
  telf_lab: number;
  ext_lab: number;
  cual_lab: string;

  constructor(private http: HttpClient) { }
  onSubmit() {
    const data = {
      nom_pri: this.nom_pri,
      nom_seg: this.nom_seg,
      ape_pri: this.ape_pri,
      ape_seg: this.ape_seg,
      identificacion: this.identificacion,
      perfil: this.perfil,
      div_exp_ide: this.div_exp_ide,
      nom_dep: this.nom_dep,
      fec_nac: this.fec_nac,
      lug_nac: this.lug_nac,
      est_civ_per: this.est_civ_per,
      cel_per: this.cel_per,
      prof_per: this.prof_per,
      act_eco_per: this.act_eco_per,
      correo_per: this.correo_per,
      dir_per_dom: this.dir_per_dom,
      barrio: this.barrio,
      municipio: this.municipio,
      pais: this.pais,
      telf_dom: this.telf_dom,
      ind_tel_dom: this.ind_tel_dom,
      nom_empre: this.nom_empre,
      dir_lab: this.dir_lab,
      bar_lab: this.bar_lab,
      mun_lab: this.mun_lab,
      dep_lab: this.dep_lab,
      pais_lab: this.pais_lab,
      telf_lab: this.telf_lab,
      ext_lab: this.ext_lab,
      cual_lab: this.cual_lab

    };
    this.http.post('URL', data).subscribe(response => {
      console.log('Datos enviados:', response);
    });
  }
  animalControl = new FormControl<Animal | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  animals: Animal[] = [
    {tipo_id_per: 'CC'},
    {tipo_id_per: 'CE'},
    {tipo_id_per: 'TI'},
    {tipo_id_per: 'RC'},
  ];
  sexoControl = new FormControl<Sexo | null>(null, Validators.required);
  selectFormControlSexo = new FormControl('', Validators.required);
  sexo: Sexo[] = [
    {gen_per: 'M'},
    {gen_per: 'F'},
  ];

  correspondenciaControl = new FormControl<Correspondencia | null>(null, Validators.required);
  selectFormControlCorrespondencia = new FormControl('', Validators.required);
  correspondencia: Correspondencia[] = [
    {corre_lab: 'Direccion laboral'},
    {corre_lab: 'Direccion domicilio'},
    {corre_lab: 'Otra'}
  ];

  potestadControl = new FormControl<Potestad | null>(null, Validators.required);
  selectFormControlPotestad = new FormControl('', Validators.required);
  potestad: Potestad[] = [
    {potestad: 'Si'},
    {potestad: 'No'}
  ];
}

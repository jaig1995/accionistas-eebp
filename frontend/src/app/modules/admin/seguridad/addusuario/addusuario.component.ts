import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'agregar',
  standalone   : true,
  templateUrl: './addusuario.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule,MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule, MatIconModule, FormsModule],
})
export class AddusuarioComponent {
  nom_pri: string;
  nom_seg: string;
  ape_pri: string;
  ape_seg: string;
  identificacion: number;
  perfil: string;
  imagen: File;

  constructor(private http: HttpClient) { }
  onSubmit() {
    const data = {
      nom_pri: this.nom_pri,
      nom_seg: this.nom_seg,
      ape_pri: this.ape_pri,
      ape_seg: this.ape_seg,
      identificacion: this.identificacion,
      perfil: this.perfil,
      imagen: this.imagen
    };
    this.http.post('URL', data).subscribe(response => {
      console.log('Datos enviados:', response);
    });
  }
}

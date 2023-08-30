import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { infoAccionistas } from '../../control-accionistas/informacion-accionistas/informacion-accionistas.model';
import {NgIf} from "@angular/common";
import { ServicesConfig } from 'app/services.config';
import { InformacionAccionistasService } from '../../control-accionistas/informacion-accionistas/accionistas-data.service';
import { AccionistasService } from '../addaccionista/accionistas.service';
import { HojaDeRuta } from './hojaderuta.model';

@Component({
  selector: 'hojaderuta',
  standalone   : true,
  imports: [MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf],
  templateUrl: './hojaderuta.component.html',
  encapsulation: ViewEncapsulation.None,
  
})
export class HojaderutaComponent{

  datosHojaDeRuta: HojaDeRuta[];
  id: string;
  displayedColumns: string[] = [ 'avatar', 'accion', 'razon', 'fecha'];
  
  
  constructor( private route: ActivatedRoute, private rutaService: AccionistasService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.obtenerDatos(); 
}

  obtenerDatos() {
  
    this.rutaService.obtenerDatosHojaDeRuta(this.id).subscribe(
      (data: HojaDeRuta[]) => {
        console.log(data);
        this.datosHojaDeRuta = data;
      },
      
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

}

import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { SharedDataService } from '../compartirinfo.service';
import { Subscription } from 'rxjs';
import { TramiteTransaccion } from '../tramitetransacciones/tramitetransacciones.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tablaventa',
  templateUrl: './tablaventa.component.html',
})
export class TablaventaComponent {
  constructor(private sharedDataService: SharedDataService){}
  datosTabla: TramiteTransaccion[];
  displayedColumns: string[] = ['titulo', 'cantidad', 'valor'];
  private datosTablaSubscription: Subscription;

  

  ngOnInit(): void {
   
    this.datosTablaSubscription = this.sharedDataService.datosTabla$.subscribe(
      (datos) => {
        
        this.datosTabla = datos;
        console.log(datos);
        
      }
    );
  }

  ngOnDestroy(): void {
    
    this.datosTablaSubscription.unsubscribe();
  }
}

@NgModule({
  declarations: [TablaventaComponent],
  imports: [
    CommonModule,
    MatTableModule,
  ],
  exports: [TablaventaComponent], 
})


export class TablaventaModule {

}

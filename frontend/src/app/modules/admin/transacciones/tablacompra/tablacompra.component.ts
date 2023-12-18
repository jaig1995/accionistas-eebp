import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { SharedDataService } from '../compartirinfo.service';
import { Subscription } from 'rxjs';
import { TramiteTransaccion } from '../tramitetransacciones/tramitetransacciones.model';
import { MatTableModule } from '@angular/material/table';


@Component({
    selector: 'app-tablacompra',
    templateUrl: './tablacompra.component.html',
})

export class TablacompraComponent {
    
    constructor(private sharedDataService: SharedDataService){}
    
    datosCompra: TramiteTransaccion[];
    displayedColumns: string[] = ['titulo', 'cantidad', 'valor', 'total'];
    
    private datosTablaSubscription: Subscription;
  
    
  
    ngOnInit(): void {
     
      this.datosTablaSubscription = this.sharedDataService.datosTabla$.subscribe(
        (datos) => {
          
          this.datosCompra = datos;
          console.log(datos);
          
        }
      );
    }
  
    ngOnDestroy(): void {
      this.datosTablaSubscription.unsubscribe();
    }
  }
  
  @NgModule({
    declarations: [TablacompraComponent],
    imports: [
      CommonModule,
      MatTableModule,
    ],
    exports: [TablacompraComponent], 
  })
  
  
  export class TablacompraModule {
  
  }
  
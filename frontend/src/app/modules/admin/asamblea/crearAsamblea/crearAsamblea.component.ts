import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';


@Component({
    selector: 'app-crear-asamblea',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AngularMaterialModules,
        TimepickerModule,
        NgxMaterialTimepickerModule
    ],
    providers: [MatDatepickerModule],
    templateUrl: 'crearAsamblea.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearAsambleaComponent {

    //alertas o validaciones
    loading: boolean;
    showAlert: any;

    mytime: Date = new Date();

    //tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['CONSECUTIVO', 'FECHA_ASAMBLEA', 'HORA_ASAMBLEA', 'TIPO', 'ESTADO', 'VER_MAS',  'ACCIONES'];
    dataSource: MatTableDataSource<any>;

    oktTheme = {
        container: {
          bodyBackgroundColor: "#FFFFFF",
          buttonColor: "#002E5F"
        },
        dial: {
          dialBackgroundColor: "#002E5F"
        },
        clockFace: {
          clockFaceBackgroundColor: "#002E5F",
          clockHandColor: "#5A9C30",
          clockFaceTimeInactiveColor: "#FFF"
        }
      };
}

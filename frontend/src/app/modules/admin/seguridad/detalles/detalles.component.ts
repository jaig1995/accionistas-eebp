import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { PermisosService } from './detalles.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Navigation} from "../../../../core/navigation/navigation.types";
import {UserDataService} from "../permisos/user-data.service";
import {Usuario} from "../permisos/usuarios.model";
import {NgForOf, NgIf} from "@angular/common";
import {MatGridListModule} from "@angular/material/grid-list";
import {FuseNavigationItem} from "../../../../../@fuse/components/navigation";
import {FormsModule} from "@angular/forms";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {PermisoModel} from "../permisos/permiso.model";

@Component({
    selector: 'detalles',
    standalone   : true,
    imports: [MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf, MatGridListModule, NgForOf, FormsModule, MatSlideToggleModule],
    templateUrl: './detalles.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class DetallesComponent implements OnInit {

    id: string;
    permisosUsuario: Navigation;
    permisosGenerales: Navigation;
    usuario: Usuario;
    displayedColumns: string[] = ['id', 'title', 'state'];
    dataSource : FuseNavigationItem[];

    constructor(private route: ActivatedRoute, private permisosService: PermisosService, private userDataService : UserDataService) {

    }

    ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.obtenerPermisosPorUsuario();
    this.obtenerPermisosGenerales();
    console.log(this.permisosGenerales);
  }

    obtenerPermisosPorUsuario() {
      this.permisosService.obtenerPermisosPorUsuario(this.id).subscribe((permiso : Navigation) => {
          this.permisosUsuario = permiso;
          this.userDataService.obtenerUsuario(this.id).subscribe((usuario : Usuario) => {
              this.usuario = usuario;
          });
      });
    }

    obtenerPermisosGenerales() {
      this.permisosService.obtenerPermisos().subscribe((permiso : Navigation) => {
          this.permisosGenerales = permiso;
          this.dataSource = permiso.default;
      });
    }

    opcionPermitida(opcionid: string): boolean {
        return this.permisosUsuario.default.some(function (modulo) {
            return modulo.children.some(function (opcion) {
                return opcionid === opcion.id;
            });
        });
    }

    actualizarPermiso(event : any, opcionid: string){
        const permiso: PermisoModel = {
            codUsuario: this.usuario.codUsuario,
            codOpcion: +opcionid
        };
        if(event.checked) {
            this.permisosService.addPermiso(permiso).subscribe((response : any) => {
                console.log(response);
            });
        } else {
            this.permisosService.deletePermiso(permiso).subscribe((response : any) => {
                console.log(response);
            });
        }
    }
}

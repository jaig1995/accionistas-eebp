import { Component, ViewEncapsulation } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector     : '/inicio',
    standalone   : true,
    templateUrl  : './inicio.component.html',
    imports: [MatFormFieldModule],
    encapsulation: ViewEncapsulation.None,
})
export class InicioComponent {

}

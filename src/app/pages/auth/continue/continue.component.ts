import { Component, inject } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { ButtonComponent } from "../../../components/button/button.component";

@Component({
    selector: 'app-continue',
    standalone: true,
    templateUrl: './continue.component.html',
    styleUrl: './continue.component.scss',
    imports: [ButtonComponent]
})
export class ContinueComponent {

  authService = inject(AuthService);

}

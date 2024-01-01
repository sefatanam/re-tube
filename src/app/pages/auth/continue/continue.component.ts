import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../../components/button/button.component";
import { AuthService } from 'services/auth.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-continue',
    standalone: true,
    templateUrl: './continue.component.html',
    styleUrl: './continue.component.scss',
    imports: [ButtonComponent, RouterLink, MatButtonModule],
})
export class ContinueComponent {
    authService = inject(AuthService)
    login() {
        this.authService.continue()
    }
}

import {inject, Injectable} from '@angular/core';
import {Menu} from '@typings/menu.type';
import {AuthService} from "@services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  authService = inject(AuthService);

  private routeButtons: Menu[] = this.makeRouteButtons();
  private routeMenus: Menu[] = this.makeRouteMenus();

  public rootMenu = ({
    routeButtons: this.routeButtons,
    routeMenus: this.routeMenus
  })

  public updateRoutesPermission() {
    return this.rootMenu = ({
      routeButtons: this.makeRouteButtons(),
      routeMenus: this.makeRouteMenus()
    })
  }

  private makeRouteMenus(): Menu[] {
    return [
      {
        name: 'What is Re-tube?',
        route: '/',
        isAvailable: !this.authService.authUser()
      },
      {
        name: 'Public',
        route: '/public',
        isAvailable: true
      },
      // TODO: will be used from here in future
      // {
      //   name: 'Personal',
      //   route: '/player',
      //   isAvailable: !!this.authService.authUser()?.uid,
      //   queryParams: {
      //     "uid": this.authService.authUser()?.uid ?? 'n/a'
      //   }
      // }
    ]
  }

  private makeRouteButtons(): Menu[] {
    return [
      {
        name: 'Login',
        route: '/login',
        isAvailable: true
      }
    ]
  }
}

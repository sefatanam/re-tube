import { Injectable } from '@angular/core';
import { Menu, RootMenu } from '@typings/menu.type';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private routeMenus: Menu[] = [
    {
      name: 'Player',
      route: '/player'
    },
    {
      name: 'Community',
      route: '#'
    },
    {
      name: 'Showcase',
      route: '#'
    }
  ]


  private routeButtons: Menu[] = [
    {
      name: 'What is Re-Learn?',
      route: '/'
    },
    {
      name: 'Login',
      route: '/login'
    }
  ]

  rootMenu: RootMenu = {
    routeButtons: this.routeButtons,
    routeMenus: this.routeMenus
  }
}

export type Menu = {
  name: string;
  route: string;
  queryParams?: { [key: string]: string };
  isAvailable: boolean;
}

export type RootMenu = { routeMenus: Menu[], routeButtons: Menu[] };

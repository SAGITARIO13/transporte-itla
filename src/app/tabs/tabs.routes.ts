import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'book-ticket',
        loadComponent: () =>
          import('../book-ticket/book-ticket.page').then((m) => m.BookTicketPage),
      },
      {
        path: 'request-list',
        loadComponent: () =>
          import('../request-list/request-list.page').then((m) => m.RequestListPage),
      },
      {
        path: 'reserved-list',
        loadComponent: () =>
          import('../reserved/reserved.page').then((m) => m.ReservedPage),
      },
    ],
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'book-ticket',
    loadComponent: () => import('./book-ticket/book-ticket.page').then( m => m.BookTicketPage)
  },
  {
    path: 'request-list',
    loadComponent: () => import('./request-list/request-list.page').then( m => m.RequestListPage)
  },
  {
    path: 'reserved',
    loadComponent: () => import('./reserved/reserved.page').then( m => m.ReservedPage)
  },
  {
    path: 'route-detail',
    loadComponent: () => import('./route-detail/route-detail.page').then( m => m.RouteDetailPage)
  },
  {
    path: 'user-qr',
    loadComponent: () => import('./user-qr/user-qr.page').then( m => m.UserQRPage)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.page').then( m => m.SignUpPage)
  }
];

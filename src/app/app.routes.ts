
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Design } from './pages/design/design';
import { Gallery } from './pages/gallery/gallery';
import { ProjectDetail } from './pages/project-detail/project-detail';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { NotFound } from './pages/not-found/not-found';
import { authGuard, adminGuard } from './guards/auth.guard';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'design', component: Design },
  {
    path: 'gallery',
    component: Gallery,
    canActivate: [authGuard]
  },
  {
    path: 'gallery/:id',
    component: ProjectDetail,
    canActivate: [authGuard]
  },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', component: NotFound }
];

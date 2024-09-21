import { Routes } from '@angular/router';
import { AuthComponent } from '../component/auth/auth.component';
import { MainPageComponent } from '../component/main-page/main-page.component';

export const routes: Routes = [
    {
        path: '',
        component:MainPageComponent ,
    },
    {
        path: 'login',
        component:AuthComponent
    },
];

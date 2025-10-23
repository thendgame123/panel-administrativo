import { Routes } from '@angular/router';


export const pagesRoutes: Routes = [
  {
    path: '',  // ruta base del módulo admin    
    children: [ // 🔹 rutas hijas (las páginas)
      {
        path: 'dashboard',
        loadComponent: () =>
        import('./dashboard/dashboard.component').then(
        (module) => module.DashboardComponent
        ),
      },
      //CATEGORIAS//
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/categories-list/categories-list.component').then(
            (module) => module.CategoriesComponent
          ),
      },
      {
        path: 'categories/editar/:id',
        loadComponent: () =>
          import('./categories/edit-category/edit-category.component').then(
            (module) => module.EditCategory
          ),
      },
      {
        path: 'categories/nuevo',
        loadComponent: () =>
          import('./categories/new-category/new-category.component').then(
            (module) => module.NewCategoryComponent
          ),
      },
      {
        path: 'categories/ver/:id',
        loadComponent: () =>
          import('./categories/watch-category/watch-category.component').then(
            (module) => module.WatchCategoryComponent
          ),
      },
      //CONTENIDOS//
      {
        path: 'contents',
        loadComponent: () =>
          import('./contents/contents-list/contents-list.component').then(
            (module) => module.ContentsListComponent
          ),
      },
      {
        path: 'contents/nuevo',
        loadComponent: () =>
          import('./contents/new-content/new-content.component').then(
            (module) => module.NewContentComponent
          ),
      },
      {
        path: 'contents/editar/:id',
        loadComponent: () =>
          import('./contents/edit-content/edit-content.component').then(
            (module) => module.EditContentComponent
          ),
      },
      {
        path: 'contents/ver/:id',
        loadComponent: () =>
          import('./contents/watch-content/watch-content.component').then(
            (module) => module.WatchContent
          ),
      },
      //USUARIOS//
      {
        path: 'users',
        loadComponent: () =>
          import('./users/users-list/users-list.component').then(
            (module) => module.UsersListComponent
          ),
      },
      {
        path: 'users/nuevo',
        loadComponent: () =>
          import('./users/new-user/new-user.component').then(
            (module) => module.NewUserComponent
          ),
      },
      {
        path: 'users/editar/:id',
        loadComponent: () =>
          import('./users/edit-user/edit-user.component').then(
            (module) => module.EditUserComponent
          ),
      },
      //OFICINAS//
      {
        path: 'offices',
        loadComponent: () =>
          import('./offices/offices-list/offices-list.component').then(
            (module) => module.OfficesListComponent
          ),
      },
      {
        path: 'offices/nuevo',
        loadComponent: () =>
          import('./offices/new-office/new-office.component').then(
            (module) => module.NewOfficeComponent
          ),
      },    
        {
          path: 'offices/editar/:id',
          loadComponent: () =>
            import('./offices/edit-office/edit-office.component').then(
              (module) => module.EditOfficeComponent
            ),
        },
      {
        path: '', // redirección automática al dashboard
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    data: { reuse: false },
  },
  {
    path: 'recipe-details/:id', //:ID PŘEPOSÍLÁ TEN PARAMETR Z TAB1
    loadComponent: () => import('./recipe-details/recipe-details.page').then(m => m.RecipeDetailsPage)
  },
  {
    path: 'recipe-edit/:id',
    loadComponent: () => import('./recipe-edit/recipe-edit.page').then(m => m.RecipeEditPage)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerComponent } from './manager/manager.component';
import { DepartmentComponent } from './department/department.component';


const routes: Routes = [
  { path: 'manager', component: ManagerComponent },
  { path: 'department', component: DepartmentComponent },
  { path: '**', component: DepartmentComponent, pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

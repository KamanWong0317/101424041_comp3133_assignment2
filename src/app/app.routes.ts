import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmployeesComponent } from './employees/employees.component';
import { AddemployeeComponent } from './addemployee/addemployee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'employees/add', component: AddemployeeComponent },
    { path: 'employee/edit/:id', component: UpdateEmployeeComponent }
];

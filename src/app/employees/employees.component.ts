import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GraphQLApiService } from '../service/graph-ql-api.service';

// employee details
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component'; 

// Angular Material 
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employees',
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {
  graphqlApi = inject(GraphQLApiService);
  router = inject(Router);
  dialog = inject(MatDialog);

  employees: any[] = [];

  // Angular Material 
  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'department', 'designation', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  

  // for search employee
  fb = inject(FormBuilder);
  searchForm = this.fb.group({
    department: [''],
    designation: ['']
  });

  ngOnInit() : void{
    this.getEmployees();
  }

  getEmployees(): void{
    this.graphqlApi.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.dataSource.data = employees;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
        alert('Error for loding employee list')
      }
    });
  }

  searchEmployees(): void {
    const department = this.searchForm.value.department ?? '';
    const designation = this.searchForm.value.designation ?? '';
    
    this.graphqlApi.searchEmployees(department, designation).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.dataSource.data = employees;
      },
      error: (err) => {
        console.error('Error search employees:', err);
        alert('Error for search employees')
      }
    });
  }

  addEmployee() {
    this.router.navigate(['/employees/add']);
  }

  viewEmployee(emp: any): void {
    this.dialog.open(EmployeeDetailsComponent, {
      width: '600px',
      data: emp
    });
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employee/edit', id]);
  }
  
  deleteEmployee(id: string): void {
    this.graphqlApi.deleteEmployee(id).subscribe({
      next: (res: any) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message); 
        } else {
          alert('Employee deleted successfully!');
          this.getEmployees();
        }
      },
      error: (err) => {
        console.error('Failed to delete employee:', err);
        alert('Could not delete employee');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
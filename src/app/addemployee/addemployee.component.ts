import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import { GraphQLApiService } from '../service/graph-ql-api.service';

// Angular Material 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-addemployee',
  imports: [
    ReactiveFormsModule, 
    NgIf, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule],
  templateUrl: './addemployee.component.html',
  styleUrl: './addemployee.component.css'
})
export class AddemployeeComponent {
  employeeForm: any;

  formBuilder = inject(FormBuilder);
  router = inject(Router); 
  graphqlApi = inject(GraphQLApiService);

  ngOnInit() : void{
    this.employeeForm  = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required,  Validators.pattern('^(Male|Female|Other)$')]],
      designation: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(1000), Validators.max(100000)]],
      department: ['', [Validators.required]],
      employee_photo: [''],
      date_of_joining: ['', [Validators.required]]
    })
  }

  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.employeeForm.patchValue({
        employee_photo: file.name 
      });
    } else {
      this.employeeForm.patchValue({ employee_photo: '' });
    }
  }


  submit(): void {
    if (this.employeeForm.valid) {
      const variables = this.employeeForm.value;
  
      this.graphqlApi.addEmployee(variables).subscribe({
        next: (res: any) => {
          if (res.errors && res.errors.length > 0) {
            alert(res.errors[0].message);
          } else {
            alert('Employee added successfully!');
            this.router.navigate(['/employees']);
          }
        },
        error: (err) => {
          console.error('Add employee failed:', err);
          alert('Failed to add employee. Please try again.');
        }
      });
    }
  }

  employeeList() {
    this.router.navigate(['/employees']);
  }
}

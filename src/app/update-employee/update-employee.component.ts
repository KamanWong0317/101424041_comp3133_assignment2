import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

// Angular Material 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-employee',
  imports: [
    ReactiveFormsModule, 
    NgIf, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule],
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.css'
})
export class UpdateEmployeeComponent {
  employeeForm: any;
  empId!: string;

  formBuilder = inject(FormBuilder);
  apollo = inject(Apollo);
  router = inject(Router); 
  private route = inject(ActivatedRoute);

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

    this.empId = this.route.snapshot.paramMap.get('id') || '';

    this.apollo.query({
      query: gql`
        query getEmployeeByID($getEmployeeByIdId: ID!) {
          getEmployeeByID(id: $getEmployeeByIdId) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            employee_photo
            created_at
            updated_at
          }
        }
      `,
      variables: { getEmployeeByIdId: this.empId }
    }).subscribe({
      next: (res: any) => {
        const emp = res.data.getEmployeeByID;
        const patch = {
          ...emp,
          date_of_joining: new Date(emp.date_of_joining)
        };
        this.employeeForm.patchValue(patch);
      }
    });
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

  employeeList() {
    this.router.navigate(['/employees']);
  }

  submit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      this.apollo.mutate({
        mutation: gql`
          mutation UpdateEmployee(
          $updateEmployeeId: ID!, 
          $first_name: String!, $last_name: String!, 
          $email: String!, $gender: String!, 
          $designation: String!, $salary: Float!, 
          $date_of_joining: String!, 
          $department: String!, 
          $employee_photo: String) {
          updateEmployee(
          id: $updateEmployeeId, first_name: $first_name, last_name: $last_name, 
          email: $email, gender: $gender, designation: $designation, 
          salary: $salary, date_of_joining: 
          $date_of_joining, department: $department, 
          employee_photo: $employee_photo) {
            id
          }
        }`,
        variables: { updateEmployeeId: this.empId,
          ...this.employeeForm.value},
          errorPolicy: 'all'
      }).subscribe({
        next: (res) => {
          if (res.errors && res.errors.length > 0) {
            alert(res.errors[0].message);
          } else {
            alert('Employee updated!');
            this.router.navigate(['/employees']);
          }
        },
        error: err => alert('Failed to update employee')
      });
    }
  }
}

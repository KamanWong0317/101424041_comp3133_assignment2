import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

// // Angular Material 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    NgIf, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: any;

  formBuilder = inject(FormBuilder);
  apollo = inject(Apollo);
  router = inject(Router); 

  ngOnInit() : void{
    this.loginForm = this.formBuilder.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  submitForm(): void {
    if (this.loginForm?.valid) {
      const { identifier, password } = this.loginForm.value;
      const isEmail = identifier.includes('@');

      this.apollo.query({
        query: gql`
          query Login($username: String, $email: String, $password: String!) {
            login(username: $username, email: $email, password: $password)
          }
        `,
        variables: {
          username: isEmail ? null : identifier,
          email: isEmail ? identifier : null,
          password: password
        },
         errorPolicy: 'all'
      }).subscribe({
        next: (res: any) => {
          if (res.errors && res.errors.length > 0) {
            alert(res.errors[0].message);
          }else {
            const token = res.data.login;
            localStorage.setItem('token', token);
            alert('Login successful!'); 
            this.router.navigate(['/employees']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Login failed. Please check your credentials.');
        }
      });
    }
  }

  signup(): void {
    this.router.navigate(['/signup']);
  }

}
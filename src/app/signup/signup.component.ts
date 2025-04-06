import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';


// // Angular Material 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router){}

  ngOnInit() : void{
    this.signupForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(20)]],
      email: ['', [
        Validators.required, 
        Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  submitForm(): void {
    if (this.signupForm?.valid) {
      const { username, email, password } = this.signupForm.value;

      this.apollo.mutate({
        mutation: gql`
          mutation Signup($username: String!, $email: String!, $password: String!) {
            signup(username: $username, email: $email, password: $password) {
              username
              email
            }
          }
        `,
        variables: { username, email, password },
        errorPolicy: 'all' 
      }).subscribe({
        next: (res: any) => {
          if (res.errors && res.errors.length > 0) {
            alert(res.errors[0].message); 
          } else {
            alert('Signup successful! Please login.');
            this.signupForm.reset();
            this.router.navigate(['/login']); 
          }
        },
        error: (err) => {
          console.error('Signup failed:', err);
          alert('Signup failed. Please try again.');
        }
      });
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

}
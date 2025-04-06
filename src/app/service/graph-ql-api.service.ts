import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphQLApiService {
  constructor(private apollo: Apollo) {}

// user 
  login(identifier: string, password: string) {
    const isEmail = identifier.includes('@');
    return this.apollo.query({
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
    });
  }

  signup( username:string, email: string, password: string ){
    return this.apollo.mutate({
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
    });
  }

// employee
  getAllEmployees() {
    return this.apollo.query({
      query: gql`
        query {
          getAllEmployees {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            department
            created_at
            updated_at
            date_of_joining
            employee_photo
          }
        }
      `,
      fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.getAllEmployees));
  }

  searchEmployees(department: string, designation: string) {
    return this.apollo.query({
      query: gql`
        query Search($department: String, $designation: String) {
          searchEmployees(department: $department, designation: $designation) {
            id
            first_name
            last_name
            email
            department
            designation
          }
        }
      `,
      variables: { department, designation },
      fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.searchEmployees));
  }

  getEmployeeByID(id: string){
    return this.apollo.query({
      query: gql`
        query getEmployeeByID($id: ID!) {
          getEmployeeByID(id: $id) {
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
      variables: { id },
      fetchPolicy: 'no-cache'
    });
  }

  addEmployee(employeeData: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation addEmployee(
          $first_name: String!,
          $last_name: String!,
          $email: String!,
          $gender: String!,
          $designation: String!,
          $salary: Float!,
          $date_of_joining: String!,
          $department: String!,
          $employee_photo: String
        ) {
          addEmployee(
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            gender: $gender,
            designation: $designation,
            salary: $salary,
            date_of_joining: $date_of_joining,
            department: $department,
            employee_photo: $employee_photo
          ) {
            id
          }
        }
      `,
      variables: employeeData,
      errorPolicy: 'all'
    });
  }

  updateEmployee(id:string, formValue: any) {
    return this.apollo.mutate({
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
      variables: { updateEmployeeId: id,
        ...formValue},
        errorPolicy: 'all'
      });
  }

  deleteEmployee(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id)
        }
      `,
      variables: { id },
      errorPolicy: 'all'
    });
  }
}

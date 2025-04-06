import { Component, Inject } from '@angular/core';
import { MatDialogModule  } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule, DatePipe  } from '@angular/common';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, DatePipe ],
})
export class EmployeeDetailsComponent {
 constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

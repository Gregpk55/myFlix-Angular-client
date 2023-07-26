import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userData: any = {};
  

  constructor(
    private fetchApiDataService: FetchApiDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiDataService.getUser(username).subscribe(
        (response: any) => {
          this.userData = response;

          // Convert the date format to "yyyy-MM-dd"
          const originalDate = new Date(this.userData.Birthday);
          const formattedDate = originalDate.toISOString().slice(0, 10);
          this.userData.Birthday = formattedDate;

          // Clear the password 
          this.userData.Password = '';
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  onSubmit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiDataService.editUser(username, this.userData).subscribe(
        (response: any) => {
          this.snackBar.open('User details updated successfully!', 'Close', {
            duration: 2000,
          });
        },
        (error) => {
          console.error(error);
          // Show an error message
          this.snackBar.open('Failed to update user details.', 'Close', {
            duration: 2000,
          });
        }
      );
    }
  }

  onDelete(): void {   
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.fetchApiDataService.deleteUser(userId).subscribe(
        (response: any) => {
          this.snackBar.open('User deleted successfully!', 'Close', {
            duration: 2000,
          });
          
        },
        (error) => {
          console.error(error);
          
          this.snackBar.open('Failed to delete user.', 'Close', {
            duration: 2000,
          });
        }
      );
    }
  }
}

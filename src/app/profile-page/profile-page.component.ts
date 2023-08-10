import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * Profile Page Component
 * Provides methods to fetch, edit, and delete the user profile.
 */
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  /**
   * Current user information
   */
  user: any = {};

  /**
   * Updated password for the user
   */
  updatedPassword: string = '';

  /**
   * @param fetchApiData Service to handle API data
   * @param snackBar Service for showing snack bar notifications
   * @param router Service for handling navigation
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  /**
   * Fetch the user profile information.
   */
  fetchUserProfile(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe((response) => {
        this.user = response;
        this.updatedPassword = ''; 
      }, (error: any) => {
        this.showSnackBar(error);
      });
    }
  }

  /**
   * Edit the user profile with the updated information.
   */
  editUser(): void {
    if (this.updatedPassword) {
      this.user.Password = this.updatedPassword; 
    }
  
    this.fetchApiData.editUser(this.user).subscribe(
      response => {
        console.log('Server response:', response);
        this.showSnackBar('User successfully updated');
        
      },
      error => {
        console.error('There was an error updating the user:', error);
        this.showSnackBar('Error occurred while updating user: ' + error);
      }
    );
  }

  /**
   * Delete the user profile.
   */
  deleteUser(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.deleteUser(username).subscribe({
        next: () => {
          localStorage.clear();
          this.router.navigate(['welcome']);
          this.showSnackBar('User successfully deleted');
        },
        error: (err) => {
          console.log(err); 
          if(err.status === 401){
            this.showSnackBar('Your session has expired or your account has been deleted. Please log in again.');
          } else {
            this.showSnackBar('Error occurred while deleting user: ' + err);
          }
        },
      });
    }
  }

  /**
   * Show a snack bar message.
   * @param message The message to display in the snack bar.
   */
  showSnackBar(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 2000
    });
  }
}

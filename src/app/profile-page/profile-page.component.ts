import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  user: any = {};
  updatedUserData: any = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe((response) => {
        this.user = response;
        this.updatedUserData = {
          Username: this.user.Username,
          Password: this.user.Password, 
          Email: this.user.Email,
          Birthday: formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0')
        };
      }, (error: any) => {
        this.showSnackBar(error);
      });
    }
  }

  updateProfile(): void {
    const username = localStorage.getItem('username');
    if (username) {
      console.log('Username retrieved:', username);
      console.log('Updating user with data:', this.updatedUserData);
  
      if (!this.updatedUserData.Password) {
        this.showSnackBar('Password is required.');
        return;
      }
      if (!this.updatedUserData.Email.includes('@')) {
        this.showSnackBar('Email not valid.');
        return;
      }
  
      this.fetchApiData.editUser(username, this.updatedUserData).subscribe(
        (response) => {
          console.log('Server response:', response); 
          this.showSnackBar('User successfully updated');
          this.user = response;
        },
        (error: any) => {
          console.log('Server error:', error); 
          this.showSnackBar(error);
        }
      );
    } else {
      console.log('Username not found in local storage'); 
    }
  }
  
  
  
  

  
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
  

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 2000
    });
  }
}

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
  updatedUserData: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
    this.updatedUserData = { ...this.user }; 
  }

  fetchUserProfile(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe(
        (response) => {
          this.user = response;
          const rawBirthday = new Date(this.user.Birthday);
          this.updatedUserData.Birthday = formatDate(rawBirthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
        },
        (error: any) => {
          this.showSnackBar(error);
        }
      );
    }
  }

  updateProfile(): void {
    const username = localStorage.getItem('username');
    if (username) {
      const updatedUser = {
        Username: this.updatedUserData.Username,
        Email: this.updatedUserData.Email,
        Birthday: this.updatedUserData.Birthday
      };
  
      this.fetchApiData.editUser(username, updatedUser).subscribe(
        (response) => {
          this.showSnackBar('User successfully updated');
          this.user = response; 
        },
        (error: any) => this.showSnackBar(error)
      );
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

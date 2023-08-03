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
      
      this.fetchApiData.editUser(username, this.updatedUserData).subscribe(
        () => {
          this.showSnackBar('User successfully updated');
          this.fetchUserProfile();
        },
        (error: any) => this.showSnackBar(error)
      );
    }
  }
  

  deleteUser(): void {
    const userId = this.user._id; 
    this.fetchApiData.deleteUser(userId).subscribe(
      () => {
        localStorage.clear();
        this.router.navigate(['welcome']);
        this.showSnackBar('User successfully deleted');
      },
      (error) => this.showSnackBar(error)
    );
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 2000
    });
  }
}

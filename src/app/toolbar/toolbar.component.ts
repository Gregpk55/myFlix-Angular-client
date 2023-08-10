import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; 
import { ProfilePageComponent } from '../profile-page/profile-page.component';

/**
 * Toolbar Component
 * Provides methods to navigate to different parts of the application, open the profile page as a dialog, and logout.
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  /**
   * @param router Service for handling navigation
   * @param dialog Service for handling dialog interactions
   */
  constructor(
    private router: Router,
    public dialog: MatDialog 
  ) {}

  ngOnInit(): void {}

  /**
   * Navigate to the profile page and open it as a dialog.
   */
  goToProfile(): void {
    const dialogRef = this.dialog.open(ProfilePageComponent, { // Open ProfilePageComponent as a dialog
      width: '50%',
      height: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Profile dialog was closed');
    });
  }

  /**
   * Navigate to the movies page.
   */
  goToMovies(): void {
    this.router.navigate(['/movies']);
  }

  /**
   * Logout the user and clear the local storage.
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }
}

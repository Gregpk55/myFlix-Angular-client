import { Component } from '@angular/core';
import { Router }from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToMovies(): void {
    this.router.navigate(['/movies']);
  }

  logout(): void {
    // Clear local storage (remove token, user info, or any other data)
    localStorage.clear();
    // Redirect to the welcome page component
    this.router.navigate(['/welcome']);
  }
}
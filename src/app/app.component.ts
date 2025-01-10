import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: res => console.log(res),
      error: err => {
        console.log(err);
        this.authService.setCurrentUser(null);
      },
    });
  }
}
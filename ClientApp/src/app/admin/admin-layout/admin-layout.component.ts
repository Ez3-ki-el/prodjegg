import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  username: string | null = '';
  sidebarOpen = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    document.body.classList.add('admin-body');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('admin-body');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}

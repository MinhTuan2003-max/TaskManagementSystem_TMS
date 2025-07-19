import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  `
})
export class DashboardRedirect implements OnInit {
  ngOnInit(): void {
    // DashboardResolver sẽ handle redirect logic
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Project, ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit {
  readonly authService = inject(AuthService);
  private readonly projectService = inject(ProjectService);

  projects: Project[] = [];

  categories = ['All', 'Illustration', 'Logo', 'Personal', 'Tattoo'];
  selectedCategory = 'All';

  async ngOnInit(): Promise<void> {
    this.projects = await this.projectService.getProjects();
  }

  get filteredGalleryItems(): Project[] {
    if (this.selectedCategory === 'All') {
      return this.projects;
    }

    return this.projects.filter(
      item => item.category === this.selectedCategory
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
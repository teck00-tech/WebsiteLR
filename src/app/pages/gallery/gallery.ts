import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Project, ProjectService } from '../../services/project.service';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-gallery',
  styleUrl: './gallery.scss',
  templateUrl: './gallery.html',
})
export class Gallery implements OnInit {
  projects: Project[] = [];

  categories = ['All', 'Illustration', 'Logo', 'Personal', 'Tattoo'];
  selectedCategory = 'All';

  constructor(
    public authService: AuthService,
    private projectService: ProjectService,
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.projects = await this.projectService.getProjects();
    this.changeDetector.detectChanges();
  }

  get filteredGalleryItems(): Project[] {
    if (this.selectedCategory === 'All') {
      return this.projects;
    }

    return this.projects.filter(item => item.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}

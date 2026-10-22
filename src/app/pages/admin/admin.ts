import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Project, ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private readonly projectService = inject(ProjectService);

  title = '';
  description = '';
  category = 'Personal';
  imageUrls = '';
  selectedFiles: File[] = [];
  projects: Project[] = [];
  submitted = false;
  saved = false;
  saveFailed = false;

  async ngOnInit(): Promise<void> {
    this.projects = await this.projectService.getProjects();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = Array.from(input.files ?? []);
  }

  async createProject(): Promise<void> {
    this.submitted = true;
    this.saveFailed = false;
    this.saved = false;

    if (!this.title.trim() || !this.description.trim()) {
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        this.selectedFiles.map(file => this.readFile(file))
      );

      const urlImages = this.imageUrls
        .split('\n')
        .map(url => url.trim())
        .filter(Boolean);

      const images = [...uploadedImages, ...urlImages];

      const fallbackImage =
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&h=700&fit=crop';

      await this.projectService.addProject({
        title: this.title.trim(),
        description: this.description.trim(),
        category: this.category,
        image: images[0] || fallbackImage,
        images: images.length ? images : [fallbackImage],
      });

      this.projects = await this.projectService.getProjects();

      this.title = '';
      this.description = '';
      this.imageUrls = '';
      this.selectedFiles = [];
      this.submitted = false;
      this.saved = true;
    } catch (error) {
      console.error('Fehler beim Erstellen des Projekts:', error);
      this.saveFailed = true;
    }
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(file);
    });
  }
}
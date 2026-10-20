import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  images: string[];
}

interface ApiProject {
  id: number;
  title: string;
  description: string;
  category: string;
  images: string[];
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly fallbackImage = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&h=700&fit=crop';
  private readonly defaultProjects: Project[] = [
    {
      id: 'quiet-geometry',
      title: 'Quiet Geometry',
      description: 'A calm visual identity built around balance and space.',
      category: 'Logo',
      image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=900&h=700&fit=crop',
      images: ['https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=900&h=700&fit=crop']
    },
    {
      id: 'after-hours',
      title: 'After Hours',
      description: 'Editorial art direction for a culture-led night series.',
      category: 'Personal',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&h=700&fit=crop',
      images: ['https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&h=700&fit=crop']
    },
    {
      id: 'common-ground',
      title: 'Common Ground',
      description: 'A digital experience that brings people closer together.',
      category: 'Personal',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&h=700&fit=crop',
      images: ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&h=700&fit=crop']
    },
    {
      id: 'soft-signals',
      title: 'Soft Signals',
      description: 'A flexible illustration language for a thoughtful product.',
      category: 'Illustration',
      image: 'https://images.unsplash.com/photo-1507238691767-25ccc7c7f380?w=900&h=700&fit=crop',
      images: ['https://images.unsplash.com/photo-1507238691767-25ccc7c7f380?w=900&h=700&fit=crop']
    },
    {
      id: 'field-notes',
      title: 'Field Notes',
      description: 'A tactile identity for curious minds and open landscapes.',
      category: 'Logo',
      image: 'https://images.unsplash.com/photo-1495562569060-2b5fbe478c94?w=900&h=700&fit=crop',
      images: ['https://images.unsplash.com/photo-1495562569060-2b5fbe478c94?w=900&h=700&fit=crop']
    },
    {
      id: 'lumen',
      title: 'Lumen',
      description: 'An intuitive interface where every detail earns its place.',
      category: 'Personal',
      image: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=900&h=700&fit=crop',
      images: ['https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=900&h=700&fit=crop']
    }
  ];

  constructor(private api: ApiService) {}

  async getProjects(): Promise<Project[]> {
    try {
      const projects = await firstValueFrom(this.api.get<ApiProject[]>('/projects'));
      return projects.map(project => this.mapProject(project));
    } catch {
      return this.defaultProjects;
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      return this.mapProject(await firstValueFrom(this.api.get<ApiProject>(`/projects/${id}`)));
    } catch {
      return (await this.getProjects()).find(project => project.id === id);
    }
  }

  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const response = await firstValueFrom(this.api.post<ApiProject>('/projects', {
      title: project.title,
      description: project.description,
      category: project.category,
      images: project.images
    }));
    return this.mapProject(response);
  }

  private mapProject(project: ApiProject): Project {
    const images = project.images?.length ? project.images : [this.fallbackImage];
    return {
      id: String(project.id),
      title: project.title,
      description: project.description,
      category: project.category,
      image: images[0],
      images
    };
  }
}

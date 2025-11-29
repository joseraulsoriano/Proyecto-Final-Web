import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly defaultTitle = 'CampusForum - Comunidad Universitaria';
  private readonly defaultDescription = 'Plataforma de foro universitario para estudiantes y profesores. Comparte ideas, discute temas académicos y conecta con la comunidad.';
  private readonly defaultKeywords = 'foro universitario, comunidad estudiantil, educación, campus, discusión académica, estudiantes, profesores';
  private readonly defaultImage = '/assets/og-image.png';

  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  setTitle(title: string): void {
    const fullTitle = title ? `${title} - CampusForum` : this.defaultTitle;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
  }

  setDescription(description: string): void {
    const desc = description || this.defaultDescription;
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
  }

  setKeywords(keywords: string): void {
    const keywordsStr = keywords || this.defaultKeywords;
    this.meta.updateTag({ name: 'keywords', content: keywordsStr });
  }

  setImage(imageUrl: string): void {
    const image = imageUrl || this.defaultImage;
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  setCanonicalUrl(url: string): void {
    this.meta.updateTag({ property: 'og:url', content: url });
  }

  setPageMetadata(data: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
  }): void {
    if (data.title) this.setTitle(data.title);
    if (data.description) this.setDescription(data.description);
    if (data.keywords) this.setKeywords(data.keywords);
    if (data.image) this.setImage(data.image);
    if (data.url) this.setCanonicalUrl(data.url);
  }
}




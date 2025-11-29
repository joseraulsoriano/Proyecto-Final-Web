import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../../services/posts';
import { CategoriesService } from '../../../services/categories';
import { AuthService } from '../../../services/auth';
import { CreatePostRequest, UpdatePostRequest, PostStatus, Tag } from '../../../shared/interfaces/post.interface';
import { Category, CategoryStatus } from '../../../shared/interfaces/category.interface';
import { Post } from '../../../shared/interfaces/post.interface';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.scss'
})
export class PostFormComponent implements OnInit {
  postForm!: FormGroup;
  categories: Category[] = [];
  tags: Tag[] = [];
  loading = false;
  error: string | null = null;
  isEditMode = false;
  postId: number | null = null;
  selectedTags: number[] = [];
  PostStatus = PostStatus; // Exponer enum para el template

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      category_id: ['', Validators.required],
      status: [PostStatus.DRAFT, Validators.required],
      tag_ids: [[]]
    });

    this.loadCategories();
    this.loadTags();

    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.postId = +id;
      this.loadPost(+id);
    }
  }

  loadCategories(): void {
    this.categoriesService.getCategories(CategoryStatus.ACTIVE).subscribe({
      next: (response) => {
        this.categories = response.results || response;
      },
      error: (err) => {
        this.error = 'Error al cargar categorías';
      }
    });
  }

  loadTags(): void {
    this.postsService.getTags().subscribe({
      next: (tags) => {
        this.tags = tags;
      },
      error: (err) => {
        console.error('Error al cargar tags:', err);
      }
    });
  }

  loadPost(id: number): void {
    this.loading = true;
    this.postsService.getPost(id).subscribe({
      next: (post) => {
        this.loading = false;
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
          category_id: post.category.id,
          status: post.status
        });
        this.selectedTags = post.tags.map(tag => tag.id);
        this.postForm.patchValue({ tag_ids: this.selectedTags });
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar el post';
      }
    });
  }

  toggleTag(tagId: number): void {
    const index = this.selectedTags.indexOf(tagId);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tagId);
    }
    this.postForm.patchValue({ tag_ids: this.selectedTags });
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTags.includes(tagId);
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.postForm.value;
    const data: CreatePostRequest | UpdatePostRequest = {
      title: formValue.title,
      content: formValue.content,
      category_id: formValue.category_id,
      status: formValue.status,
      tag_ids: formValue.tag_ids
    };

    if (this.isEditMode && this.postId) {
      this.postsService.updatePost(this.postId, data).subscribe({
        next: (post) => {
          this.loading = false;
          this.notificationService.success(`Post "${post.title}" actualizado correctamente`);
          this.router.navigate(['/posts', this.postId]);
        },
        error: (err) => {
          this.loading = false;
          const errorMsg = err.error?.title || err.error?.content || err.error?.detail || 'Error al actualizar el post';
          this.error = errorMsg;
          this.notificationService.error(errorMsg);
        }
      });
    } else {
      this.postsService.createPost(data as CreatePostRequest).subscribe({
        next: (post) => {
          this.loading = false;
          this.notificationService.success(`¡Creaste exitosamente el post "${post.title}"!`);
          this.router.navigate(['/posts', post.id]);
        },
        error: (err) => {
          this.loading = false;
          const errorMsg = err.error?.title || err.error?.content || err.error?.detail || 'Error al crear el post';
          this.error = errorMsg;
          this.notificationService.error(errorMsg);
        }
      });
    }
  }

  get f() {
    return this.postForm.controls;
  }
}

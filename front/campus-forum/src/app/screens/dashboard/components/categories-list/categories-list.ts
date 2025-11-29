import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, PaginatedResponse } from '../../../../services/categories';
import { Category, CategoryStatus, CreateCategoryRequest } from '../../../../shared/interfaces/category.interface';
import { User, UserRole } from '../../../../shared/interfaces/user.interface';
import { NotificationService } from '../../../../core/services/notification';
import { ConfirmDeleteCategoryComponent } from '../../../../modals/confirm-delete-category/confirm-delete-category';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDeleteCategoryComponent],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.scss'
})
export class CategoriesListComponent implements OnInit {
  @Input() user!: User;
  @Input() canEdit: boolean = false; // Admin o Profesor
  
  categories: Category[] = [];
  loading = false;
  showForm = false;
  editingCategory: Category | null = null;
  error: string | null = null;
  showDeleteModal = false;
  selectedCategoryId: number | null = null;
  selectedCategoryName: string = '';
  showArchivedCategories = false;
  suggestedCategories = [
    'Matemáticas',
    'Programación',
    'Ciencias',
    'Humanidades',
    'Proyectos'
  ];
  useSuggestedCategory = false;
  selectedSuggestedCategory = '';
  
  categoryForm: FormGroup;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [CategoryStatus.ACTIVE]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    const status = this.showArchivedCategories ? CategoryStatus.ARCHIVED : CategoryStatus.ACTIVE;
    this.categoriesService.getCategories(status).subscribe({
      next: (response) => {
        this.loading = false;
        this.categories = response?.results || [];
      },
      error: (err) => {
        this.loading = false;
        this.categories = [];
        this.error = 'Error al cargar categorías';
      }
    });
  }

  openCreateForm(): void {
    this.editingCategory = null;
    this.useSuggestedCategory = false;
    this.selectedSuggestedCategory = '';
    this.categoryForm.reset({
      name: '',
      description: '',
      status: CategoryStatus.ACTIVE
    });
    this.showForm = true;
  }

  selectSuggestedCategory(categoryName: string): void {
    this.selectedSuggestedCategory = categoryName;
    this.useSuggestedCategory = true;
    this.categoryForm.patchValue({
      name: categoryName
    });
  }

  useCustomCategory(): void {
    this.useSuggestedCategory = false;
    this.selectedSuggestedCategory = '';
    this.categoryForm.patchValue({
      name: ''
    });
  }

  openEditForm(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || '',
      status: category.status
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingCategory = null;
    this.categoryForm.reset();
    this.error = null;
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const data: CreateCategoryRequest = this.categoryForm.value;

    if (this.editingCategory) {
      // Actualizar
      this.categoriesService.updateCategory(this.editingCategory.id, data).subscribe({
        next: (category) => {
          this.loading = false;
          this.notificationService.success(`Categoría "${category.name}" actualizada correctamente`);
          this.closeForm();
          this.loadCategories();
        },
        error: (err) => {
          this.loading = false;
          const errorMsg = err.error?.name?.[0] || err.error?.message || 'Error al actualizar categoría';
          this.error = errorMsg;
          this.notificationService.error(errorMsg);
        }
      });
    } else {
      // Crear
      this.categoriesService.createCategory(data).subscribe({
        next: (category) => {
          this.loading = false;
          this.notificationService.success(`¡Creaste exitosamente la categoría "${category.name}"!`);
          this.closeForm();
          this.loadCategories();
        },
        error: (err) => {
          this.loading = false;
          const errorMsg = err.error?.name?.[0] || err.error?.message || 'Error al crear categoría';
          this.error = errorMsg;
          this.notificationService.error(errorMsg);
        }
      });
    }
  }

  openDeleteModal(category: Category): void {
    this.selectedCategoryId = category.id;
    this.selectedCategoryName = category.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedCategoryId = null;
    this.selectedCategoryName = '';
  }

  confirmDelete(): void {
    if (!this.selectedCategoryId) return;

    this.loading = true;
    this.categoriesService.deleteCategory(this.selectedCategoryId).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Categoría eliminada correctamente');
        this.showDeleteModal = false;
        this.selectedCategoryId = null;
        this.selectedCategoryName = '';
        this.loadCategories();
      },
      error: (err) => {
        this.loading = false;
        let errorMsg = err.error?.error || err.error?.detail || 'Error al eliminar categoría';
        const suggestion = err.error?.suggestion;
        
        // Si hay sugerencia, mostrarla junto con el error
        if (suggestion) {
          errorMsg = `${errorMsg}. ${suggestion}`;
          this.notificationService.warning(errorMsg);
        } else {
          this.notificationService.error(errorMsg);
        }
        
        this.error = errorMsg;
        this.showDeleteModal = false;
      }
    });
  }

  deleteCategory(id: number): void {
    const category = this.categories.find(c => c.id === id);
    if (category) {
      this.openDeleteModal(category);
    }
  }

  toggleStatus(id: number): void {
    this.loading = true;
    this.categoriesService.toggleStatus(id).subscribe({
      next: (category) => {
        this.loading = false;
        const statusMsg = category.status === 'ACTIVE' ? 'activada' : 'desactivada';
        this.notificationService.success(`Categoría ${statusMsg} correctamente`);
        this.loadCategories();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.error || err.error?.detail || 'Error al cambiar estado';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  archiveCategory(id: number): void {
    const category = this.categories.find(c => c.id === id);
    if (!category) return;

    this.loading = true;
    this.categoriesService.archiveCategory(id).subscribe({
      next: (archivedCategory) => {
        this.loading = false;
        this.notificationService.success(`Categoría "${archivedCategory.name}" archivada correctamente`);
        this.loadCategories();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.error || err.error?.detail || 'Error al archivar categoría';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  restoreCategory(id: number): void {
    const category = this.categories.find(c => c.id === id);
    if (!category) return;

    this.loading = true;
    this.categoriesService.restoreCategory(id).subscribe({
      next: (restoredCategory) => {
        this.loading = false;
        this.notificationService.success(`Categoría "${restoredCategory.name}" restaurada correctamente`);
        this.loadCategories();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.error || err.error?.detail || 'Error al restaurar categoría';
        this.error = errorMsg;
        this.notificationService.error(errorMsg);
      }
    });
  }

  hasPosts(category: Category): boolean {
    return (category.posts_count || 0) > 0;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'badge-active';
      case 'INACTIVE':
        return 'badge-secondary';
      case 'ARCHIVED':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }
}


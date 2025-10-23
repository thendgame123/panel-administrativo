import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location, CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ContentService } from '../../../core/services/content.service';

interface Content {
  id: string;
  title: string;
  description: string;
  category: string;
  htmlContent: string;
  startDate: string;
  endDate: string;
  videoFile: string;
  imageFile: string;
  ships: string[];
  isActive: boolean;
  isScreensaver: boolean;
  layoutPosition: string;
  createdAt: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}
@Component({
  selector: 'app-edit-content',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, QuillModule],
  templateUrl: './edit-content.component.html',
  styleUrl: './edit-content.component.scss'
})
export class EditContentComponent {
  contentForm!: FormGroup;
  submitted = false;
  activeTab: 'visual' | 'html' | 'preview' = 'visual';
  htmlError: string = '';
  contentId: string = '';
  
  // Manejo de imagen
  imageUrl: string = '';
  imagePreviewUrl: string = '';
  selectedImageFile: File | null = null;
  imageFormData: FormData | null = null;
  defaultImage: string = 'assets/images/default.png';
  
  // Manejo de video
  videoUrl: string = '';
  selectedVideoFile: File | null = null;

  // Manejo de PDF (NUEVO)
  pdfUrl: string = '';
  selectedPdfFile: File | null = null;
  
  // Información de modificación
  lastModifiedDate: string = '';
  lastModifiedBy: string = '';
  
  ships: string[] = [
    'CAMISEA',
    'CHIRA',
    'MANTARO I',
    'TROMPETEROS I',
    'URUBAMBA',
    'COLCA'
  ];
  
  selectedShips: string[] = [];
  selectAllShips: boolean = false; // NUEVO

  // Configuración del editor Quill
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadContentData();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.contentForm = this.fb.group({
      categoria: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      descripcion: [''],
      htmlContent: [''],
      layoutPosition: ['left'],
      vigenciaActiva: [false],
      fechaInicio: [''],
      fechaFin: [''],
      videoUrl: [''],
      isActive: [true],
      isScreensaver: [false]
    });
  }

  /**
   * Carga los datos del contenido a editar
   */
  private loadContentData(): void {
    this.route.params.subscribe(params => {
      this.contentId = params['id'];
      
      if (this.contentId) {
        console.log('Cargando contenido con ID:', this.contentId);
        
        // Llamar al servicio para obtener el contenido
        this.contentService.getById(this.contentId).subscribe({
          next: (content: Content) => {
            console.log('Contenido obtenido:', content);
            this.fillForm(content);
          },
          error: (error) => {
            console.error('Error al cargar contenido:', error);
            alert('Error al cargar el contenido');
            this.goBack();
          }
        });
      }
    });
  }

  /**
   * Llena el formulario con los datos del contenido
   */
  private fillForm(content: Content): void {
    // Determinar si la vigencia está activa
    const vigenciaActiva = !!(content.startDate && content.endDate);
    
    // Llenar el formulario
    this.contentForm.patchValue({
      categoria: content.category,
      titulo: content.title,
      descripcion: content.description,
      htmlContent: content.htmlContent,
      layoutPosition: content.layoutPosition || 'left',
      vigenciaActiva: vigenciaActiva,
      fechaInicio: content.startDate,
      fechaFin: content.endDate,
      videoUrl: content.videoFile,
      isActive: content.isActive,
      isScreensaver: content.isScreensaver
    });

    // Configurar imagen
    if (content.imageFile) {
      this.imageUrl = content.imageFile;
      this.imagePreviewUrl = content.imageFile;
    } else {
      this.imagePreviewUrl = this.defaultImage;
    }

    // Configurar video
    if (content.videoFile) {
      this.videoUrl = content.videoFile;
    }

    // Configurar embarcaciones seleccionadas
    this.selectedShips = [...content.ships];

    // Información de modificación
    this.lastModifiedDate = content.lastModifiedDate 
      ? this.formatDateTime(content.lastModifiedDate) 
      : '';
    this.lastModifiedBy = content.lastModifiedBy || '';

    console.log('Formulario llenado con datos del contenido');
    console.log('Embarcaciones seleccionadas:', this.selectedShips);
  }

  /**
   * Formatea fecha y hora
   */
  private formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('es-ES');
    const timeFormatted = date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${dateFormatted}, ${timeFormatted}`;
  }

  /**
   * Cambia entre las pestañas del editor
   */
  switchTab(tab: 'visual' | 'html' | 'preview'): void {
    this.activeTab = tab;
    
    if (tab === 'html') {
      this.validateHTML();
    }
  }

  /**
   * Valida que el HTML no contenga etiquetas prohibidas
   */
  validateHTML(): void {
    const htmlContent = this.contentForm.get('htmlContent')?.value || '';
    const forbiddenTags = /<(img|video|audio|iframe|embed|object)[^>]*>/gi;
    
    if (forbiddenTags.test(htmlContent)) {
      this.htmlError = 'El HTML no puede contener etiquetas de imágenes, videos o audio';
    } else {
      this.htmlError = '';
    }
  }

  /**
   * Obtiene el contenido sanitizado para preview
   */
  get sanitizedContent(): SafeHtml {
    const htmlContent = this.contentForm.get('htmlContent')?.value || '';
    return this.sanitizer.sanitize(1, htmlContent) || '';
  }

  /**
   * Maneja el cambio de estado de vigencia
   */
  onVigenciaToggle(): void {
    const vigenciaActiva = this.contentForm.get('vigenciaActiva')?.value;
    
    if (!vigenciaActiva) {
      this.contentForm.patchValue({
        fechaInicio: '',
        fechaFin: ''
      });
    }
  }

  /**
   * Maneja la selección de video
   */
  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('video/')) {
        alert('Por favor, selecciona un archivo de video válido');
        return;
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo es 100MB');
        return;
      }

      this.selectedVideoFile = file;
      this.uploadVideo(file);
    }
  }

  /**
   * Sube el video al servidor
   */
  private uploadVideo(file: File): void {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('type', 'content_video');
    
    console.log('Subiendo video:', file.name);

    // Simulación
    const tempUrl = URL.createObjectURL(file);
    this.videoUrl = tempUrl;
    this.contentForm.patchValue({
      videoUrl: tempUrl
    });
  }

  /**
   * Maneja la selección de imagen
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        input.value = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo es 5MB');
        input.value = '';
        return;
      }

      this.selectedImageFile = file;
      this.prepareImageUpload(file);
    }
  }

  /**
   * Prepara la imagen para subir
   */
  private prepareImageUpload(file: File): void {
    this.imageFormData = new FormData();
    this.imageFormData.append('image', file);
    this.imageFormData.append('type', 'content_image');
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        this.imagePreviewUrl = e.target.result as string;
      }
    };
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      alert('Error al procesar la imagen');
    };
    reader.readAsDataURL(file);

    console.log('Imagen preparada para subir:', file.name);
  }

  /**
   * Sube la imagen al servidor
   */
  private async uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.imageFormData) {
        resolve('');
        return;
      }

      console.log('Subiendo imagen...');

      // Simulación
      setTimeout(() => {
        const simulatedUrl = `https://api.example.com/uploads/images/${Date.now()}_${this.selectedImageFile?.name}`;
        console.log('Imagen "subida" con URL:', simulatedUrl);
        resolve(simulatedUrl);
      }, 1000);
    });
  }

  /**
   * Elimina la imagen seleccionada
   */
  removeImage(): void {
    console.log('Eliminando imagen...');
    
    this.imageUrl = '';
    this.imagePreviewUrl = this.defaultImage;
    this.selectedImageFile = null;
    this.imageFormData = null;
    
    const fileInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
  }

  /**
   * NUEVO - Maneja la selección de PDF
   */
  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        alert('Por favor, selecciona un archivo PDF válido');
        input.value = '';
        return;
      }

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo es 50MB');
        input.value = '';
        return;
      }

      this.selectedPdfFile = file;
      console.log('PDF seleccionado:', file.name, 'Tamaño:', file.size, 'bytes');
    }
  }

  /**
   * NUEVO - Elimina el PDF seleccionado
   */
  removePdf(): void {
    console.log('Eliminando PDF...');
    
    this.pdfUrl = '';
    this.selectedPdfFile = null;
    
    const fileInputs = document.querySelectorAll('input[type="file"][accept=".pdf"]');
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
    
    console.log('PDF eliminado');
  }

  /**
   * NUEVO - Maneja el cambio de selección de "TODOS" en ubicaciones
   */
  onSelectAllShips(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.selectAllShips = checkbox.checked;
    
    if (this.selectAllShips) {
      this.selectedShips = [...this.ships];
      console.log('Todas las ubicaciones seleccionadas:', this.selectedShips);
    } else {
      this.selectedShips = [];
      console.log('Todas las ubicaciones deseleccionadas');
    }
  }

  /**
   * NUEVO - Actualiza el estado del checkbox "TODOS"
   */
  private updateSelectAllStatus(): void {
    this.selectAllShips = this.selectedShips.length === this.ships.length;
  }

  /**
   * Maneja el cambio de selección de embarcaciones (MODIFICADO)
   */
  onShipChange(ship: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      if (!this.selectedShips.includes(ship)) {
        this.selectedShips.push(ship);
      }
    } else {
      const index = this.selectedShips.indexOf(ship);
      if (index > -1) {
        this.selectedShips.splice(index, 1);
      }
    }

    // NUEVO - Actualizar estado del checkbox "TODOS"
    this.updateSelectAllStatus();
    
    console.log('Embarcaciones seleccionadas:', this.selectedShips);
  }

  /**
   * Verifica si una embarcación está seleccionada
   */
  isShipSelected(ship: string): boolean {
    return this.selectedShips.includes(ship);
  }

  /**
   * Maneja el envío del formulario
   */
  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.contentForm.invalid) {
      this.showValidationErrors();
      return;
    }

    if (this.selectedShips.length === 0) {
      alert('Debe seleccionar al menos una ubicación');
      return;
    }

    if (this.htmlError) {
      alert('El HTML contiene etiquetas no permitidas');
      return;
    }

    // Subir imagen si hay una nueva
    let uploadedImageUrl = this.imageUrl;
    
    if (this.imageFormData && !this.imageUrl) {
      try {
        uploadedImageUrl = await this.uploadImage();
      } catch (error) {
        alert('Error al subir la imagen');
        return;
      }
    }

    await this.updateContent(uploadedImageUrl, this.pdfUrl || this.selectedPdfFile?.name || '');
  }

  /**
   * Muestra los errores de validación
   */
  private showValidationErrors(): void {
    Object.keys(this.contentForm.controls).forEach(key => {
      const control = this.contentForm.get(key);
      control?.markAsTouched();
    });

    const missingFields: string[] = [];
    
    if (this.contentForm.get('categoria')?.hasError('required')) {
      missingFields.push('Categoría');
    }
    if (this.contentForm.get('titulo')?.hasError('required')) {
      missingFields.push('Título');
    }

    if (missingFields.length > 0) {
      alert(`Por favor, completa los siguientes campos requeridos:\n- ${missingFields.join('\n- ')}`);
    }
  }

  /**
   * Actualiza el contenido
   */
  private async updateContent(imageUrl: string, pdfUrl: string): Promise<void> {
    const contentData = {
      id: this.contentId,
      category: this.contentForm.value.categoria,
      title: this.contentForm.value.titulo,
      description: this.contentForm.value.descripcion,
      htmlContent: this.contentForm.value.htmlContent,
      layoutPosition: this.contentForm.value.layoutPosition,
      startDate: this.contentForm.value.fechaInicio,
      endDate: this.contentForm.value.fechaFin,
      videoFile: this.contentForm.value.videoUrl,
      imageFile: imageUrl,
      pdfFile: pdfUrl, // NUEVO
      ships: this.selectedShips,
      isActive: this.contentForm.value.isActive,
      isScreensaver: this.contentForm.value.isScreensaver,
      lastModifiedDate: new Date().toISOString(),
      lastModifiedBy: 'Usuario Actual' // Cambiar por el usuario logueado
    };
    
    console.log('Actualizando contenido:', contentData);

    // Llamar al servicio
    this.contentService.update(this.contentId, contentData).subscribe({
      next: (response) => {
        console.log('Contenido actualizado exitosamente', response);
        alert('Contenido actualizado exitosamente');
        this.router.navigate(['/admin/contents']);
      },
      error: (error) => {
        console.error('Error al actualizar contenido', error);
        alert('Error al actualizar el contenido');
      }
    });
  }

  /**
   * Cancela la edición
   */
  onCancel(): void {
    if (this.contentForm.dirty || this.selectedImageFile || this.selectedVideoFile || this.selectedPdfFile) {
      const confirmCancel = confirm('¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.');
      if (confirmCancel) {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  /**
   * Navega a la página anterior
   */
  goBack(): void {
    this.location.back();
  }
}

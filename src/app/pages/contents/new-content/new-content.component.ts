import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-new-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, QuillModule],
  templateUrl: './new-content.component.html',
  styleUrl: './new-content.component.scss'
})
export class NewContentComponent {
  contentForm!: FormGroup;
  submitted = false;
  activeTab: 'visual' | 'html' | 'preview' = 'visual';
  htmlError: string = '';
  
  // Manejo de imagen
  imageUrl: string = '';
  imagePreviewUrl: string = '';
  selectedImageFile: File | null = null;
  imageFormData: FormData | null = null;
  
  // Manejo de video
  videoUrl: string = '';
  selectedVideoFile: File | null = null;

  // Manejo de PDF (NUEVO)
  pdfUrl: string = '';
  selectedPdfFile: File | null = null;
  
  ships: string[] = [
    'CAMISEA',
    'CHIRA',
    'MANTARO I',
    'TROMPETEROS I',
    'URUBAMBA',
    'COLCA'
  ];
  
  selectedShips: string[] = [];
  selectAllShips: boolean = false; // NUEVO - Para checkbox TODOS

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
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initForm();
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
   * Cambia entre las pestañas del editor
   */
  switchTab(tab: 'visual' | 'html' | 'preview'): void {
    this.activeTab = tab;
    
    // Validar HTML cuando se cambia a la pestaña HTML
    if (tab === 'html') {
      this.validateHTML();
    }
  }

  /**
   * Valida que el HTML no contenga etiquetas prohibidas
   */
  validateHTML(): void {
    const htmlContent = this.contentForm.get('htmlContent')?.value || '';
    
    // Expresión regular para detectar etiquetas img, video, audio
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

      // Validar tipo de archivo
      if (!file.type.startsWith('video/')) {
        alert('Por favor, selecciona un archivo de video válido');
        return;
      }

      // Validar tamaño (máximo 100MB)
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
   * Sube el video al servidor usando FormData
   */
  private uploadVideo(file: File): void {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('type', 'content_video');
    
    console.log('Subiendo video con FormData:', file.name);

    // Aquí iría la llamada al servicio para subir el video
    // this.contentService.uploadVideo(formData).subscribe(
    //   response => {
    //     this.videoUrl = response.url;
    //     this.contentForm.patchValue({
    //       videoUrl: response.url
    //     });
    //   },
    //   error => {
    //     console.error('Error al subir video', error);
    //     alert('Error al subir el video');
    //   }
    // );

    // Simulación: Crear URL local temporal
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

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        input.value = '';
        return;
      }

      // Validar tamaño (máximo 5MB)
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
   * Prepara la imagen para subir usando FormData
   */
  private prepareImageUpload(file: File): void {
    // Crear FormData para enviar al servidor
    this.imageFormData = new FormData();
    this.imageFormData.append('image', file);
    this.imageFormData.append('type', 'content_image');
    
    // Crear preview local usando FileReader
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

    console.log('Imagen preparada para subir:', file.name, 'Tamaño:', file.size, 'bytes');
    
    // Opción 1: Subir inmediatamente (descomenta si lo prefieres)
    // this.uploadImageImmediately();
    
    // Opción 2: La imagen se subirá cuando se envíe el formulario (implementado en onSubmit)
  }

  /**
   * Sube la imagen al servidor inmediatamente (opcional)
   */
  private uploadImageImmediately(): void {
    if (!this.imageFormData) {
      return;
    }

    console.log('Subiendo imagen inmediatamente...');

    // Aquí iría la llamada al servicio para subir la imagen
    // this.contentService.uploadImage(this.imageFormData).subscribe(
    //   response => {
    //     console.log('Imagen subida exitosamente', response);
    //     this.imageUrl = response.url;
    //   },
    //   error => {
    //     console.error('Error al subir imagen', error);
    //     alert('Error al subir la imagen');
    //   }
    // );
  }

  /**
   * Sube la imagen al servidor usando FormData (para el submit)
   */
  private async uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.imageFormData) {
        resolve('');
        return;
      }

      console.log('Subiendo imagen con FormData...');

      // Aquí iría la llamada al servicio para subir la imagen
      // this.contentService.uploadImage(this.imageFormData).subscribe(
      //   response => {
      //     console.log('Imagen subida exitosamente', response);
      //     resolve(response.url);
      //   },
      //   error => {
      //     console.error('Error al subir imagen', error);
      //     reject(error);
      //   }
      // );

      // Simulación: devolver URL simulada después de 1 segundo
      setTimeout(() => {
        const simulatedUrl = `https://api.example.com/uploads/images/${Date.now()}_${this.selectedImageFile?.name}`;
        console.log('Simulación: Imagen "subida" con URL:', simulatedUrl);
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
    this.imagePreviewUrl = '';
    this.selectedImageFile = null;
    this.imageFormData = null;
    
    // Limpiar el input file
    const fileInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
    
    console.log('Imagen eliminada');
  }

  /**
   * NUEVO - Maneja la selección de PDF
   */
  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar tipo de archivo
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecciona un archivo PDF válido');
        input.value = '';
        return;
      }

      // Validar tamaño (máximo 50MB)
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
    
    // Limpiar el input file
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
      // Seleccionar todas las embarcaciones
      this.selectedShips = [...this.ships];
      console.log('Todas las ubicaciones seleccionadas:', this.selectedShips);
    } else {
      // Deseleccionar todas las embarcaciones
      this.selectedShips = [];
      console.log('Todas las ubicaciones deseleccionadas');
    }
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
   * NUEVO - Actualiza el estado del checkbox "TODOS" basado en las selecciones individuales
   */
  private updateSelectAllStatus(): void {
    this.selectAllShips = this.selectedShips.length === this.ships.length;
  }

  /**
   * Maneja el envío del formulario (MODIFICADO para PDF)
   */
  async onSubmit(): Promise<void> {
    this.submitted = true;

    // Validar campos requeridos
    if (this.contentForm.invalid) {
      this.showValidationErrors();
      return;
    }

    // Validar ubicaciones
    if (this.selectedShips.length === 0) {
      alert('Debe seleccionar al menos una ubicación');
      return;
    }

    // Validar HTML
    if (this.htmlError) {
      alert('El HTML contiene etiquetas no permitidas');
      return;
    }

    // Subir imagen si hay una seleccionada y no se ha subido desde URL
    let uploadedImageUrl = this.imageUrl;
    
    if (this.imageFormData && !this.imageUrl) {
      try {
        console.log('Subiendo imagen antes de crear contenido...');
        uploadedImageUrl = await this.uploadImage();
        console.log('URL de imagen obtenida:', uploadedImageUrl);
      } catch (error) {
        console.error('Error en upload:', error);
        alert('Error al subir la imagen');
        return;
      }
    }

    // NUEVO - Subir PDF si hay uno seleccionado
    let uploadedPdfUrl = this.pdfUrl;
    
    if (this.selectedPdfFile && !this.pdfUrl) {
      try {
        console.log('Subiendo PDF antes de crear contenido...');
        uploadedPdfUrl = this.selectedPdfFile.name; // O el URL del servidor
        console.log('PDF preparado:', uploadedPdfUrl);
      } catch (error) {
        console.error('Error en upload de PDF:', error);
        alert('Error al subir el PDF');
        return;
      }
    }

    // Crear el objeto de contenido (MODIFICADO - pasa pdfUrl)
    await this.createContent(uploadedImageUrl, uploadedPdfUrl);
  }

  /**
   * Muestra los errores de validación
   */
  private showValidationErrors(): void {
    // Marcar todos los campos como touched
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
   * Crea el contenido con los datos del formulario (MODIFICADO para PDF)
   */
  private async createContent(imageUrl: string, pdfUrl: string): Promise<void> {
    const contentData = {
      ...this.contentForm.value,
      imagenUrl: imageUrl,
      pdfUrl: pdfUrl, // NUEVO
      ships: this.selectedShips,
      createdAt: new Date().toISOString()
    };
    
    console.log('==========================================');
    console.log('Creando contenido con los siguientes datos:');
    console.log('==========================================');
    console.log('Datos del formulario:', contentData);
    console.log('Archivo de imagen:', this.selectedImageFile);
    console.log('Archivo de PDF:', this.selectedPdfFile); // NUEVO
    console.log('Archivo de video:', this.selectedVideoFile);
    console.log('FormData de imagen:', this.imageFormData);
    console.log('URL de imagen final:', imageUrl);
    console.log('URL de PDF final:', pdfUrl); // NUEVO
    console.log('==========================================');
    
    // Aquí iría la lógica para enviar los datos al backend
    // OPCIÓN 1: Si ya subiste la imagen/video/pdf por separado
    // this.contentService.create(contentData).subscribe(
    //   response => {
    //     console.log('Contenido creado exitosamente', response);
    //     alert('Contenido creado exitosamente');
    //     this.router.navigate(['/contenidos']);
    //   },
    //   error => {
    //     console.error('Error al crear contenido', error);
    //     alert('Error al crear el contenido');
    //   }
    // );

    // Simulación
    alert('Contenido creado exitosamente\n\nVerifica la consola para ver todos los datos.');
    // this.goBack();
  }

  /**
   * Cancela la creación (MODIFICADO para incluir PDF)
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

import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

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
  pdfFile: string;
  ships: string[];
  isActive: boolean;
  isScreensaver: boolean;
  layoutPosition: string;
  createdAt: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  // Datos mock
  private mockContents: Content[] = [
    {
      id: '1',
      title: 'Protocolo de Evacuación de Emergencia',
      description: 'Procedimientos detallados para evacuación en caso de emergencia',
      category: 'Seguridad y Emergencias',
      htmlContent: '<h3>Protocolo de Evacuación</h3><p>En caso de emergencia...</p>',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      videoFile: 'https://ejemplo.com/video1.mp4',
      imageFile: 'assets/images/mant-naval.jpg',
      pdfFile: '',
      ships: ['CAMISEA', 'CHIRA'],
      isActive: true,
      isScreensaver: false,
      layoutPosition: 'left',
      createdAt: '2024-01-15',
      lastModifiedDate: '2025-10-08T10:45:00',
      lastModifiedBy: 'Pedro Sánchez'
    },
    {
      id: '2',
      title: 'Mantenimiento de Motores Diesel',
      description: 'Guía completa de mantenimiento preventivo y correctivo',
      category: 'Mantenimiento Naval',
      htmlContent: '<h3>Mantenimiento Preventivo</h3><p>Los motores diesel requieren...</p>',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      videoFile: '',
      imageFile: 'assets/images/entretenimiento.jpg',
      pdfFile: '',
      ships: ['MANTARO I'],
      isActive: true,
      isScreensaver: true,
      layoutPosition: 'right',
      createdAt: '2024-02-10',
      lastModifiedDate: '2025-10-06T13:20:00',
      lastModifiedBy: 'Laura Fernández'
    },
    {
      id: '3',
      title: 'Cartas Náuticas del Atlántico Sur',
      description: 'Actualizaciones y procedimientos de navegación',
      category: 'Navegación',
      htmlContent: '<h3>Navegación</h3><p>Las cartas náuticas actualizadas...</p>',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      videoFile: 'assets/images/navegacion.jpg',
      imageFile: '',
      pdfFile: '',
      ships: ['TROMPETEROS I', 'URUBAMBA'],
      isActive: false,
      isScreensaver: false,
      layoutPosition: 'center',
      createdAt: '2024-03-05',
      lastModifiedDate: '2025-09-29T15:10:00',
      lastModifiedBy: 'Roberto García'
    },
    {
      id: '4',
      title: 'Manual de Seguridad Marítima Internacional',
      description: 'Normativas internacionales de seguridad en navegación marítima',
      category: 'Seguridad y Emergencias',
      htmlContent: '<h3>Seguridad Marítima</h3><p>Estándares internacionales...</p>',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      videoFile: '',
      imageFile: '',
      pdfFile: 'manual-seguridad-maritima.pdf',
      ships: ['CAMISEA', 'CHIRA', 'MANTARO I', 'TROMPETEROS I', 'URUBAMBA'],
      isActive: true,
      isScreensaver: false,
      layoutPosition: 'center',
      createdAt: '2024-04-20',
      lastModifiedDate: '2025-10-15T14:30:00',
      lastModifiedBy: 'Carlos Mendoza'
    }
  ];

  constructor() {}

  /**
   * Obtiene todos los contenidos
   */
  getAll(): Observable<Content[]> {
    console.log('ContentService: Obteniendo todos los contenidos');
    // Simular llamada HTTP con delay
    return of(this.mockContents).pipe(delay(500));
  }

  /**
   * Obtiene un contenido por ID
   */
  getById(id: string): Observable<Content> {
    console.log('ContentService: Obteniendo contenido con ID:', id);
    
    const content = this.mockContents.find(c => c.id === id);
    
    if (content) {
      // Simular llamada HTTP con delay
      return of(content).pipe(delay(500));
    } else {
      return throwError(() => new Error('Contenido no encontrado'));
    }
  }

  /**
   * Crea un nuevo contenido
   */
  create(contentData: any): Observable<Content> {
    console.log('ContentService: Creando nuevo contenido', contentData);
    
    const newContent: Content = {
      id: Date.now().toString(),
      title: contentData.title || contentData.titulo,
      description: contentData.description || contentData.descripcion,
      category: contentData.category || contentData.categoria,
      htmlContent: contentData.htmlContent,
      startDate: contentData.startDate || contentData.fechaInicio,
      endDate: contentData.endDate || contentData.fechaFin,
      videoFile: contentData.videoFile || contentData.videoUrl,
      imageFile: contentData.imageFile || contentData.imagenUrl,
      pdfFile: contentData.pdfFile || contentData.pdfUrl || '',
      ships: contentData.ships,
      isActive: contentData.isActive,
      isScreensaver: contentData.isScreensaver,
      layoutPosition: contentData.layoutPosition,
      createdAt: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      lastModifiedBy: 'Usuario Actual'
    };

    this.mockContents.push(newContent);
    
    // Simular llamada HTTP con delay
    return of(newContent).pipe(delay(1000));
  }

  /**
   * Actualiza un contenido existente
   */
  update(id: string, contentData: any): Observable<Content> {
    console.log('ContentService: Actualizando contenido', id, contentData);
    
    const index = this.mockContents.findIndex(c => c.id === id);
    
    if (index !== -1) {
      const updatedContent: Content = {
        ...this.mockContents[index],
        title: contentData.title,
        description: contentData.description,
        category: contentData.category,
        htmlContent: contentData.htmlContent,
        startDate: contentData.startDate,
        endDate: contentData.endDate,
        videoFile: contentData.videoFile,
        imageFile: contentData.imageFile,
        pdfFile: contentData.pdfFile,
        ships: contentData.ships,
        isActive: contentData.isActive,
        isScreensaver: contentData.isScreensaver,
        layoutPosition: contentData.layoutPosition,
        lastModifiedDate: contentData.lastModifiedDate,
        lastModifiedBy: contentData.lastModifiedBy
      };

      this.mockContents[index] = updatedContent;
      
      // Simular llamada HTTP con delay
      return of(updatedContent).pipe(delay(1000));
    } else {
      return throwError(() => new Error('Contenido no encontrado'));
    }
  }

  /**
   * Elimina un contenido
   */
  delete(id: string): Observable<void> {
    console.log('ContentService: Eliminando contenido', id);
    
    const index = this.mockContents.findIndex(c => c.id === id);
    
    if (index !== -1) {
      this.mockContents.splice(index, 1);
      // Simular llamada HTTP con delay
      return of(void 0).pipe(delay(500));
    } else {
      return throwError(() => new Error('Contenido no encontrado'));
    }
  }

  /**
   * Actualiza el estado de un contenido
   */
  updateStatus(id: string, isActive: boolean): Observable<Content> {
    console.log('ContentService: Actualizando estado', id, isActive);
    
    const index = this.mockContents.findIndex(c => c.id === id);
    
    if (index !== -1) {
      this.mockContents[index].isActive = isActive;
      this.mockContents[index].lastModifiedDate = new Date().toISOString();
      
      // Simular llamada HTTP con delay
      return of(this.mockContents[index]).pipe(delay(500));
    } else {
      return throwError(() => new Error('Contenido no encontrado'));
    }
  }

  /**
   * Sube una imagen
   */
  uploadImage(formData: FormData): Observable<{url: string}> {
    console.log('ContentService: Subiendo imagen', formData);
    
    // Simular upload exitoso
    const simulatedUrl = `https://api.example.com/uploads/images/${Date.now()}.jpg`;
    
    return of({ url: simulatedUrl }).pipe(delay(1500));
  }

  /**
   * Sube un video
   */
  uploadVideo(formData: FormData): Observable<{url: string}> {
    console.log('ContentService: Subiendo video', formData);
    
    // Simular upload exitoso
    const simulatedUrl = `https://api.example.com/uploads/videos/${Date.now()}.mp4`;
    
    return of({ url: simulatedUrl }).pipe(delay(2000));
  }

  /**
   * Sube un PDF
   */
  uploadPDF(formData: FormData): Observable<{url: string}> {
    console.log('ContentService: Subiendo PDF', formData);
    
    // Simular upload exitoso
    const simulatedUrl = `https://api.example.com/uploads/documents/${Date.now()}.pdf`;
    
    return of({ url: simulatedUrl }).pipe(delay(1500));
  }
}
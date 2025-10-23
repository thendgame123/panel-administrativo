import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  getVisualizacionesContenido() {
    return [
      { nombre: 'Seguridad a Bordo', visualizaciones: 308, color: '#3b82f6', ubicacion: 'CAMISEA' },
      { nombre: 'Mantenimiento Avanzado', visualizaciones: 295, color: '#8b5cf6', ubicacion: 'MANTARO I' },
      { nombre: 'Navegación Avanzada', visualizaciones: 267, color: '#10b981', ubicacion: 'CAMISEA' },
      { nombre: 'Protocolo de Emergencia', visualizaciones: 254, color: '#f59e0b', ubicacion: 'CHIRA' },
      { nombre: 'Seguridad Portuaria', visualizaciones: 241, color: '#ef4444', ubicacion: 'MANTARO I' },
      { nombre: 'Mantenimiento Diario', visualizaciones: 235, color: '#06b6d4', ubicacion: 'CAMISEA' },
      { nombre: 'Comunicaciones', visualizaciones: 226, color: '#3b82f6', ubicacion: 'CHIRA' },
      { nombre: 'Carga y Descarga', visualizaciones: 213, color: '#8b5cf6', ubicacion: 'MANTARO I' },
      { nombre: 'Sistema de Control', visualizaciones: 198, color: '#10b981', ubicacion: 'CAMISEA' },
      { nombre: 'Navegación Básica', visualizaciones: 184, color: '#f59e0b', ubicacion: 'CHIRA' },
      { nombre: 'Sistema Eléctrico', visualizaciones: 172, color: '#ef4444', ubicacion: 'MANTARO I' },
      { nombre: 'Protocolos Radio', visualizaciones: 134, color: '#06b6d4', ubicacion: 'CHIRA' }
    ];
  }

  getEstadoReplica() {
    return [
      {
        registro: 'Tutorial Navegación',
        objeto: 'Video',
        ubicacion: 'CAMISEA',
        duracion: '00:12:35',
        estado: 'En curso',
        fechaInicio: '2025-10-06 08:10:00',
        fechaFin: '-',
        avance: 67
      },
      {
        registro: 'Diagrama Sistema',
        objeto: 'Imagen',
        ubicacion: 'MANTARO I',
        duracion: '-',
        estado: 'Terminado',
        fechaInicio: '2025-10-06 08:15:00',
        fechaFin: '2025-10-06 08:16:30',
        avance: 100
      },
      {
        registro: 'Procedimientos Operativos',
        objeto: 'Video',
        ubicacion: 'MANTARO I',
        duracion: '00:08:20',
        estado: 'Terminado',
        fechaInicio: '2025-10-06 08:25:00',
        fechaFin: '2025-10-06 08:28:45',
        avance: 100
      },
      {
        registro: 'Plano de Cubierta',
        objeto: 'Imagen',
        ubicacion: 'CHIRA',
        duracion: '-',
        estado: 'Terminado',
        fechaInicio: '2025-10-06 08:32:00',
        fechaFin: '2025-10-06 08:33:15',
        avance: 100
      },
      {
        registro: 'Capacitación Seguridad',
        objeto: 'Video',
        ubicacion: 'CAMISEA',
        duracion: '00:15:48',
        estado: 'Terminado',
        fechaInicio: '2025-10-06 08:35:00',
        fechaFin: '2025-10-06 08:40:22',
        avance: 100
      },
      {
        registro: 'Esquema Eléctrico',
        objeto: 'Imagen',
        ubicacion: 'CHIRA',
        duracion: '-',
        estado: 'Error',
        fechaInicio: '2025-10-06 08:42:00',
        fechaFin: '2025-10-06 08:42:45',
        avance: 23
      },
      {
        registro: 'Mantenimiento Motores',
        objeto: 'Video',
        ubicacion: 'CHIRA',
        duracion: '00:22:15',
        estado: 'En curso',
        fechaInicio: '2025-10-06 08:45:00',
        fechaFin: '-',
        avance: 82
      },
      {
        registro: 'Ruta de Evacuación',
        objeto: 'Imagen',
        ubicacion: 'CAMISEA',
        duracion: '-',
        estado: 'Pendiente',
        fechaInicio: '-',
        fechaFin: '-',
        avance: 0
      },
      {
        registro: 'Instrucciones Emergencia',
        objeto: 'Video',
        ubicacion: 'MANTARO I',
        duracion: '00:09:42',
        estado: 'Terminado',
        fechaInicio: '2025-10-06 09:00:00',
        fechaFin: '2025-10-06 09:05:30',
        avance: 100
      },
      {
        registro: 'Señalización de Seguridad',
        objeto: 'Imagen',
        ubicacion: 'MANTARO I',
        duracion: '-',
        estado: 'Terminado',
        fechaInicio: '2025-10-06 09:08:00',
        fechaFin: '2025-10-06 09:09:10',
        avance: 100
      }
    ];
  }
}
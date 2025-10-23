import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

interface ContentView {
  nombre: string;
  visualizaciones: number;
  color: string;
  ubicacion: string;
}

interface ReplicationStatus {
  registro: string;
  objeto: string;
  ubicacion: string;
  duracion: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  avance: number;
}
@Component({
  standalone: true,
  selector: 'admin-dashboard',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  /*private router = inject(Router);
  auth = inject(AuthService);
  user = this.auth.user;

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }*/

   // Visualizaciones de Contenido
  ubicacionSeleccionada = 'Todos';
  mostrarSeleccionado = 'Todos';
  fechaDesde = '2025-10-01';
  fechaHasta = '2025-10-06';
  contenidosCompletos: ContentView[] = [];
  contenidosFiltrados: ContentView[] = [];
  contenidoMasVisto = 'Seguridad a Bordo';
  visualizacionesContenidoMasVisto = 308;
  promedioVisualizaciones = 194;
  totalVisualizaciones = 2327;
  
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      barThickness: 20,
      borderRadius: 4
    }]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.x} visualizaciones`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#e5e7eb'
        },
        ticks: {
          stepSize: 80
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  // Estado de Réplica
  ubicacionReplicaSeleccionada = 'Todos';
  fechaDesdeReplica = '';
  fechaHastaReplica = '';
  estadoSeleccionado = 'Todos';
  registrosReplica: ReplicationStatus[] = [];
  registrosReplicaFiltrados: ReplicationStatus[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargarDatosVisualizaciones();
    this.cargarDatosReplica();
  }

  cargarDatosVisualizaciones() {
    this.contenidosCompletos = this.dashboardService.getVisualizacionesContenido();
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let contenidos = [...this.contenidosCompletos];

    // Aplicar filtro de ubicación
    if (this.ubicacionSeleccionada !== 'Todos') {
      contenidos = contenidos.filter(item => item.ubicacion === this.ubicacionSeleccionada);
    }

    // Ordenar por visualizaciones (de mayor a menor)
    contenidos.sort((a, b) => b.visualizaciones - a.visualizaciones);

    // Aplicar filtro de mostrar (Top 10, Top 5, Todos)
    if (this.mostrarSeleccionado === 'Top 10') {
      contenidos = contenidos.slice(0, 10);
    } else if (this.mostrarSeleccionado === 'Top 5') {
      contenidos = contenidos.slice(0, 5);
    }

    this.contenidosFiltrados = contenidos;
    this.actualizarGrafico();
    this.calcularEstadisticas();
  }

  actualizarGrafico() {
    this.chartData = {
      labels: this.contenidosFiltrados.map(item => item.nombre),
      datasets: [{
        data: this.contenidosFiltrados.map(item => item.visualizaciones),
        backgroundColor: this.contenidosFiltrados.map(item => item.color),
        barThickness: 20,
        borderRadius: 4
      }]
    };
  }

  calcularEstadisticas() {
    if (this.contenidosFiltrados.length > 0) {
      const masVisto = this.contenidosFiltrados[0];
      this.contenidoMasVisto = masVisto.nombre;
      this.visualizacionesContenidoMasVisto = masVisto.visualizaciones;

      const totalVis = this.contenidosFiltrados.reduce((sum, item) => sum + item.visualizaciones, 0);
      this.totalVisualizaciones = totalVis;
      this.promedioVisualizaciones = Math.round(totalVis / this.contenidosFiltrados.length);
    }
  }

  cargarDatosReplica() {
    this.registrosReplica = this.dashboardService.getEstadoReplica();
    this.filtrarRegistrosReplica();
  }

  filtrarRegistrosReplica() {
    this.registrosReplicaFiltrados = this.registrosReplica.filter(registro => {
      const cumpleUbicacion = this.ubicacionReplicaSeleccionada === 'Todos' || 
                              registro.ubicacion === this.ubicacionReplicaSeleccionada;
      const cumpleEstado = this.estadoSeleccionado === 'Todos' || 
                          registro.estado === this.estadoSeleccionado;
      
      return cumpleUbicacion && cumpleEstado;
    });
  }

  onUbicacionReplicaChange() {
    this.filtrarRegistrosReplica();
  }

  onEstadoChange() {
    this.filtrarRegistrosReplica();
  }

  getEstadoClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'En curso': 'estado-en-curso',
      'Terminado': 'estado-terminado',
      'Error': 'estado-error',
      'Pendiente': 'estado-pendiente'
    };
    return clases[estado] || '';
  }

  getAvanceClass(avance: number): string {
    if (avance === 100) return 'avance-completo';
    if (avance >= 50) return 'avance-medio';
    if (avance > 0) return 'avance-bajo';
    return 'avance-cero';
  }
}

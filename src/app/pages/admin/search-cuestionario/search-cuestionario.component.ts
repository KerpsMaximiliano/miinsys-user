import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';

export const CoolTheme = {
  color: [
    '#b21ab4',
    '#6f0099',
    '#2a2073',
    '#0b5ea8',
    '#17aecc',
    '#b3b3ff',
    '#eb99ff',
    '#fae6ff',
    '#e6f2ff',
    '#eeeeee'
  ],

  title: {
    fontWeight: 'normal',
    color: '#00aecd'
  },

  visualMap: {
    color: ['#00aecd', '#a2d4e6']
  },

  toolbox: {
    color: ['#00aecd', '#00aecd', '#00aecd', '#00aecd']
  },

  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    axisPointer: {
      // Axis indicator, coordinate trigger effective
      type: 'line', // The default is a straight line： 'line' | 'shadow'
      lineStyle: {
        // Straight line indicator style settings
        color: '#00aecd',
        type: 'dashed'
      },
      crossStyle: {
        color: '#00aecd'
      },
      shadowStyle: {
        // Shadow indicator style settings
        color: 'rgba(200,200,200,0.3)'
      }
    }
  },

  // Area scaling controller
  dataZoom: {
    dataBackgroundColor: '#eee', // Data background color
    fillerColor: 'rgba(144,197,237,0.2)', // Fill the color
    handleColor: '#00aecd' // Handle color
  },

  timeline: {
    lineStyle: {
      color: '#00aecd'
    },
    controlStyle: {
      color: '#00aecd',
      borderColor: '00aecd'
    }
  },

  candlestick: {
    itemStyle: {
      color: '#00aecd',
      color0: '#a2d4e6'
    },
    lineStyle: {
      width: 1,
      color: '#00aecd',
      color0: '#a2d4e6'
    },
    areaStyle: {
      color: '#b21ab4',
      color0: '#0b5ea8'
    }
  },

  chord: {
    padding: 4,
    itemStyle: {
      color: '#b21ab4',
      borderWidth: 1,
      borderColor: 'rgba(128, 128, 128, 0.5)'
    },
    lineStyle: {
      color: 'rgba(128, 128, 128, 0.5)'
    },
    areaStyle: {
      color: '#0b5ea8'
    }
  },

  graph: {
    itemStyle: {
      color: '#b21ab4'
    },
    linkStyle: {
      color: '#2a2073'
    }
  },

  map: {
    itemStyle: {
      color: '#c12e34'
    },
    areaStyle: {
      color: '#ddd'
    },
    label: {
      color: '#c12e34'
    }
  },

  gauge: {
    axisLine: {
      lineStyle: {
        color: [
          [0.2, '#dddddd'],
          [0.8, '#00aecd'],
          [1, '#f5ccff']
        ],
        width: 8
      }
    }
  }
};

@Component({
  selector: 'app-search-cuestionario',
  templateUrl: './search-cuestionario.component.html',
  styleUrls: ['./search-cuestionario.component.scss'],
})
export class SearchCuestionarioComponent implements OnInit {

  title: string = "Búsqueda"
  formularios = [
    {id: 4, nombre: "Reporte de Mantención preventiva FIT 2000", fechaAlta: "2022-10-22T07:27:21.3"},
    {id: 5, nombre: "Checklist vehiculo de servicio (camionetas) R-064.DRT Sistema de gestión integrado", fechaAlta: "2022-10-22T07:27:21.627"},
  ]
  cuestionarios = [];
  errorCuestionarios = true;
  displayedColumns: string[] = ['id', 'fechaCarga', 'horaCarga','cuestionarioId', 'username'];
  displayedColumns2: string[] = ['id', 'nombre', 'fechaCarga','horaCarga'];
  dataSource = [{}];

  theme!: string | ThemeOption;
  coolTheme = CoolTheme;
  options: EChartsOption = {} as EChartsOption;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cuestionarios = JSON.parse(localStorage.getItem('cuestionarios')!);
    console.log(this.cuestionarios);
    this.dataSource = this.cuestionarios;
    if(this.cuestionarios == undefined) {
      this.errorCuestionarios = true;
    } else {
      let completados4 = 0;
      let completados5 = 0;
      this.cuestionarios.forEach((c: {cuestionario: any}) => {
        if(c.cuestionario.cuestionarioId == 4) {
          completados4++;
        } else {
          completados5++;
        }
      });
      this.options = {
        title: {
          text: 'Cuestionarios Completados'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: ['Reporte de Mantención preventiva FIT 2000', 'Checklist vehiculo de servicio (camionetas) R-064.DRT Sistema de gestión integrado']
        },
        calculable: true,
        series: [
          {
            name: 'area',
            type: 'pie',
            radius: [30, 110],
            roseType: 'area',
            data: [
              { value: completados4, name: 'Reporte de Mantención preventiva FIT 2000' },
              { value: completados5, name: 'Checklist vehiculo de servicio (camionetas) R-064.DRT Sistema de gestión integrado' },
            ]
          }
        ]
      };
      this.errorCuestionarios = false;
    }
  }

  open(row: any) {
    console.log(row);
    this.router.navigate(['/cuestionarios/' + row.id]);
  }


}
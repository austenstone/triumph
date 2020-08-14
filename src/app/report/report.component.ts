import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { OpStatusPipe, OpStatusPipe2 } from './op-status.pipe';

export interface ReportData {
  Status: string;
  TorqueStatus: string;
  Torque: string;
  PVTStatus: string;
  PVT: string;
  DateTime: string;
  TID: string;
  TighteningStatus: string;
  Angle: string;
  AngleStatus: string;
  Batch: string;
  BatchTotal: string;
  DeviceName: string;
  Job: string;
  Pset: string;
  VIN: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'TID', 'Status', 'TorqueStatus', 'Torque',
    'AngleStatus', 'Angle', 'PVTStatus', 'PVT',
    'DateTime'
  ];
  dataSource: MatTableDataSource<ReportData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() reportResults: any[];
  @Input() vin: string;
  @Input() maxRows: number;

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    this.dataSource.data = this.reportResults;
    console.log('maxRows', this.maxRows);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

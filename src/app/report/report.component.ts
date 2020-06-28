import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
    'Status', 'TorqueStatus', 'Torque', 'PVTStatus',
    'PVT', 'DateTime', 'TID'
  ];
  dataSource: MatTableDataSource<ReportData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() reportResults: any[];
  @Input() vin: string;

  constructor() {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.dataSource.data = this.reportResults;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

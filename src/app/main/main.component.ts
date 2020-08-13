import { Component, OnInit, Inject } from '@angular/core';
import { DevicewiseApiService } from 'devicewise-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { StagingFile } from 'devicewise-angular/lib/models/dwresponse';
import { SnackbarService } from '../snackbar.service';
import { finalize, map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  currentFileName: string;
  files: StagingFile[];
  vin: string;
  startDate: MatDatepickerInputEvent<Date>;
  endDate: MatDatepickerInputEvent<Date>;
  advancedSettings = false;
  reportResults: any[];
  config = {
    Start: '0',
    Stop: '0'
  };
  maxRows = 50;

  constructor(
    private dwApi: DevicewiseApiService,
    private snackBarService: SnackbarService,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.dwApi.stagingFileList('www/reports').subscribe((stagingFiles) => {
      this.files = stagingFiles.params.files
        .map((file) => {
          file.created = file.created * 1000;
          file.modified = file.modified * 1000;
          return file;
        })
        .sort((a, b) => b.created - a.created)
        .splice(0, 10);
    });
  }

  generateReport(): void {
    this.snackBarService.open('Generating Report... 📄');
    this._generateReport().subscribe();
  }

  _generateReport(): Observable<any> {
    if (!this.vin) {
      this.snackBarService.openFailure('Missing identifier input');
      this.vin = '';
    }
    let query = `SELECT * FROM MID0061 WHERE VIN='${this.vin}'`;
    const triggerInputVariables: any = {
      VIN: this.vin
    };
    let fileName;
    if (this.advancedSettings) {
      if (this.startDate.value && this.endDate.value) {
        this.config = {
          Start: this.startDate.value.getTime().toString(),
          Stop: this.endDate.value.getTime().toString()
        };
        triggerInputVariables.Start = this.startDate.value.getTime().toString();
        triggerInputVariables.Stop = this.startDate.value.getTime().toString();
        const fromTime = this.formatDate(this.startDate.value);
        const toTime = this.formatDate(this.endDate.value);
        query += ` AND DATETIME BETWEEN "${fromTime}" AND "${toTime}"`;
      }
    } else {
      fileName = `report_${this.vin}.csv`;
    }

    const triggerFire = this.dwApi.subTriggerFire('Triumph', 'Generate Report', true, [triggerInputVariables]);
    const sqlQuery = this.dwApi.sql(query);

    return forkJoin([triggerFire, sqlQuery]).pipe(
      tap(([triggerResult, sqlResult]) => {
        this.currentFileName = fileName;
        if (sqlResult.params.count < 1) {
          this.reportResults = [];
          this.snackBarService.openFailure('No entries in report');
          return;
        }
        const time = (new Date()).getTime();
        const exists = this.files.find((file) => file.name === fileName);

        this.files.unshift({
          type: 'csv',
          name: fileName,
          size: 0,
          created: time,
          modified: time,
        });
        this.snackBarService.openSuccess('Report Generated');

        this.reportResults = sqlResult.params.results.slice(0, this.maxRows);
      })
    );
  }

  logout(): void {
    this.dwApi.logout().pipe(
      finalize(() => this.router.navigate(['/login']))
    ).subscribe();
  }

  downloadReport(name?: string): void {
    if (!this.config?.Start || !this.config?.Stop) {
      this.snackBarService.open('Date range is missing.');
      return;
    }
    this.snackBarService.open('Downloading Report 📄');
    if (!this.reportResults) {
      this._generateReport().subscribe(() => {
        const fileLocation = `${this.dwApi.getEndpoint()}/reports/` + (name || this.currentFileName);
        window.location.href = fileLocation;
      });
    } else {
      const fileLocation = `${this.dwApi.getEndpoint()}/reports/` + (name || this.currentFileName);
      window.location.href = fileLocation;
    }
  }

  printReport(): void {
    this.snackBarService.open('Printing Report 🖨️');

    if (!this.reportResults) {
      this._generateReport().subscribe(() => {
        this.snackBarService.open('Downloading Report 📄');
        const fileLocation = `${this.dwApi.getEndpoint()}/reports/` + (name || this.currentFileName);
        window.location.href = fileLocation;
      });
    }
  }

  _printHtml(content: string): void {
    const iframe = document.createElement('iframe');
    iframe.onload = function() {
      const frame = this as HTMLIFrameElement;
      const contentWindow = frame.contentWindow;
      iframe.contentWindow.document.write(content);
      contentWindow.onbeforeunload = () => {
        document.body.removeChild(frame);
      };
      contentWindow.onafterprint = () => {
        document.body.removeChild(frame);
      };
      contentWindow.focus(); // Required for IE
      contentWindow.print();
    };
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
  }


  formatDate(date: Date): string {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0') +
      ' ' +
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0') + ':' +
      String(date.getSeconds()).padStart(2, '0') + '.' +
      String(date.getMilliseconds()).padStart(3, '0');
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetOverviewExampleSheetComponent, {data: { this: this }});
  }
}

@Component({
  selector: 'app-bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetOverviewExampleSheetComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}
}

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MasksRequetsService } from '../shared/maskrequests.service';
import { MatTableDataSource } from '@angular/material/table';
import { MaskRequest } from '../../app/_interface/maskrequest.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator'
import { ViewRequestComponent } from '../view-request/view-request.component';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['name', 'email', 'qty', 'reqdate', 'status', 'details'];
  public dataSource = new MatTableDataSource<MaskRequest>();

  @ViewChild(MatSort,{static: false}) sort: MatSort;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;

  constructor(private maskRequestService: MasksRequetsService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.getAllMaskRequests();
  }




  public getAllMaskRequests() {
    this.maskRequestService.getData('maskrequests')
      .subscribe(res => {
        this.dataSource.data = res as MaskRequest[];
        console.log(this.dataSource.data)
      })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public customSort = (event) => {
    console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (id: string) => {

  }

  public redirectToUpdate = (id: string) => {

  }

  public redirectToDelete = (id: string) => {

  }

  public editDetails = (id: string) => {
   // this.router.navigate(['/home', {id: id}])
  }

  getDate(currentData) {
    if (!currentData) return ""
    return new Date(currentData._seconds * 1000)
  }

  openDialog(details) {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(ViewRequestComponent, {
      data: details
    });
  }

}

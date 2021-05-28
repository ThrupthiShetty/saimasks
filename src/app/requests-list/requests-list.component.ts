import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MasksRequetsService } from '../shared/maskrequests.service';
import { MatTableDataSource } from '@angular/material/table';
import { MaskRequest } from '../../app/_interface/maskrequest.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator'

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['name', 'email', 'phone', 'qty', 'reqdate', 'address', 'details', 'update'];
  public dataSource = new MatTableDataSource<MaskRequest>();

  @ViewChild(MatSort,{static: false}) sort: MatSort;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;

  constructor(private maskRequestService: MasksRequetsService) { }

  ngOnInit() {
    this.getAllMaskRequests();
  }




  public getAllMaskRequests() {
    this.maskRequestService.getData('maskrequests')
      .subscribe(res => {
        this.dataSource.data = res as MaskRequest[];
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

}

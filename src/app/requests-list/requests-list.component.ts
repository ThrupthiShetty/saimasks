import { Component, OnInit } from '@angular/core';
import { SaimaskService } from '../services/saimask.service';
import { Request } from '../models/request.model';



@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent implements OnInit {
  requests: Request[] = [];
  constructor(private saimaskService: SaimaskService) { }

  ngOnInit() {
    this.getAllRequests()
  }

  getAllRequests() {
    this.saimaskService.getRequests().subscribe((requests: Array<any>) => {
      this.requests = requests;
      //console.log(this.requests)

    });
  }

}

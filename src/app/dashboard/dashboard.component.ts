import { Component, OnInit } from '@angular/core';
import { MasksRequetsService } from '../shared/maskrequests.service';
import { MaskRequest } from '../../app/_interface/maskrequest.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalRequest: number;
  constructor(private maskRequestService: MasksRequetsService) {

   }

  ngOnInit() {
    this.getAllMaskRequests()
  }

  public getAllMaskRequests() {
    this.maskRequestService.getData('maskrequests')
      .subscribe(res => {
        this.totalRequest = (res as MaskRequest[]).length;
      })
  }


}

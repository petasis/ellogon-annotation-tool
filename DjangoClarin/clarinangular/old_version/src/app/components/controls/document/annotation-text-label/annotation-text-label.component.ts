import { Component, Input, OnInit } from '@angular/core';
import { BaseControlComponent } from '../../base-control/base-control.component';

@Component({
  selector: 'annotation-text-label',
  templateUrl: './annotation-text-label.component.html',
  styleUrls: ['./annotation-text-label.component.scss']
})
export class AnnotationTextLabelComponent extends BaseControlComponent implements OnInit {

  @Input() groupType;

  super() { }

  ngOnInit(): void {
  }

}

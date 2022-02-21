import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
})
export class ComingSoonComponent implements OnInit {
  @Input() iconSectionDisplay = true;

  ngOnInit(): void {}

  buildTranslationKey(relativeKey: string): string {
    return `comingSoon.${relativeKey}`;
  }
}

import { Component, EventEmitter, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { Service } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-plugins-header',
  templateUrl: './plugins-header.component.html',
  styleUrls: ['./plugins-header.component.scss'],
})
export class PluginsHeaderComponent implements AfterViewInit {
  @Output()
  search = new EventEmitter<Service[]>();
  @Output()
  searchInputText = new EventEmitter<InputEvent>();
  @Output()
  suggestPlugin = new EventEmitter();

  afterViewHookInitiated: boolean;

  searchDefinitions: SearchDefinitionModel<Service>[] = [
    {
      propertySelector: (c) => c.service_display_name,
    },
  ];

  constructor(private cd: ChangeDetectorRef) {}

  buildTranslationKey(key: string): string {
    return `plugins.header.${key}`;
  }

  ngAfterViewInit(): void {
    // This is an ad hoc approach that solves issue described in ticket AN-1271, But also was found, the issue in the ngbTooltip
    this.afterViewHookInitiated = true;
    // Tests don't pass without detectChanges, only tests issue
    this.cd.detectChanges();
  }
}

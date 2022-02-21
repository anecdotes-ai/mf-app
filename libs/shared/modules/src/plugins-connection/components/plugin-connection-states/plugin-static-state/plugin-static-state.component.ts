import { PluginStaticStateBaseComponent } from './../plugin-static-state-base/plugin-static-state-base.component';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  PluginStaticStateInputKeys,
  PluginStaticStateInputsToTypesMapping,
  PluginStaticStateInputKeysEnum,
  RenderComponentObject,
} from '../../../models/plugin-static-content.model';
import { ActionButtonsPosition } from './action-buttons-position';

@Component({
  selector: 'app-plugin-static-state',
  templateUrl: './plugin-static-state.component.html',
  styleUrls: ['./plugin-static-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginStaticStateComponent
  extends PluginStaticStateBaseComponent
  implements OnInit, OnDestroy, AfterViewInit {

  private get iconAsComponentTypeObject(): RenderComponentObject {
    return this.icon as RenderComponentObject;
  }

  get footerDisplayed(): boolean {
    return this.displayFooter || !!(this.mainButton || this.secondaryButton);
  }

  get headerDisplayed(): boolean {
    return this.displayHeader;
  }

  get isIconComponentType(): boolean {
    return this.icon && !(typeof this.icon === 'string');
  }

  get iconAsPath(): string {
    return this.icon as string;
  }

  @ViewChild('iconComponentContainer', { read: ViewContainerRef }) iconComponentContainer;

  @ViewChild('aboveFooterComponentContainer', { read: ViewContainerRef }) aboveFooterComponentContainer;

  @Input(PluginStaticStateInputKeys.mainButton)
  mainButton: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.mainButton];

  @Input(PluginStaticStateInputKeys.secondaryButton)
  secondaryButton: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.secondaryButton];

  @Input(PluginStaticStateInputKeys.buttonsPosition)
  buttonsPosition: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.buttonsPosition] =
    ActionButtonsPosition.Footer;

  @Input(PluginStaticStateInputKeys.mainDescription)
  mainDescription: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.mainDescription];

  @Input(PluginStaticStateInputKeys.secondaryDescription)
  secondaryDescription: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.secondaryDescription];

  @Input(PluginStaticStateInputKeys.icon)
  icon: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.icon];

  @Input(PluginStaticStateInputKeys.aboveFooterComponentTypeToRender)
  aboveFooterComponentTypeToRender: PluginStaticStateInputsToTypesMapping[PluginStaticStateInputKeysEnum.aboveFooterComponentTypeToRender];

  actionButtonsPositionEnum = ActionButtonsPosition;

  constructor(
    switcher: ComponentSwitcherDirective,
    private resolver: ComponentFactoryResolver,
    cd: ChangeDetectorRef
  ) {
    super(switcher, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngAfterViewInit(): void {
    this.resolveIconIfComponent();
    this.resolveAboveFooterContent();

    this.cd.detectChanges();
  }

  private resolveAboveFooterContent(): void {
    if (this.aboveFooterComponentTypeToRender) {
      const factory = this.resolver.resolveComponentFactory(this.aboveFooterComponentTypeToRender);
      this.aboveFooterComponentContainer = this.aboveFooterComponentContainer.createComponent(factory);
    }
  }

  private resolveIconIfComponent(): void {
    if (this.isIconComponentType) {
      const factory = this.resolver.resolveComponentFactory(this.iconAsComponentTypeObject.componentType);
      this.iconComponentContainer = this.iconComponentContainer.createComponent(factory);
      if (this.iconAsComponentTypeObject.inputData) {
        Object.keys(this.iconAsComponentTypeObject.inputData).forEach((key) => {
          this.iconComponentContainer.instance[key] = this.iconAsComponentTypeObject.inputData[key];
        });
      }
    }
  }
}

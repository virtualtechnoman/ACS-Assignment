/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare module "*.json" {
  const value: any;
  export default value;
}


interface JQuery {
  datepicker: any;
  datetimepicker: any;
  moment: any;
  select2: any;
  iCheck: any;
  animateCss: any;
  actual: any;
  fullscreen: any;
  noUiSlider: any;
  modal: any;
  tab: any;
  multiselect: any;
  spectrum: any;
}
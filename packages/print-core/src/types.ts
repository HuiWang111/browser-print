import type { HTMLStandards } from './constants'

export interface PrinterOptions {
  id?: string;
  standard?: HTMLStandards;
  extraHead?: string[];
  extraCss?: string[];
  iframeTitle?: string;
  url?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
  getUrlAsync?: (resolve: (url: string) => void) => void;
}
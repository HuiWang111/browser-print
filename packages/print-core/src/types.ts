import { HTMLStandards } from './constants'

export interface PrinterOptions {
  id: string;
  standard?: HTMLStandards;
  extraHead?: string[];
  extraCss?: string[];
  iframeTitle?: string;
  onBeforeOpen?: () => void;
  onOpen?: () => void;
}
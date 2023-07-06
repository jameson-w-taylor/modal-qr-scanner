import { Component, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-scanner',
  templateUrl: 'scanner.page.html'
})
export class ScannerPage {
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private router: Router) {}

  async ionViewDidEnter() {
    // NOTE: Make sure to always grant permission when testing this (only happy path is accounted for)
    await BarcodeScanner.prepare();
    await BarcodeScanner.checkPermission({ force: true });
    // Set <html /> background transparent
    await BarcodeScanner.hideBackground();
    // Set Ionic CSS variables to make Ionic component backgrounds transparent
    this.renderer.addClass(this.document.body, 'scanner-active');
    // Scan
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      console.log(result.content);
      this.router.navigate(['home'], { queryParams: { barcode: result.content } });
    } else {
      this.router.navigate(['home']);
    }
  }

  async ionViewWillLeave() {
     // Restore CSS styles and content
     await BarcodeScanner.showBackground();
     this.renderer.removeClass(this.document.body, 'scanner-active');
     await BarcodeScanner.stopScan();
  }
}

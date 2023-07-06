import { Component, Inject, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { IonModal } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonModal) modal?: IonModal;
  scanResult?: string;
  scannerActive: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private route: ActivatedRoute) {}

  ionViewDidEnter() {
    this.scanResult = undefined;
    this.route.queryParams.subscribe(params => {
      this.scanResult = params['barcode'];
    });
  }

  async onWillPresent() {
    this.scanResult = undefined;
    // NOTE: Make sure to always grant permission when testing this (only happy path is accounted for)
    await BarcodeScanner.prepare();
    await BarcodeScanner.checkPermission({ force: true });
  }

  async onDidPresent() {
    // Set flag to hide content in parent page
    this.scannerActive = true;
    // Set <html /> background transparent
    await BarcodeScanner.hideBackground();
    // Set Ionic CSS variables to make Ionic component backgrounds transparent
    this.renderer.addClass(this.document.body, 'scanner-active');
    // Scan
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      this.scanResult = result.content;
    }
    this.modal?.dismiss(null, 'scanner');
  }

  async onWillDismiss() {
    // Restore CSS styles and content
    await BarcodeScanner.showBackground();
    this.renderer.removeClass(this.document.body, 'scanner-active');
    this.scannerActive = false;
    await BarcodeScanner.stopScan();
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

}

import { LandingPage } from '../pom/LandingPage';
import type { Page } from '@playwright/test';


export class TestHelpers {
  // Default test data with env overrides to avoid hardcoding in specs
  static pickupCity(): string {
    return process.env.PICKUP_CITY || 'Košice';
  }

  static pickupCountry(): string {
    return process.env.PICKUP_COUNTRY || 'Slovakia';
  }

  static deliveryCity(): string {
    return process.env.DELIVERY_CITY || 'Brno';
  }

  static deliveryCountry(): string {
    return process.env.DELIVERY_COUNTRY || 'Czechia';
  }
  static generateUniqueEmail(): string {
    const ts = Date.now().toString(36).slice(-6);
    const rnd = Math.random().toString(36).slice(2, 4);
    return `u${ts}${rnd}@example.com`;
  }

  static generateSlovakPhoneNumber(): string {
    const group = () => Math.floor(100 + Math.random() * 900).toString();
    return `+421 911 ${group()} ${group()}`;
  }

  static invalidEmail(): string {
    return 'invalid-email';
  }

  static invalidPhone(): string {
    return '+420 911 123 4567';
  }

  static async fillAllRequiredFields(landingPage: LandingPage): Promise<void> {
    await landingPage.fillNameInput(TestHelpers.randomName());
    await landingPage.fillCompanyNameInput(TestHelpers.randomCompany());
    await landingPage.fillPhoneNumberInput(TestHelpers.generateSlovakPhoneNumber());
    await landingPage.fillEmailInput(TestHelpers.generateUniqueEmail());
    await landingPage.acceptTerms();
  }

  static randomName(): string {
    const first = ['Branislav', 'Marek', 'Jana', 'Lucia', 'Peter', 'Martin'];
    const last = ['Novak', 'Kovac', 'Horvath', 'Sipos', 'Mraz', 'Kral'];
    const f = first[Math.floor(Math.random() * first.length)];
    const l = last[Math.floor(Math.random() * last.length)];
    return `${f} ${l}`;
  }

  static randomCompany(): string {
    const prefixes = ['Test', 'Acme', 'Global', 'Prime', 'Nova', 'Blue'];
    const suffixes = ['Logistics', 'Solutions', 'Industries', 'Systems', 'Group', 'Labs'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${p} ${s}`;
  }

  static randomPassword(): string {
    const base = Math.random().toString(36).slice(-8);
    return `Aa1!${base}`;
  }

  static futureDate(daysAhead: number): string {
    const now = new Date();
    const d = new Date(now);
    d.setDate(d.getDate() + daysAhead);
    d.setSeconds(0, 0);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
  }

  static addDaysToDateString(dateTime: string, days: number): string {
    // Expects format 'dd.mm.yyyy hh:mm'
    const match = dateTime.match(/^(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})$/);
    if (!match) {
      throw new Error(`Invalid dateTime format: ${dateTime}`);
    }
    const ddStr = match[1]!;
    const mmStr = match[2]!;
    const yyyyStr = match[3]!;
    const hhStr = match[4]!;
    const minStr = match[5]!;
    const dd = parseInt(ddStr, 10);
    const mm = parseInt(mmStr, 10);
    const yyyy = parseInt(yyyyStr, 10);
    const hh = parseInt(hhStr, 10);
    const min = parseInt(minStr, 10);
    const d = new Date(yyyy, mm - 1, dd, hh, min, 0, 0);
    d.setDate(d.getDate() + days);
    const ddOut = String(d.getDate()).padStart(2, '0');
    const mmOut = String(d.getMonth() + 1).padStart(2, '0');
    const yyyyOut = d.getFullYear();
    const hhOut = String(d.getHours()).padStart(2, '0');
    const minOut = String(d.getMinutes()).padStart(2, '0');
    return `${ddOut}.${mmOut}.${yyyyOut} ${hhOut}:${minOut}`;
  }


  static async login(page: Page, landingPage: LandingPage): Promise<void> {
    const email = process.env.LOGIN_EMAIL || '';
    const password = process.env.LOGIN_PASSWORD || '';
    if (!email || !password) {
      throw new Error('Missing LOGIN_EMAIL or LOGIN_PASSWORD env variables');
    }
    
    await page.goto('/login');
    await landingPage.fillEmailInput(email);
    await landingPage.fillPasswordInput(password);
    await landingPage.submitLoginButton.click();
  }

}

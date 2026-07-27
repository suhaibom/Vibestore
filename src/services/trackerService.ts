import { storageService } from './storageService';
import type { User } from '../types';

class TrackerService {
  private activeSessionId: string;
  private currentPath: string = '';

  constructor() {
    this.activeSessionId = storageService.getSessionId();
  }

  private getBrowserInfo(): { browser: string; deviceType: string } {
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    let deviceType = 'Desktop';

    if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
    else if (ua.includes('Trident')) browser = 'Internet Explorer';
    else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome')) browser = 'Google Chrome';
    else if (ua.includes('Safari')) browser = 'Apple Safari';

    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      deviceType = 'Mobile Phone';
    } else if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle)/.test(ua.toLowerCase())) {
      deviceType = 'Tablet';
    }

    return { browser, deviceType };
  }

  private getMockIpAddress(sessionId: string): string {
    let hash = 0;
    for (let i = 0; i < sessionId.length; i++) {
      hash = (hash << 5) - hash + sessionId.charCodeAt(i);
      hash |= 0;
    }
    const octet1 = 100 + (Math.abs(hash) % 150);
    const octet2 = 45 + (Math.abs(hash >> 2) % 180);
    const octet3 = 10 + (Math.abs(hash >> 4) % 200);
    const octet4 = 1 + (Math.abs(hash >> 6) % 254);
    return `${octet1}.${octet2}.${octet3}.${octet4}`;
  }

  trackPageView(pageName: string, currentUser?: User | null) {
    if (this.currentPath === pageName) return;
    this.currentPath = pageName;

    const { browser, deviceType } = this.getBrowserInfo();
    const ipAddress = this.getMockIpAddress(this.activeSessionId);

    storageService.logVisitor({
      sessionId: this.activeSessionId,
      userId: currentUser?.id,
      userName: currentUser?.name || 'Guest Visitor',
      userEmail: currentUser?.email,
      pageVisited: pageName,
      deviceType,
      browser,
      ipAddress,
      location: 'India (Kerala)',
    });
  }
}

export const trackerService = new TrackerService();

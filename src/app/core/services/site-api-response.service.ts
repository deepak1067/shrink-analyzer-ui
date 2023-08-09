import {Injectable} from '@angular/core';
import {Site} from '../../shared/interface/Site';

@Injectable({
  providedIn: 'root'
})
export class SiteApiResponseService {
  labelMap: Map<string, Site[]> = new Map<string, Site[]>();
  hierarchyMap: Map<string, Site> = new Map<string, Site>();
  nameMap: Map<string, Site> = new Map<string, Site>();
  siteCodeMap: Map<string, Site> = new Map<string, Site>();

  constructor() {
    this.loadMapsFromLocalStorage();
  }

  private loadMapsFromLocalStorage(): void {
    const labelMapString = localStorage.getItem('labelMap');
    if (labelMapString) {
      this.labelMap = new Map<string, Site[]>(JSON.parse(labelMapString));
    }

    const hierarchyMapString = localStorage.getItem('hierarchyMap');
    if (hierarchyMapString) {
      this.hierarchyMap = new Map<string, Site>(JSON.parse(hierarchyMapString));
    }

    const nameMapString = localStorage.getItem('nameMap');
    if (nameMapString) {
      this.nameMap = new Map<string, Site>(JSON.parse(nameMapString));
    }

    const siteCodeMapString = localStorage.getItem('siteCodeMap');
    if (siteCodeMapString) {
      this.siteCodeMap = new Map<string, Site>(JSON.parse(siteCodeMapString));
    }
  }

  setSiteData(data: Site[]): number {
    this.updateMaps(data);
    this.updateLocalStorage();
    return data.length;
  }

  private updateMaps(data: Site[]): void {
    this.labelMap.clear();
    this.hierarchyMap.clear();
    this.nameMap.clear();
    this.siteCodeMap.clear();

    for (const site of data) {
      for (const label of site.labels) {
        if (!this.labelMap.has(label)) {
          this.labelMap.set(label, []);
        }
        this.labelMap.get(label)?.push(site);
      }
      this.hierarchyMap.set(site['geo-location'].hierarchy, site);
      this.nameMap.set(site.name, site);
      this.siteCodeMap.set(site.code, site);
    }
  }

  private updateLocalStorage(): void {
    localStorage.setItem('labelMap', JSON.stringify(Array.from(this.labelMap.entries())));
    localStorage.setItem('hierarchyMap', JSON.stringify(Array.from(this.hierarchyMap.entries())));
    localStorage.setItem('nameMap', JSON.stringify(Array.from(this.nameMap.entries())));
    localStorage.setItem('siteCodeMap', JSON.stringify(Array.from(this.siteCodeMap.entries())));
  }

  getSiteByLabel(label: string): Site[] | undefined {
    return this.labelMap.get(label) ?? [];
  }

  getSiteByHierarchy(hierarchy: string): Site | undefined {
    return this.hierarchyMap.get(hierarchy);
  }

  getSiteByName(siteName: string): Site | undefined {
    return this.nameMap.get(siteName);
  }

  getGeoLocationBySiteName(siteName: string): { latitude: number; longitude: number } | undefined {
    const site = this.nameMap.get(siteName);
    return site?.['geo-location'].coordinates;
  }

  getLabelsBySiteName(siteName: string): string[] | undefined {
    const site = this.nameMap.get(siteName);
    return site?.labels;
  }

  getSiteNameBySiteCode(siteCode: string): string | undefined {
    const site = this.siteCodeMap.get(siteCode);
    return site?.name;
  }

  getSiteCodeBySiteName(siteName: string): string | undefined {
    const site = this.nameMap.get(siteName);
    return site?.code;
  }
}

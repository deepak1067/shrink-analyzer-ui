import { SiteApiResponseService } from './site-api-response.service';
import { Site } from '../../shared/interface/Site';

describe('SiteApiResponseService', () => {
  let service: SiteApiResponseService;
  const siteData: Site[] = [
    {
      code: 'Site Code 1',
      name: 'Site Name 1',
      timezone: 'Asia/Bishkek',
      'geo-location': {
        hierarchy: 'Asia/Bishkek/Iradan',
        coordinates: {
          latitude: 40.266667,
          longitude: 72.1
        }
      },
      labels: ['Label 1', 'Label 2'],
      'exit-doors': [
        { id: 1, name: 'Exit Door 1' },
        { id: 2, name: 'Exit Door 2' }
      ]
    },
  ];

  beforeEach(() => {
    service = new SiteApiResponseService();
  });

  it('should set site data and update maps correctly', () => {
    service.setSiteData(siteData);
    expect(service.labelMap.size).toBe(2);
    expect(service.hierarchyMap.size).toBe(1);
    expect(service.nameMap.size).toBe(1);
    expect(service.siteCodeMap.size).toBe(1);
  });

  it('should retrieve site by label', () => {
    service.setSiteData(siteData);
    const site = service.getSiteByLabel('Label 1');
    expect(site).toBeDefined();
    expect(site?.[0].name).toBe('Site Name 1');
  });

  it('should retrieve site by hierarchy', () => {
    service.setSiteData(siteData);
    const site = service.getSiteByHierarchy('Asia/Bishkek/Iradan');
    expect(site).toBeDefined();
    expect(site?.name).toBe('Site Name 1');
  });

  it('should retrieve site by name', () => {
    service.setSiteData(siteData);
    const site = service.getSiteByName('Site Name 1');
    expect(site).toBeDefined();
    expect(site?.code).toBe('Site Code 1');
  });

  it('should retrieve geoLocation by site name', () => {
    service.setSiteData(siteData);
    const geoLocation = service.getGeoLocationBySiteName('Site Name 1');
    expect(geoLocation).toBeDefined();
    expect(geoLocation?.latitude).toBe(40.266667);
    expect(geoLocation?.longitude).toBe(72.1);
  });

  it('should retrieve labels by site name', () => {
    service.setSiteData(siteData);
    const labels = service.getLabelsBySiteName('Site Name 1');
    expect(labels).toBeDefined();
    expect(labels).toContain('Label 1');
    expect(labels).toContain('Label 2');
  });

  it('should retrieve site name by site code', () => {
    service.setSiteData(siteData);
    const siteName = service.getSiteNameBySiteCode('Site Code 1');
    expect(siteName).toBeDefined();
    expect(siteName).toBe('Site Name 1');
  });

  it('should retrieve site code by site name', () => {
    service.setSiteData(siteData);
    const siteCode = service.getSiteCodeBySiteName('Site Name 1');
    expect(siteCode).toBeDefined();
    expect(siteCode).toBe('Site Code 1');
  });

});

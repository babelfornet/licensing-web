import { LicensingWebPage } from './app.po';

describe('licensing-web App', () => {
  let page: LicensingWebPage;

  beforeEach(() => {
    page = new LicensingWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

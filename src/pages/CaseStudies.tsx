import React from 'react';
import { getDeviceType } from '../utils/responsive/device';
import MobileCaseStudies from '../components/mobile/CaseStudies/MobileCaseStudies';
import TabletCaseStudies from '../components/tablet/CaseStudies/TabletCaseStudies';
import DesktopCaseStudies from '../components/desktop/CaseStudies/DesktopCaseStudies';

const CaseStudies = () => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case 'mobile':
      return <MobileCaseStudies />;
    case 'tablet':
      return <TabletCaseStudies />;
    default:
      return <DesktopCaseStudies />;
  }
};

export default CaseStudies;
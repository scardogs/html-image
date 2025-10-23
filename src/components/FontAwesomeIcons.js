import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPhone,
  faEnvelope,
  faShareNodes,
  faCheck,
  faStar,
  faCheckCircle,
  faDownload,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

// Add icons to the library
library.add(
  faPhone,
  faEnvelope,
  faShareNodes,
  faCheck,
  faStar,
  faCheckCircle,
  faDownload,
  faGlobe
);

// Font Awesome SVG icons mapping using official package
export const createFontAwesomeSVG = (iconName, isBrand = false) => {
  console.log(
    "createFontAwesomeSVG called with:",
    iconName,
    "isBrand:",
    isBrand
  );

  const iconMap = {
    phone: faPhone,
    envelope: faEnvelope,
    "share-nodes": faShareNodes,
    check: faCheck,
    star: faStar,
    "check-circle": faCheckCircle,
    download: faDownload,
    globe: faGlobe,
  };

  const iconDefinition = iconMap[iconName];
  if (!iconDefinition) {
    console.log(
      "createFontAwesomeSVG result for",
      iconName,
      ": FAILED - Icon not found"
    );
    return null;
  }

  // Generate SVG string from Font Awesome icon
  const svgString = icon(iconDefinition).html[0];
  console.log("createFontAwesomeSVG result for", iconName, ": SUCCESS");

  return svgString;
};

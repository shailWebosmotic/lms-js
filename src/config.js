const url = new URL(window.location.href);
let domain,
  subDomain = "";

if (url.hostname.split(".").length === 2) {
  domain = url.hostname;
} else {
  domain = url.hostname.substring(
    url.hostname.indexOf(".") + 1,
    url.hostname.length
  );
  subDomain = url.hostname.substring(0, url.hostname.indexOf("."));
}

const devVersion = "1.0.0";
const stagingVersion = "1.0.0";
const prodVersion = "1.0.0";
let version = "";

if (process.env.REACT_APP_ENV === "development") {
  version = devVersion;
} else if (process.env.REACT_APP_ENV === "staging") {
  version = stagingVersion;
} else if (process.env.REACT_APP_ENV === "production") {
  version = prodVersion;
} else {
  version = devVersion;
}

const config = {
  version: version,
  baseUrl: process.env.REACT_APP_BASE_URL || "/",
  domain: domain,
  subDomain: subDomain,
};

export default config;

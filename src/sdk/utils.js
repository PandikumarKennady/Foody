import { Config, Region, LivePreview, Stack } from "contentstack";
const {
  REACT_APP_CONTENTSTACK_API_KEY,
  REACT_APP_CONTENTSTACK_DELIVERY_TOKEN,
  REACT_APP_CONTENTSTACK_ENVIRONMENT,
  REACT_APP_CONTENTSTACK_BRANCH,
  REACT_APP_CONTENTSTACK_REGION,
  REACT_APP_CONTENTSTACK_PREVIEW_TOKEN,
  REACT_APP_CONTENTSTACK_APP_HOST,
  REACT_APP_CONTENTSTACK_LIVE_PREVIEW,
  REACT_APP_CONTENTSTACK_PREVIEW_HOST,
} = process.env;

// Basic environment validation
export const isBasicConfigValid = () => {
  return (
    !!REACT_APP_CONTENTSTACK_API_KEY &&
    !!REACT_APP_CONTENTSTACK_DELIVERY_TOKEN &&
    !!REACT_APP_CONTENTSTACK_ENVIRONMENT
  );
};

// Live Preview config validation
export const isLpConfigValid = () => {
  return (
    !!REACT_APP_CONTENTSTACK_LIVE_PREVIEW &&
    !!REACT_APP_CONTENTSTACK_PREVIEW_TOKEN &&
    !!REACT_APP_CONTENTSTACK_PREVIEW_HOST &&
    !!REACT_APP_CONTENTSTACK_APP_HOST
  );
};

// Set region
const setRegion = () => {
  let region = "US";
  if (!!REACT_APP_CONTENTSTACK_REGION && REACT_APP_CONTENTSTACK_REGION !== "us") {
    region = REACT_APP_CONTENTSTACK_REGION.toLocaleUpperCase().replace("-", "_");
  }
  return Region[region];
};

// Set LivePreview config
const setLivePreviewConfig = () => {
  if (!isLpConfigValid())
    throw new Error(
      "Your LP config is set to true. Please make sure you have set all required LP config in .env"
    );
  return {
    preview_token: REACT_APP_CONTENTSTACK_PREVIEW_TOKEN,
    enable: REACT_APP_CONTENTSTACK_LIVE_PREVIEW === "true",
    host: REACT_APP_CONTENTSTACK_PREVIEW_HOST,
  };
};

// Contentstack SDK initialization
export const initializeContentStackSdk = () => {
  if (!isBasicConfigValid())
    throw new Error("Please set your .env file before running the starter app");
  const stackConfig = {
    api_key: REACT_APP_CONTENTSTACK_API_KEY,
    delivery_token: REACT_APP_CONTENTSTACK_DELIVERY_TOKEN,
    environment: REACT_APP_CONTENTSTACK_ENVIRONMENT,
    region: setRegion(),
    branch: REACT_APP_CONTENTSTACK_BRANCH || "main",
  };
  if (REACT_APP_CONTENTSTACK_LIVE_PREVIEW === "true") {
    stackConfig.live_preview = setLivePreviewConfig();
  }
  return Stack(stackConfig);
};

// API host URL
export const customHostUrl = (baseUrl = "") => {
  return baseUrl.replace("api", "cdn");
};

// Generate production API URLs
export const generateUrlBasedOnRegion = () => {
  return Object.keys(Region).map((region) => {
    if (region === "US") {
      return `cdn.contentstack.io`;
    }
    return `${region}-cdn.contentstack.com`;
  });
};

// Production URL validation for custom host
export const isValidCustomHostUrl = (url) => {
  return url ? !generateUrlBasedOnRegion().includes(url) : false;
};

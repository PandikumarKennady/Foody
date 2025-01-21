/* eslint-disable */
import * as Utils from "@contentstack/utils";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import {
  customHostUrl,
  initializeContentStackSdk,
  isValidCustomHostUrl,
} from "./utils";

const {
  REACT_APP_CONTENTSTACK_API_HOST,
  REACT_APP_CONTENTSTACK_API_KEY,
  REACT_APP_CONTENTSTACK_APP_HOST,
} = process.env;

const customHostBaseUrl = REACT_APP_CONTENTSTACK_API_HOST
  ? customHostUrl(REACT_APP_CONTENTSTACK_API_HOST)
  : "";

// SDK initialization
const Stack = initializeContentStackSdk();

// set host url only for custom host or non-prod base URLs
if (customHostBaseUrl && isValidCustomHostUrl(customHostBaseUrl)) {
  Stack.setHost(customHostBaseUrl);
}

// Setting Live Preview if enabled
ContentstackLivePreview.init({
  stackSdk: Stack,
  clientUrlParams: {
    host: REACT_APP_CONTENTSTACK_APP_HOST,
  },
}).catch((error) => console.error(error));

export const { onEntryChange } = ContentstackLivePreview;

const renderOption = {
  span: (node, next) => next(node.children),
};

/**
 * Fetches all the entries from a specific content-type
 * @param {Object} params
 * @param {string} params.contentTypeUid - Content type UID
 * @param {string[] | undefined} params.referenceFieldPath - Reference field names
 * @param {string[] | undefined} params.jsonRtePath - JSON RTE paths
 * @returns {Promise}
 */
export const getEntry = ({
  contentTypeUid,
  referenceFieldPath,
  jsonRtePath,
}) => {
  return new Promise((resolve, reject) => {
    const query = Stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) query.includeReference(referenceFieldPath);
    query
      .toJSON()
      .find()
      .then(
        (result) => {
          if (jsonRtePath) {
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          }
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
  });
};

/**
 * Fetches a specific entry from a content-type
 * @param {Object} params
 * @param {string} params.contentTypeUid - Content type UID
 * @param {string | undefined} params.entryUrl - URL of the entry to fetch
 * @param {string[] | undefined} params.referenceFieldPath - Reference field names
 * @param {string[] | undefined} params.jsonRtePath - JSON RTE paths
 * @returns {Promise}
 */
export const getEntryByUrl = ({
  contentTypeUid,
  entryUrl,
  referenceFieldPath,
  jsonRtePath,
}) => {
  return new Promise((resolve, reject) => {
    const blogQuery = Stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
    blogQuery.toJSON();
    const data = blogQuery.where("url", `${entryUrl}`).find();
    data.then(
      (result) => {
        if (jsonRtePath) {
          Utils.jsonToHTML({
            entry: result,
            paths: jsonRtePath,
            renderOption,
          });
        }
        resolve(result[0]);
      },
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });
};

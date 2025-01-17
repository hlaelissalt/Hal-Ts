import {
  generateHalCollectionResponse,
  getChunks,
  prepareCollectionLinks,
  validateCollectionData,
} from "./actions/collection";
import {
  isHalEmbededObject,
  isHalEmbededObjectArray,
  prepareEmbededData,
} from "./actions/object";
import {
  IHalCollectionRequest,
  IHalCollectionResponse,
} from "./types/collection";
import { IHalObjectRequest, IHalObjectResponse } from "./types/object";

/**
 * ```
 * generateObjectResponse({
 *  url: "http://localhost:8080/api/user",
 *  data: { identifier: 1, name: "Zay", isValid: true }
 * })
 * ```
 * @param baseData
 * @returns
 */
export const getHalObjectResponse = (baseData: IHalObjectRequest) => {
  const response: IHalObjectResponse = {
    _links: {
      self: {
        href: `${baseData.url}/${baseData.data.identifier}`,
      },
    },
    ...baseData.data,
    _embeded: undefined,
  };

  if (
    baseData.data._embeded &&
    isHalEmbededObjectArray(baseData.data._embeded)
  ) {
    response._embeded = baseData.data._embeded
      .map((el) => prepareEmbededData(el))
      .filter((el): el is IHalObjectResponse => !!el);
  } else if (
    baseData.data._embeded &&
    isHalEmbededObject(baseData.data._embeded)
  ) {
    response._embeded = prepareEmbededData(baseData.data._embeded);
  }

  return response;
};

/**
 * Get a Hal collection response
 *
 * ```
 * const arrayData = [
 *    {
 *       url: "http://localhost:8080/api/users",
 *       data: {
 *         identifier: 1,
 *         name: "Marcus",
 *         isAlive: true,
 *         _embeded: undefined,
 *     },
 *     {
 *        url: "http://localhost:8080/api/users",
 *        data: {
 *          identifier: 2,
 *          name: "Markus",
 *          isAlive: false,
 *          _embeded: undefined,
 *        },
 *      }
 *      {
 *         url: "http://localhost:8080/api/users",
 *         data: {
 *           identifier: 3,
 *           name: "Marly",
 *           isAlive: false,
 *           _embeded: undefined,
 *         },
 *      },
 *      {
 *        url: "http://localhost:8080/api/users",
 *        data: {
 *          identifier: 4,
 *          name: "Kane",
 *          isAlive: true,
 *          _embeded: undefined,
 *        },
 *      }
 * ]
 * const baseData : IHalCollectionRequest = {
 *    data: arrayData;
 *    chunk: 2;
 *    page: 2;
 *    url: "http://localhost/api/users";
 *    collectionName: "users";
 * }
 *
 * const response = getCollectionResponse(baseData);
 * ```
 * @param baseData {@link IHalCollectionRequest}
 * @returns collection response in hal format
 */
export const getCollectionResponse = (
  baseData: IHalCollectionRequest
): IHalCollectionResponse => {
  validateCollectionData(baseData);
  const chunks = getChunks(baseData.data, baseData.chunk, baseData.page);

  const response = generateHalCollectionResponse({
    links: prepareCollectionLinks(
      baseData.url,
      baseData.page,
      chunks.length,
      baseData.queryParams
    ),
    data: chunks[baseData.page - 1],
    total: baseData.data.length,
    collectionName: baseData.collectionName,
    page: baseData.page,
  });

  return response;
};

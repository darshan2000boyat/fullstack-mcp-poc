import { strapi } from "@strapi/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN as string;

const StrapiSDK = strapi({
  baseURL: `${API_URL}/api`,
  auth: STRAPI_TOKEN,
});

export const SitemapCollection = StrapiSDK.collection("sitemaps");

export const RouteCollection = StrapiSDK.collection("routes");

export const RemoteConfigCollection = StrapiSDK.single("remote-config");

export const FormCollection = StrapiSDK.collection("forms");

export default StrapiSDK;

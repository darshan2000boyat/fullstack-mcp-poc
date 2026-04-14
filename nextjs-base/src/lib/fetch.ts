const qs = require("qs");

export const get = async (
  url: string,
  params?: any,
  additionalHeaders?: any,
  next?: any,
) => {
  try {
    const query = qs.stringify(params, {
      encodeValuesOnly: true,
    });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}${query ? `?${query}` : ""}`,
      {
        next: {
          revalidate: Number(process?.env?.NEXT_PUBLIC_API_REVALIDATE) || 3600,
          ...next,
        },
        headers: {
          ...(process.env.STRAPI_TOKEN
            ? { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` }
            : {}),
          ...additionalHeaders,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`GET ${url} failed with ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const post = async (
  url: string,
  params?: any,
  additionalHeaders?: any,
) => {
  try {
    const query = qs.stringify(params, {
      encodeValuesOnly: true,
    });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}${query ? `?${query}` : ""}`,
      {
        method: "POST",
        next: {
          revalidate: Number(process?.env?.NEXT_PUBLIC_API_REVALIDATE) || 3600,
        },
        headers: {
          ...(process.env.STRAPI_TOKEN
            ? { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` }
            : {}),
          ...additionalHeaders,
        },
      },
    );
    if (!res.ok) {
      throw new Error(`POST ${url} failed with ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

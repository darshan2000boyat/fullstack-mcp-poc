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
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          ...additionalHeaders,
        },
      },
    );

    const data = res.json();
    return data;
  } catch (error) {
    console.log(error, "error");
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
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          ...additionalHeaders,
        },
      },
    );
    const data = res.json();
    return data;
  } catch (error) {}
};

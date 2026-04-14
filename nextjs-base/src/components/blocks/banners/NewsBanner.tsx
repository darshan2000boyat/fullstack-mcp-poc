import { getStrapiMedia } from "@/lib/utils";
// import { NewsAttributes, NewsData, NewsProps } from "@/typings/news";
import dayjs from "dayjs";
import Image from "next/image";

const NewsBanner = ({ data }: any) => {
  return (
    <div className="mb-40 px-12 text-center">
      <h1>{data?.PageTitle}</h1>
      <div className="mb-12 flex items-center justify-center gap-10">
        <p>{dayjs(data.PublishedDate).format("DD-MM-YYYY")}</p>
        <p>{data?.articleCategory?.data?.attributes?.Title}</p>
      </div>
      <div className="relative h-[70vh]">
        <Image
          className="object-cover"
          src={getStrapiMedia(data?.Image)}
          alt={data?.Title || "news-image"}
          fill
        />
      </div>
    </div>
  );
};

export default NewsBanner;

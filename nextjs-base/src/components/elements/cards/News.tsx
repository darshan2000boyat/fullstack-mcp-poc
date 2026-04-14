import { Link } from "@/components/ui/link";
import { getStrapiMedia } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";

const News = ({ data }: any) => {
  return (
    <div className="group relative h-full">
      <Link href={`/news/${data?.PageUid}`}>
        <div className="relative aspect-[1.3] w-full ">
          <Image
            className="object-cover"
            src={getStrapiMedia(data?.Image)}
            alt={data?.Title || "news-image"}
            fill
          />
        </div>
      </Link>
      <div className=" pb-16 pt-8">
        <p className="mb-4 text-black/50 ">
          {dayjs(data?.PublishedDate).format("D MMMM YYYY")}
        </p>
        <Link href={`/news/${data?.PageUid}`}>
          <p className="h4">{data?.PageTitle}</p>
        </Link>
      </div>
    </div>
  );
};

export default News;

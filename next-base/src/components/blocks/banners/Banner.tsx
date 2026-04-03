import Breadcrumb, { BreadcrumbTrail } from "@/components/elements/Breadcrumb";
import { generateTrail } from "@/lib/utils";
import { PageBlock } from "@/typings/blocks";

const Banner = ({ block, page }: PageBlock) => {
  const parentPage = generateTrail(page?.ParentPage);
  const title = page?.PageTitle;
  const trail: BreadcrumbTrail[] = [...parentPage, { title }].filter(Boolean);

  return (
    <>
      {/* Set true for text banner */}
      {/* <PageSetter darkHeader={true} /> */}
      <div className="mb-20 px-12">
        <Breadcrumb
          className=""
          classNames={{
            link: "after:bg-white hover:opacity-80",
          }}
          trail={trail}
        />
        <h1>{block?.Title}</h1>
      </div>
    </>
  );
};

export default Banner;

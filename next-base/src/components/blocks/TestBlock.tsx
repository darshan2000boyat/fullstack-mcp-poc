import MediaBlock from "@/components/elements/MediaBlock";
import { TestBlockProps } from "@/typings/blocks";

const TestBlock = ({ block }: { block: TestBlockProps }) => {
  const { Common, Title, Media } = block || {};

  return (
    <div>
      <h2>{Title}</h2>
      {Media ? (
        <>
          <MediaBlock
            media={Media}
            alt={Title || ""}
            className="aspect-video"
          />
          {/* <MediaComponent
            media={Media}
            title={Title || ""}
            className="aspect-video"
          /> */}
        </>
      ) : null}
    </div>
  );
};

export default TestBlock;

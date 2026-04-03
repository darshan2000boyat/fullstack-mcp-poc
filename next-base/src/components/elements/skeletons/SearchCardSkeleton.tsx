import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const SearchCardSkeleton = ({ index }: { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: index * 0.1,
          duration: 0.4,
        },
      }}
      exit={{ opacity: 0 }}
      className=""
    >
      <Skeleton
        isDark={true}
        className="rounded-6xl bg-grey hc:bg-black/30 max-sm:rounded-4xl relative flex min-h-[43rem] flex-col justify-between p-16 max-sm:min-h-[26.7rem] max-sm:p-8"
      >
        <Skeleton
          isDark={true}
          className="small w-1/2 font-semibold opacity-40"
        >
          &nbsp;
        </Skeleton>

        <div className="bottom max-sm:pe-12">
          <Skeleton
            isDark={true}
            className="text-5xl leading-normal max-sm:text-[2.4rem]"
          >
            &nbsp;
          </Skeleton>
          <Skeleton
            isDark={true}
            className="mt-8 line-clamp-2 max-sm:text-[1.6rem]"
          >
            &nbsp;
          </Skeleton>
          <Skeleton isDark={true} className="mt-16 h-24 w-48 max-sm:mt-8" />
        </div>
      </Skeleton>
    </motion.div>
  );
};

export default SearchCardSkeleton;

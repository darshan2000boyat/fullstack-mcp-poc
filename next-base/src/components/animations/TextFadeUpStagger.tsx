import { motion } from "framer-motion";
import React from "react";

interface TextFadeProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  split?: "words" | "chars";
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
  className: string;
}

const TextFadeUpStagger = ({
  text,
  split = "words",
  tag: Tag = "h2",
  className,
  ...props
}: TextFadeProps) => {
  const textArray = split === "words" ? text.split(" ") : text.split("");
  return (
    <Tag {...props} className={`overflow-hidden ${className}`}>
      {textArray.map((el, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{
            duration: 1,
            delay: index / 10,
            ease: "easeOut",
          }}
        >
          {el}
          {split === "words" ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
};

export default TextFadeUpStagger;

// import { motion } from "framer-motion";

// const LetterWrapper: React.FC<LetterWrapperProp> = ({
//   children,
//   countIndex,
// }) => {
//   return (
//     <motion.span
//       transition={{
//         ease: "easeOut",
//         duration: 1,
//         delay: 0.025 * countIndex,
//       }}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       {children}
//     </motion.span>
//   );
// };

// export const TextFadeUpStagger: React.FC = () => {
//   return (
//     <SplitText LetterWrapper={LetterWrapper}>
//       Hello world from the FadeIn Component!
//     </SplitText>
//   );
// };

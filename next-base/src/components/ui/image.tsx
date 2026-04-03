import Image, { ImageProps } from "next/image";

const ImageComponent = (props: ImageProps) => {
  return <Image {...props} alt={props?.alt} />;
};

export default ImageComponent;

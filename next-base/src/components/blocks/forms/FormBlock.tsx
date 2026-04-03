import { PageBlock } from "@/typings/blocks";

const FormBlock = async ({ block }: PageBlock) => {
  // const locale = await getCurrentLocale();
  // const data = await getForm(
  //   {
  //     filters: {
  //       formID: {
  //         $eq: block?.formType?.data?.attributes?.formID,
  //       },
  //     },
  //     populate: {
  //       formRedirect: true,
  //     },
  //   },
  //   locale,
  // );
  // // console.log(data);
  // const formData = data?.data?.[0];
  // const formTokenInfo = {
  //   id: formData?.id,
  //   csrfToken: data?.meta?.csrfToken,
  // };
  // return (
  //   <section className="flex px-20">
  //     <FormBlockInner formDetails={formData} formInfo={formTokenInfo} />
  //   </section>
  // );
};

export default FormBlock;

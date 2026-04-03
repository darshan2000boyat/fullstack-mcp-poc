module.exports = {
  config: {
    "api::contact-form.contact-form": {
      columns: [
        "first_name",
        "last_name",
        "phone_no",
        "business_email",
        "job_title",
        "company_name",
        "company_website",
        "city",
        "message",
      ],
      relation: {
        solution: {
          column: ["title"],
        },
      },
      locale: "false",
    },
  },
};

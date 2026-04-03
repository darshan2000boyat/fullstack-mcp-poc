const POPULATE_ALL = {
  populate: "*",
};

const CHANNEL = {
  Channel: {
    fields: ["Channel", "VisibleForLoggedIn"],
  },
};

const BUTTON = {
  Button: {
    fields: ["Title", "URL", "Target"],
    populate: {
      Icon: POPULATE_ALL,
    },
  },
};

module.exports = () => {
  return {
    CHANNEL,
    BUTTON,
    ALL_BLOCKS: {
      "header.header": {
        fields: ["Title", "Subtitle"],
        populate: { Banner: POPULATE_ALL },
      },
      "blocks.content": {
        fields: ["content"],
      },
      "blocks.news-listing": {
        fields: ["searchPlaceholder"],
      },
      "blocks.google-map": {
        fields: ["Latitude", "Longitude"],
      },
      "blocks.hero-section": {
        populate: "*",
      },
      "blocks.why-jood": {
        populate: "*",
      },
      "blocks.let-us-help-you": {
        populate: "*",
      },
      "blocks.urgent-appeals": {
        populate: "*",
      },
      "blocks.key-features": {
        populate: "*",
      },
      "blocks.success-numbers": {
        populate: "*",
      },
      "blocks.start-fundraise": {
        populate: "*",
      },
      "blocks.whats-new": {
        populate: "*",
      },
      "blocks.meet-leaders": {
        populate: "*",
      },
      "blocks.ticker-message": {
        populate: "*",
      },
    },
  };
};

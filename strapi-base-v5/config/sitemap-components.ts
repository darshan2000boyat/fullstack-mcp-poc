const POPULATE_COMMON = {
    fields: ["HideBlock", "BlockID", "NoBottomSpace"],
};

const POPULATE_IMAGE = {
    populate: ["Image", "MobileImage"],
};

const POPULATE_IMAGE_VIDEO_ITEM = {
    fields: ["VideoUrl", "Description", "MobileVideoURL"],
    populate: ["Image", "MobileImage"],
};

const POPULATE_LINK = {
    fields: ["Title", "type", "url"],
};

const POPULATE_BUTTON = {
    fields: ["Title", "URL", "Target"],
    populate: {
        Icon: true,
    },
};

module.exports = () => {
    return {
        // Reuse these helpers when adding new blocks. Prefer explicit field-level
        // population over broad populate rules so sitemap payloads stay stable.
        POPULATE_COMMON,
        POPULATE_IMAGE,
        POPULATE_LINK,
        POPULATE_IMAGE_VIDEO_ITEM,
        POPULATE_BUTTON,
        ALL_BLOCKS: {
            "blocks.test-block": {
                populate: {
                    Media: POPULATE_IMAGE_VIDEO_ITEM,
                    Common: POPULATE_COMMON,
                },
            },
            "blocks.about-with-stats": {
                populate: {
                    Link: POPULATE_LINK,
                    Stats: true,
                    Common: POPULATE_COMMON,
                },
            },
            "blocks.global-area": {
                populate: {
                    Stacks: {
                        populate: {
                            Blocks: {
                                on: {
                                    "blocks.test-block": {
                                        populate: {
                                            Media: POPULATE_IMAGE_VIDEO_ITEM,
                                            Common: POPULATE_COMMON,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    Common: POPULATE_COMMON,
                },
            },
        },
    };
};

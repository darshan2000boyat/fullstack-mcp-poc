import type { Core } from "@strapi/strapi";

const SITEMAP_UID = "api::sitemap.sitemap" as const;
const PAGE_URL = "grand-hayatt";
const DEFAULT_LOCALE = "en";

const contactUsBlock = {
    __component: "blocks.contact-us",
    Heading: "Contact Us",
    FollowUsLabel: "Follow us",
    AddressLocationLabel: "Location",
    AddressText:
        "456 Example Avenue, Suite 789\nBusiness Bay, Dubai, United Arab Emirates",
    ContactItems: [
        {
            IconType: "email",
            Label: "Email",
            Value: "info@hyattwaterpark.ae",
            Url: "mailto:info@hyattwaterpark.ae",
            Underline: true,
        },
        {
            IconType: "phone",
            Label: "Phone number",
            Value: "+966 11 453 1731",
            Url: "tel:+966114531731",
            Underline: true,
        },
        {
            IconType: "timings",
            Label: "Timings",
            Value: "10AM - 11PM",
            Underline: false,
        },
    ],
    SocialLinks: [
        { Title: "Instagram", type: "external", url: "https://instagram.com/" },
        { Title: "X", type: "external", url: "https://x.com/" },
        { Title: "Facebook", type: "external", url: "https://facebook.com/" },
    ],
    AddressCTA: {
        Title: "Get Directions",
        type: "external",
        url: "https://maps.google.com/?q=Business+Bay+Dubai",
    },
    MapLink: {
        Title: "Open map",
        type: "external",
        url: "https://maps.google.com/?q=Business+Bay+Dubai",
    },
    Common: {
        HideBlock: false,
        BlockID: "contact-us",
        NoBottomSpace: false,
    },
} as const;

const letUsHelpYouBlock = {
    __component: "blocks.let-us-help-you",
    Eyebrow: "Let us help you",
    HeadingPrefix: "Visiting as",
    Connector1: "for",
    Connector2: "on",
    GroupSelector: {
        Variant: "primary",
        Placeholder: "a Family",
        Options: [
            { Label: "a Family" },
            { Label: "a Couple" },
            { Label: "a Group" },
            { Label: "a Solo Traveler" },
        ],
    },
    DurationSelector: {
        Variant: "accent",
        Placeholder: "One Day",
        Options: [
            { Label: "One Day" },
            { Label: "3 Days" },
            { Label: "1 Week" },
            { Label: "1 Month" },
        ],
    },
    DateSelector: {
        Variant: "accent",
        Placeholder: "12th August 2025",
        Options: [
            { Label: "12th August 2025" },
            { Label: "15th August 2025" },
            { Label: "20th August 2025" },
            { Label: "25th August 2025" },
        ],
    },
    CTA: {
        Title: "Explore",
        type: "internal",
        url: "/grand-hayatt",
    },
    Common: {
        HideBlock: false,
        BlockID: "let-us-help-you",
        NoBottomSpace: false,
    },
} as const;

const DESIRED_BLOCKS = [letUsHelpYouBlock, contactUsBlock] as const;

export async function seedGrandHayatt(strapi: Core.Strapi) {
    const existing = await strapi.documents(SITEMAP_UID).findMany({
        filters: { PageURL: PAGE_URL },
        locale: DEFAULT_LOCALE,
        status: "draft",
        populate: { Blocks: true },
        limit: 1,
    });

    if (!existing || existing.length === 0) {
        const created = await strapi.documents(SITEMAP_UID).create({
            data: {
                PageTitle: "Grand Hayatt",
                PageURL: PAGE_URL,
                PageType: "default",
                ExcludeFromSitemap: false,
                Blocks: DESIRED_BLOCKS,
            } as any,
            locale: DEFAULT_LOCALE,
            status: "published",
        });
        strapi.log.info(
            `[seed:grand-hayatt] created sitemap entry at /${PAGE_URL} (documentId=${created.documentId}) with ${DESIRED_BLOCKS.length} blocks`
        );
        return;
    }

    const page = existing[0] as any;
    const currentBlocks: any[] = Array.isArray(page.Blocks) ? page.Blocks : [];
    const currentUids = new Set(currentBlocks.map((b) => b?.__component));

    const missing = DESIRED_BLOCKS.filter((b) => !currentUids.has(b.__component));

    if (missing.length === 0) {
        strapi.log.info(
            `[seed:grand-hayatt] /${PAGE_URL} already has all desired blocks, skipping`
        );
        return;
    }

    const mergedBlocks = [
        ...missing.map((b) => ({ ...b })),
        ...currentBlocks.map(({ id: _id, ...rest }) => rest),
    ];

    await strapi.documents(SITEMAP_UID).update({
        documentId: page.documentId,
        locale: DEFAULT_LOCALE,
        data: { Blocks: mergedBlocks } as any,
        status: "published",
    });

    strapi.log.info(
        `[seed:grand-hayatt] patched /${PAGE_URL} with ${missing.length} missing block(s): ${missing
            .map((b) => b.__component)
            .join(", ")}`
    );
}

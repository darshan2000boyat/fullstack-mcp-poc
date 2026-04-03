// @ts-nocheck
import {
  Accordion,
  AccordionContent,
  AccordionToggle,
  Box,
  Button,
  Checkbox,
  Flex,
  Loader,
  Popover,
  Radio,
  SingleSelect,
  SingleSelectOption,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  Typography,
} from '@strapi/design-system';
import {
  getAdValidationRules,
  getTitleMaxLength,
  getDescMaxLength,
  isVideoAllowed,
} from '../../../config/adValidationRules';
import { auth } from '@strapi/helper-plugin';
import { CheckCircle, Cross, More, Plus } from '@strapi/icons';
import axios from 'axios';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import React, { useCallback, useRef } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { Prompt, useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import styled from 'styled-components';
import CustomButton from '../../../components/elements/customButton';
import FileUpload from '../../../components/elements/form/fileinput';
import Analytics from '../../../components/Icons/Analytics';
import Archive from '../../../components/Icons/Archive';
import Download from '../../../components/Icons/Download';
import Edit from '../../../components/Icons/Edit';
import Pause from '../../../components/Icons/Pause';
import Rocket from '../../../components/Icons/Rocket';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';
import { truncate } from '../../../utils/utils';
import ConfirmChangeAdTypeModal from './confirmChangeAdTypeModal';
import ConfirmChangeMediaTabModal from './confirmChangeMediaTabModal';
import CreateCampaignModal from './createCampaignModal';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetchClient } from '@strapi/helper-plugin';
import { toPng } from 'dom-to-image-more';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import homeCarousel from '../../../assets/homeCarousel.png';
import listingBanner from '../../../assets/listingBanner.png';
import iphoneFrame from '../../../assets/phoneFrame.png';
import previewImage from '../../../assets/previewImage.png';
import stickyAd from '../../../assets/stickyAd.png';
import widgetBanner from '../../../assets/widgetBanner.png';
import FormDatePicker from '../../../components/elements/form/datepicker';
import FormInput from '../../../components/elements/form/input';
import FormTextArea from '../../../components/elements/form/textarea';
import StatusBadge from '../../../components/elements/statusBadge';
import useAdType from '../../../components/hooks/useAdType';
import useCampaignDetails from '../../../components/hooks/useCampaignDetails';

import useDarkMode from '../../../components/hooks/useDarkMode';
import useDestinationModels from '../../../components/hooks/useDestinationModels';
import useUnpublishOrArchiveAd from '../../../components/hooks/useUnpublisOrArchiveAd';
import useUnpublishOrArchiveCampaign from '../../../components/hooks/useUnpublisOrArchiveCampaign';
import Arrow from '../../../components/Icons/Arrow';
import Save from '../../../components/Icons/Save';
import pluginId from '../../../pluginId';
import { buildCampaignSchema } from '../../../schemas/campaign';
import ConfirmArchiveModal from '../../Components/confirmArchiveModal';
import ConfirmUnpublishModal from '../../Components/confirmUnpublishModal';
import AdDurationOverlapModal from './adDurationOverlapModal';
import ConfirmDeleteAdModal from './confirmDeleteAdModal';
import ConfirmPublishChangesOnSaveModal from './confirmPublishChangesOnSaveModal';
import EditCampaignModal from './editCampaignModal';
import WarnAtLeastOneAdShouldBeSelectedModal from './warnAtlestOneAdShouldBeSelectedModal';

const ThemedPlus = styled(Plus)`
  path {
    stroke: ${({ theme }) => theme.colors.neutral0};
  }
`;
// Default values for a new ad
export const defaultAdValues = {
  ad_name: '',
  ad_start_date: null,
  ad_end_date: null,
  ad_type: null,
  ad_spot: null,
  ad_status: 'draft',
  ad_screens: [],
  ad_headline: '',
  ad_cta_name: '',
  ad_external_url: '',
  ad_destination_models: undefined,
  ad_description: '',
  ad_image: null,
  ad_media_tab: 0,
  is_external: 'yes',
  ad_video_url: undefined,
  selected: false,
};

const PopoverItem = styled(Flex)`
  padding: 8px 16px;
  gap: 6px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const TabButton = styled(Tab)`
  padding: 0; /* remove Tab's default padding */
  border: none;
  background: ${({ theme }) => theme.colors.neutral150};

  > div {
    padding: 0 !important;
    background: transparent !important;
  }

  &[aria-selected='true'] {
    /* styles for active tab */
    button {
      background: ${({ theme }) => theme.colors.primary600} !important; /* active bg */
      color: ${({ theme }) => theme.colors.neutral0} !important; /* white text */
    }

    /* ensure ALL text + icon parts become white */
    svg,
    svg path,
    span,
    p,
    div {
      color: ${({ theme }) => theme.colors.neutral0} !important;
      fill: ${({ theme }) => theme.colors.neutral0} !important;
    }
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const toUTCDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) return value;

  const [y, m, d] = value.split('-').map(Number);

  return new Date(Date.UTC(y, m - 1, d));
};

const CampaignForm = ({
  mode, // 'create' | 'edit' | 'view'
  campaignId = null,
  onSubmit = () => {},
}) => {
  const { adTypes } = useAdType();
  const { destinationModels } = useDestinationModels();

  const isDarkMode = useDarkMode();
  // console.log('Destination Models in CampaignForm:', destinationModels);

  const imgRef = useRef();
  const allowNavigationRef = useRef(false);
  const CampaignSchema = React.useMemo(() => buildCampaignSchema(adTypes), [adTypes]);
  // const resolver = zodResolver(CampaignSchema);
  const { campaign, mutate } = useCampaignDetails(Number(campaignId));

  const addDefaultValues = (mode === 'edit' || mode === 'view') && campaign;
  const methods = useForm({
    resolver: zodResolver(CampaignSchema),
    mode: 'onChange',
    defaultValues: {
      campaign_name: '',
      campaign_entity_type: 'adgm_entity',
      campaign_entity_name: '',
      campaign_entity_license_number: '',
      ads: [],
    },
    shouldUnregister: false,
  });

  const { get, post, put, del } = useFetchClient();
  const { updateCampaignStatus } = useUnpublishOrArchiveCampaign();
  const { updateAdStatus } = useUnpublishOrArchiveAd();
  const token = auth.getToken();
  const history = useHistory();
  const location = useLocation();
  const [isSubmittingCampaignForm, setIsSubmittingCampaignForm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [isOpenCreateCampaignModal, setIsOpenCreateCampaignModal] = React.useState(false);
  const [isOpenPublishCampaignAdsModal, setIsOpenPublishCampaignAdsModal] = React.useState(false);
  const [isOpenUnpublishCampaignAdsModal, setIsOpenUnpublishCampaignAdsModal] =
    React.useState(false);
  const morePopoverRef = React.useRef(null);
  const [openMorePopover, setOpenMorePopover] = React.useState(false);
  const [openAdDurationOverlapModal, setOpenAdDurationOverlapModal] = React.useState(false);
  const [openConfirmChangeAdTypeModal, setOpenConfirmChangeAdTypeModal] = React.useState(false);
  const [openConfirmChangeMediaTabModal, setOpenConfirmChangeMediaTabModal] = React.useState(false);
  const [pendingAdTypeChange, setPendingAdTypeChange] = React.useState(null);
  const [pendingMediaTabChange, setPendingMediaTabChange] = React.useState(null);
  const [AdDurationOverlapData, setAdDurationOverlapData] = React.useState(null);

  const [isOpenArchiveCampaignModal, setIsOpenArchiveCampaignModal] = React.useState(false);
  const [isOpenUnpublishCampaignModal, setIsOpenUnpublishCampaignModal] = React.useState(false);
  const [isOpenDeleteAdModal, setIsOpenDeleteAdModal] = React.useState(false);
  const [isOpenPublishChangesOnSaveModal, setIsOpenPublishChangesOnSaveModal] =
    React.useState(false);
  const [
    isOpenWarnAtLeastOneAdShouldBeSelectedModal,
    setIsOpenWarnAtLeastOneAdShouldBeSelectedModal,
  ] = React.useState(false);
  const [deleteAdId, setDeleteAdId] = React.useState(null);
  const [isOpenUnpublishAdModal, setIsOpenUnpublishAdModal] = React.useState(false);
  const [unpublishAdId, setUnpublishAdId] = React.useState(null);

  const [activeDestinationPageOptionsDefault, setActiveDestinationPageOptionsDefault] =
    React.useState([]);
  // Ref to synchronously track selected destination page option (avoids async state update race condition)
  const selectedDestinationPageOptionRef = React.useRef(null);
  const [activeAdIdx, setActiveAdIdx] = React.useState(null);
  const [activePreviewAdIdx, setActivePreviewAdIdx] = React.useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [originalFormData, setOriginalFormData] = React.useState(null);

  const downloadImage = useCallback(() => {
    // console.log('here');

    if (imgRef.current === null) {
      return;
    }

    // Wait for all images to be fully loaded
    const images = imgRef.current.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        // Add timeout to prevent hanging
        setTimeout(() => resolve(), 5000);
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        return toPng(imgRef.current, {
          cacheBust: true,
          pixelRatio: 3,
          quality: 1.0,
          skipFonts: false,
        });
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${methods.getValues(`ads.${activePreviewAdIdx}.ad_name`)}_Format.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [imgRef, activePreviewAdIdx]);

  // Helper function to check if form has unsaved changes
  const checkForUnsavedChanges = () => {
    const currentData = methods.getValues();

    if (mode === 'create') {
      // In create mode, check if any field has been filled
      const hasValues =
        currentData.campaign_name ||
        currentData.campaign_entity_name ||
        currentData.campaign_entity_license_number ||
        (currentData.ads && currentData.ads.length > 0);
      return hasValues;
    }

    if (mode === 'edit' && originalFormData) {
      // In edit mode, compare with original data
      return JSON.stringify(currentData) !== JSON.stringify(originalFormData);
    }

    return false;
  };

  // Watch for form changes
  const watchedFormData = useWatch({ control: methods.control });

  React.useEffect(() => {
    const hasChanges = checkForUnsavedChanges();
    setHasUnsavedChanges(hasChanges);
  }, [watchedFormData, originalFormData, mode]);

  // Browser navigation warning (browser back/forward)
  // Note: beforeunload is commented out because Prompt component handles navigation
  // Only use beforeunload if you want to warn on page refresh/close
  // React.useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     if (hasUnsavedChanges && mode !== 'view') {
  //       e.preventDefault();
  //       e.returnValue = '';
  //       return '';
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [hasUnsavedChanges, mode]);

  React.useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && campaign && Object.keys(campaign).length > 0) {
      const formData = {
        id: campaign?.id || null,
        campaign_name: campaign?.campaign_name || '',
        campaign_entity_type: campaign?.campaign_entity_type || '',
        campaign_entity_name: campaign?.campaign_entity_name || '',
        campaign_entity_license_number: campaign?.campaign_entity_license_number || '',
        ads:
          campaign?.ads?.map((ad) => ({
            id: ad?.id,
            ad_name: ad?.ad_name,
            ad_start_date: toUTCDate(ad.ad_start_date),
            ad_end_date: toUTCDate(ad.ad_end_date),
            ad_type: ad?.ad_type?.id,
            ad_cta_name: ad?.ad_cta_name || '',
            ad_spot: ad?.ad_spot?.id,
            ad_destination_models: ad?.ad_destination_models ?? undefined,
            ad_destination_page: ad?.ad_destination_page,
            ad_external_url: ad?.ad_external_url,
            ad_status: ad?.ad_status,
            ad_screens: ad?.ad_screens.map((screen) => screen.id) || [],
            ad_headline: ad?.ad_headline,
            ad_description: ad?.ad_description,
            is_external: ad?.ad_external_url ? 'yes' : ad?.ad_destination_models ? 'no' : 'yes',
            ad_image: null,
            ad_image_url: ad.ad_image ? ad.ad_image.url : '',
            ad_media_tab: ad?.ad_video_url ? 1 : 0,
            ad_video_url: ad?.ad_video_url,
            selected: false,
          })) || [],
      };
      methods.reset(formData);
      setOriginalFormData(JSON.parse(JSON.stringify(formData)));
    }
  }, [campaign, mode]);

  React.useEffect(() => {
    if (!campaign?.ads?.length) return;

    const adIdFromUrl = new URLSearchParams(location.search).get('ad');
    if (!adIdFromUrl) return;

    const index = campaign.ads.findIndex((ad) => ad.id === Number(adIdFromUrl));
    if (index !== -1) {
      setActiveAdIdx(index);
      setActivePreviewAdIdx(index);
    }
  }, [campaign, location.search]);

  React.useEffect(() => {
    if (activeAdIdx == null) return;

    const attemptScroll = (tries = 0) => {
      const max = 10;
      const el = document.getElementById(`ad-accordion-${activeAdIdx}`);

      if (el) {
        setTimeout(() => {
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 150;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }, 50);
      } else if (tries < max) {
        setTimeout(() => attemptScroll(tries + 1), 100);
      }
    };

    attemptScroll();
  }, [activeAdIdx]);

  const errors = methods.formState.errors;
  const campaign_name = useWatch({
    control: methods.control,
    name: 'campaign_name',
    defaultValue: '',
  });
  const formAds = useWatch({ control: methods.control, name: 'ads', defaultValue: [] });

  const [activeAdType, setActiveAdType] = React.useState(null);
  const [activePreviewAdType, setActivePreviewAdType] = React.useState(null);

  const adTypeWatch = useWatch({ control: methods.control, name: `ads.${activeAdIdx}.ad_type` });

  const adImage = methods.getValues(`ads.${activePreviewAdIdx}.ad_image`);
  const adImageUrl = methods.getValues(`ads.${activePreviewAdIdx}.ad_image_url`);
  const isPreviewImage = mode === 'edit' ? true : Boolean(adImage);
  // console.log('adImage', adImage);
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = React.useState(null);

  // Convert uploaded File/Blob to data URL for better compatibility with html-to-image
  React.useEffect(() => {
    if (adImage && adImage instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImageDataUrl(e.target.result);
      };
      reader.readAsDataURL(adImage);
    } else {
      setUploadedImageDataUrl(null);
    }
  }, [adImage]);

  const imageSrc = uploadedImageDataUrl || adImageUrl || previewImage;

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.getElementById('strapi');
    if (!root) return;
    const className = 'has-campaign-form';
    root.classList.add(className);
    return () => root.classList.remove(className);
  }, []);

  // React.useEffect(() => {
  //   const ads = methods.getValues('ads') || [];

  //   if (ads.length === 1) {
  //     methods.setValue('ads.0.selected', true);
  //     const currentAdTypeId = methods.getValues(`ads.0.ad_type`);
  //     const adType = getCurrentAdType(currentAdTypeId);
  //     setActivePreviewAdType(adType);
  //     setActivePreviewAdIdx(0);
  //   }
  // }, [formAds]);

  React.useEffect(() => {
    if (!activeAdIdx && activeAdIdx !== 0) return;

    const model = methods.getValues(`ads.${activeAdIdx}.ad_destination_models`);
    const page = methods.getValues(`ads.${activeAdIdx}.ad_destination_page`);

    if (!model || model === undefined || model === null) return;
    if (
      (mode === 'edit' || mode === 'view') &&
      activeAdIdx !== undefined &&
      page !== undefined &&
      page !== null
    ) {
      const fetchInitialOptions = async () => {
        // Fetch the selected item by ID
        const { data } = await get(
          `/${pluginId}/get-destination-pages/${model}?filters[id]=${page}`
        );

        // Set the ref with the currently selected option
        const selectedOption = data?.results?.[0];
        if (selectedOption) {
          selectedDestinationPageOptionRef.current = selectedOption;
        }

        // Also fetch the first page of options for the dropdown
        const query = qs.stringify(
          { pagination: { page: 1, pageSize: 10 } },
          { encodeValuesOnly: true }
        );
        const response = await get(`/${pluginId}/get-destination-pages/${model}?${query}`);
        setActiveDestinationPageOptions(response?.data?.results || []);
        setTotalDestinationPageOptions(response?.data?.pagination?.total || 0);
      };

      fetchInitialOptions();
    }
  }, [activeAdIdx]);

  const watchCurrentDestinationModel = useWatch({
    control: methods.control,
    name: activeAdIdx !== null ? `ads.${activeAdIdx}.ad_destination_models` : '',
    defaultValue: undefined,
  });

  const [activeDestinationPage, setActiveDestinationPage] = React.useState(1);
  const [activeDestinationPageOptions, setActiveDestinationPageOptions] = React.useState([]);
  const [totalDestinationPageOptions, setTotalDestinationPageOptions] = React.useState(1);
  const [isLoadingMoreDestinations, setIsLoadingMoreDestinations] = React.useState(false);
  const [destinationPageSearch, setDestinationPageSearch] = React.useState('');
  const [debouncedDestinationPageSearch, setDebouncedDestinationPageSearch] = React.useState('');
  // Track previous model to detect actual changes vs initial load
  const prevDestinationModelRef = React.useRef(undefined);

  // Debounce search input for destination pages
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDestinationPageSearch(destinationPageSearch);
      setActiveDestinationPage(1); // Reset page when search changes
    }, 400);

    return () => clearTimeout(timer);
  }, [destinationPageSearch]);

  React.useEffect(() => {
    if (activeAdIdx === null || activeAdIdx === undefined) return;

    // Only clear when model actually CHANGES, not on initial load
    const prevModel = prevDestinationModelRef.current;
    prevDestinationModelRef.current = watchCurrentDestinationModel;

    // Skip if this is the initial load (prevModel was undefined)
    if (prevModel === undefined) return;
    // Skip if model hasn't actually changed
    if (prevModel === watchCurrentDestinationModel) return;

    methods.setValue(`ads.${activeAdIdx}.ad_destination_page`, '');
    setActiveDestinationPageOptions([]);
    setActiveDestinationPageOptionsDefault([]);
    selectedDestinationPageOptionRef.current = null;
    setActiveDestinationPage(1);
    setDestinationPageSearch('');
    setDebouncedDestinationPageSearch('');
    methods.trigger(`ads.${activeAdIdx}.ad_destination_page`);
  }, [watchCurrentDestinationModel]);

  React.useEffect(() => {
    // Use getValues instead of watchCurrentDestinationModel since useWatch can return undefined
    const currentModel =
      activeAdIdx !== null && activeAdIdx !== undefined
        ? methods.getValues(`ads.${activeAdIdx}.ad_destination_models`)
        : null;

    // Skip if no model selected or no active ad
    if (!currentModel) {
      setIsLoadingMoreDestinations(false);
      return;
    }
    if (activeAdIdx === null || activeAdIdx === undefined) {
      setIsLoadingMoreDestinations(false);
      return;
    }

    const fetchDestinationPages = async () => {
      try {
        const query = qs.stringify(
          {
            pagination: { page: activeDestinationPage, pageSize: 10 },
            ...(debouncedDestinationPageSearch && {
              _q: debouncedDestinationPageSearch,
            }),
          },
          { encodeValuesOnly: true }
        );

        const response = await get(`/${pluginId}/get-destination-pages/${currentModel}?${query}`);

        setActiveDestinationPageOptions((prev) => {
          // If page 1, replace options (new search or initial load)
          // If page > 1, accumulate options (lazy loading more)
          if (activeDestinationPage === 1) {
            return response?.data?.results || [];
          }

          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = (response?.data?.results || []).filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prev, ...newItems];
        });
        setTotalDestinationPageOptions(response?.data?.pagination?.total || 0);
        setIsLoadingMoreDestinations(false);
      } catch (err) {
        console.error('Failed to fetch destination pages:', err);
        setIsLoadingMoreDestinations(false);
      }
    };

    fetchDestinationPages();
  }, [
    watchCurrentDestinationModel,
    activeDestinationPage,
    debouncedDestinationPageSearch,
    activeAdIdx,
  ]);

  // Use refs to track the latest values without causing effect re-runs for destination pages
  const isLoadingMoreDestinationsRef = React.useRef(isLoadingMoreDestinations);
  const activeDestinationPageRef = React.useRef(activeDestinationPage);
  const totalDestinationPageOptionsRef = React.useRef(totalDestinationPageOptions);

  React.useEffect(() => {
    isLoadingMoreDestinationsRef.current = isLoadingMoreDestinations;
    activeDestinationPageRef.current = activeDestinationPage;
    totalDestinationPageOptionsRef.current = totalDestinationPageOptions;
  }, [isLoadingMoreDestinations, activeDestinationPage, totalDestinationPageOptions]);

  // Scroll event listener for infinite scroll in destination page dropdown
  React.useEffect(() => {
    const handleDestinationScroll = (e) => {
      const target = e.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Check if scrolled to bottom (with 10px threshold)
      if (scrollHeight - scrollTop <= clientHeight + 10) {
        const hasMorePages =
          activeDestinationPageRef.current * 10 < totalDestinationPageOptionsRef.current;

        if (!isLoadingMoreDestinationsRef.current && hasMorePages) {
          setIsLoadingMoreDestinations(true);
          setActiveDestinationPage((prev) => prev + 1);
        }
      }
    };

    // Find the destination page dropdown element
    const findAndAttachDestinationScrollListener = () => {
      const listboxes = document.querySelectorAll('[role="listbox"]');

      // Find the listbox that contains destination page options
      for (const listbox of listboxes) {
        const hasDestinationOptions = listbox.querySelector('[data-destination-page-option]');
        if (hasDestinationOptions) {
          const isScrollable = listbox.scrollHeight > listbox.clientHeight;

          if (isScrollable) {
            listbox.addEventListener('scroll', handleDestinationScroll);
            return listbox;
          }

          // Check for scrollable children
          const scrollableChild = Array.from(listbox.children).find(
            (child) => child.scrollHeight > child.clientHeight
          );

          if (scrollableChild) {
            scrollableChild.addEventListener('scroll', handleDestinationScroll);
            return scrollableChild;
          }

          listbox.addEventListener('scroll', handleDestinationScroll);
          return listbox;
        }
      }
      return null;
    };

    // Use MutationObserver to detect when dropdown opens
    const observer = new MutationObserver(() => {
      findAndAttachDestinationScrollListener();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      const listboxes = document.querySelectorAll('[role="listbox"]');
      listboxes.forEach((listbox) => {
        listbox.removeEventListener('scroll', handleDestinationScroll);
        Array.from(listbox.children).forEach((child) => {
          child.removeEventListener('scroll', handleDestinationScroll);
        });
      });
    };
  }, []);

  React.useEffect(() => {
    if (activeAdIdx !== null && activeAdIdx !== undefined) {
      const currentAdTypeId = methods.getValues(`ads.${activeAdIdx}.ad_type`);
      if (currentAdTypeId) {
        const adType = getCurrentAdType(currentAdTypeId);
        setActiveAdType(adType);
        setActivePreviewAdType(adType);
      } else {
        setActiveAdType(null);
      }
    } else {
      setActiveAdType(null);
    }
  }, [activeAdIdx, adTypeWatch]);

  const getCurrentAdType = (id) => {
    return adTypes.find((type) => type.id === id) || null;
  };

  // Checkbox change handler for ad selection
  const handleAdCheckboxChange = async (checked, idx) => {
    // if (checked) {
    //   const isValid = await methods.trigger(`ads.${idx}`);

    //   if (!isValid) {
    //     toast.error('Please complete all required fields for this ad', {
    //       position: 'top-center',
    //     });
    //     return;
    //   }
    // }

    const isChecked = typeof checked === 'boolean' ? checked : checked === 'true';
    methods.setValue(`ads.${idx}.selected`, isChecked);
  };

  const handleSelectAllChange = async (checked) => {
    const ads = methods.getValues('ads') || [];

    if (checked) {
      // const validationResults = await Promise.all(
      //   ads.map((_, idx) => methods.trigger(`ads.${idx}`))
      // );

      // ads.forEach((_, idx) => {
      //   if (validationResults[idx]) {
      //     methods.setValue(`ads.${idx}.selected`, true);
      //   }
      // });

      // const invalidCount = validationResults.filter((valid) => !valid).length;
      // if (invalidCount > 0) {
      //   toast.warning(`${invalidCount} ad(s) skipped due to incomplete information`, {
      //     position: 'top-center',
      //   });
      // }

      ads.forEach((_, idx) => {
        methods.setValue(`ads.${idx}.selected`, true);
      });
    } else {
      ads.forEach((_, idx) => {
        methods.setValue(`ads.${idx}.selected`, false);
      });
    }
  };

  const getSelectedAds = (ads) => ads.filter((ad) => ad.selected);

  const getSelectedAdsToPublish = (ads) =>
    ads.filter(
      (ad) =>
        ad.selected &&
        (ad.ad_status === 'inactive' || ad.ad_status === 'draft' || ad.ad_status === 'expired')
    );

  const getSelectedAdsToUnpublish = (ads) =>
    ads.filter((ad) => ad.selected && ad.ad_status === 'live');

  const StopToggle = ({ children }) => (
    <Box
      role="presentation"
      // capture phase so we intercept before Accordion's handler
      onPointerDownCapture={(e) => e.stopPropagation()}
      onMouseDownCapture={(e) => e.stopPropagation()}
      onClickCapture={(e) => e.stopPropagation()}
      onKeyDownCapture={(e) => {
        if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
      }}
    >
      {children}
    </Box>
  );

  const getCurrentAdTitle = () => {
    return methods.getValues(`ads.${activePreviewAdIdx}.ad_headline`) || 'Title';
  };

  const getCurrentAdDescription = () => {
    return (
      methods.getValues(`ads.${activePreviewAdIdx}.ad_description`) || 'Description goes here...'
    );
  };
  const getCurrentAdCtaName = () => {
    return methods.getValues(`ads.${activePreviewAdIdx}.ad_cta_name`) || 'CTA Button';
  };

  const getCurrentValidationRules = (idx) => {
    const adTypeId = methods.watch(`ads.${idx}.ad_type`);
    const adSpotId = methods.watch(`ads.${idx}.ad_spot`);
    const adScreenIds = methods.watch(`ads.${idx}.ad_screens`) || [];

    const adType = adTypes.find((type) => type.id === adTypeId);
    const adSpot = adType?.ad_spots?.find((spot) => spot.id === adSpotId);
    const allScreens = adSpot?.ad_screens || [];

    if (!adType || !adSpot) {
      return { titleMax: 60, descMax: 150, videoAllowed: false };
    }

    return getAdValidationRules(
      adType.ad_type_id,
      adType.image_size,
      adSpot.ad_spot_id,
      adScreenIds,
      allScreens
    );
  };

  const adTypeCardImages = {
    'home-carousel': homeCarousel,
    'widget-banner': widgetBanner,
    'sticky-ad': stickyAd,
    'listing-banner': listingBanner,
  };

  const handleUnpublish = async () => {
    updateCampaignStatus({
      campaignId: campaign?.id,
      status: 'inactive',
      onComplete: async () => {
        setIsOpenUnpublishCampaignModal(false);
        // Force refetch with revalidation
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      },
    });
  };

  const handleArchive = async (action = 'archive') => {
    const status = action === 'unarchive' ? 'inactive' : 'archived';
    const messageKey = action === 'unarchive' ? 'unarchived' : 'archived';

    updateCampaignStatus({
      campaignId: campaign.id,
      status: status,
      messageKey: messageKey,
      onComplete: async () => {
        setIsOpenArchiveCampaignModal(false);
        // Force refetch with revalidation
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      },
    });
  };

  // Helper function to handle navigation with unsaved changes check
  // Note: The Prompt component handles the confirmation dialog, so we just need to
  // allow navigation and let Prompt intercept it if there are unsaved changes
  const handleNavigationWithWarning = (navigationFn) => {
    // Allow navigation - Prompt component will show confirmation if needed
    allowNavigationRef.current = false; // Reset the flag to ensure Prompt can intercept
    navigationFn();
  };

  const handleUnpublishAd = async () => {
    updateAdStatus({
      adId: unpublishAdId,
      status: 'inactive',
      onComplete: async () => {
        setIsOpenUnpublishAdModal(false);
        setUnpublishAdId(null);

        // Force refetch with revalidation
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      },
    });
  };

  const handleRemoveAd = (idx) => {
    const currentAds = methods.getValues('ads') || [];
    const updatedAds = currentAds.filter((_, index) => index !== idx);
    methods.setValue('ads', updatedAds);
    // Reset active ad index if needed
    if (activeAdIdx === idx) {
      setActiveAdIdx(null);
      setActivePreviewAdIdx(null);
    } else if (activeAdIdx > idx) {
      setActiveAdIdx(activeAdIdx - 1);
      setActivePreviewAdIdx(activePreviewAdIdx - 1);
    }
  };
  const handleDeleteAd = async (id) => {
    try {
      await del(`/${pluginId}/ad/delete/${id}`);

      // Force refetch with revalidation
      await mutate(['campaign', Number(campaignId)], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error('Error deleting ad:', error);
    } finally {
      setIsOpenDeleteAdModal(false);
      setDeleteAdId(null);
    }
  };

  const formatDate = (dateObj) => {
    if (!dateObj || !isValid(dateObj)) return null;
    return format(new Date(dateObj), 'yyyy-MM-dd');
  };

  const isAfterToday = (value) => {
    if (!value) return false;
    const d = value instanceof Date ? new Date(value) : new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d > today;
  };

  const validateForm = async ({ isSave = false }) => {
    const data = methods.getValues();
    const ads = data.ads || [];
    const selectedAds = ads.filter((ad) => ad.selected);
    const validateAllAds = isSave && selectedAds.length === 0;
    let dataToValidate = data;

    if (!validateAllAds && selectedAds.length > 0) {
      dataToValidate = {
        ...data,
        ads: ads.map((ad) => (ad.selected ? ad : {})),
      };
    }
    const DynamicSchema = buildCampaignSchema(adTypes, { skipDraftRequired: isSave });
    const resolver = zodResolver(DynamicSchema);
    const result = await resolver(dataToValidate, { skipDraftRequired: isSave }, {});

    // const result = await resolver(dataToValidate, {}, { skipDraftRequired: isSave });
    let valid = true;

    // Top-level validation
    Object.entries(result.errors || {}).forEach(([key, error]) => {
      if (key === 'ads' || key === '') return;

      if (error?.message) {
        valid = false;
        methods.setError(key, {
          type: 'manual',
          message: error.message,
        });
      }
    });

    // Ads validation
    if (Array.isArray(result.errors?.ads)) {
      result.errors.ads.forEach((adErrorObj, index) => {
        // Skip only when NOT validating all ads AND ad is unselected
        if (!validateAllAds && !dataToValidate.ads[index]?.selected) return;

        if (adErrorObj && Object.keys(adErrorObj).length > 0) {
          valid = false;
        }

        Object.entries(adErrorObj || {}).forEach(([field, errorInfo]) => {
          methods.setError(`ads.${index}.${field}`, {
            type: 'manual',
            message: errorInfo.message,
          });
        });
      });
    }

    return valid;
  };

  const mediaTab = methods.watch(`ads.${activeAdIdx}.ad_media_tab`) ?? 0;

  // const checkAdDurationOverlap = async (type, modalType) => {
  //   try {
  //     methods.clearErrors();
  //     const isValid = await validateForm();
  //     if (!isValid) {
  //       toast.error('Please fix the errors in the form before submitting.', {
  //         position: 'top-center',
  //       });
  //       return;
  //     }

  //     const formData = buildCampaignFormData({ type });

  //     const response = await axios.post(`/${pluginId}/campaign/conflict-check`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     if (response?.data?.details?.conflict) {
  //       setOpenAdDurationOverlapModal(true);
  //       setAdDurationOverlapData(response?.data?.details);
  //       return;
  //     } else {
  //       if (modalType === 'create') {
  //         setIsOpenCreateCampaignModal(true);
  //         return;
  //       } else if (modalType === 'edit') {
  //         if (type === 'publish') {
  //           setIsOpenPublishCampaignAdsModal(true);
  //           return;
  //         } else {
  //           setIsOpenUnpublishCampaignAdsModal(true);
  //           return;
  //         }
  //       } else if (modalType === 'save') {
  //         if (campaign?.campaign_status === 'active') {
  //           setIsOpenPublishChangesOnSaveModal(true);
  //           return;
  //         } else {
  //           handleCampaignSubmit('save');
  //           return;
  //         }
  //       }
  //     }

  //     console.log('Conflict check response:', response);
  //   } catch (error) {
  //     console.error('Error checking ad date conflicts:', error);
  //   }
  // };

  const checkAdDurationOverlapOnPublish = async () => {
    try {
      methods.clearErrors();
      const isValid = await validateForm({ isSave: false });
      if (!isValid) {
        toast.error('Please fix the errors in the form before submitting.', {
          position: 'top-center',
        });
        return;
      }

      const formData = buildCampaignFormData({ type: 'publish' });

      const response = await axios.post(
        `/${pluginId}/campaign/publish?check_conflicts=true`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response?.data?.details?.conflict) {
        setOpenAdDurationOverlapModal(true);
        setAdDurationOverlapData(response?.data?.details);
        return;
      } else {
        setIsOpenPublishCampaignAdsModal(true);
        return;
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ?? error.message ?? 'Something went wrong!',
        {
          position: 'top-center',
        }
      );
    }
  };

  const checkAdDurationOverlapOnSave = async () => {
    try {
      methods.clearErrors();
      const isValid = await validateForm({ isSave: true });
      if (!isValid) {
        toast.error('Please fix the errors in the form before submitting.', {
          position: 'top-center',
        });
        return;
      }

      const formData = buildCampaignFormData({ type: 'save' });

      const response = await axios.post(
        `/${pluginId}/campaign/save?check_conflicts=true`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response?.data?.details?.conflict) {
        setOpenAdDurationOverlapModal(true);
        setAdDurationOverlapData(response?.data?.details);
        return;
      } else {
        setIsOpenPublishChangesOnSaveModal(true);
        return;
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ?? error.message ?? 'Something went wrong!',
        {
          position: 'top-center',
        }
      );
    }
  };

  // const handleCampaignSubmit = async (type) => {
  //   // type: 'publish' | 'save'
  //   try {
  //     methods.clearErrors();
  //     const isValid = await validateForm();
  //     if (!isValid) {
  //       toast.error('Please fix the errors in the form before submitting.', {
  //         position: 'top-center',
  //       });
  //       return;
  //     }

  //     setIsSubmittingCampaignForm(true);
  //     if (type === 'save') {
  //       setIsSaving(true);
  //     }

  //     const formData = buildCampaignFormData({ type });

  //     const response = await axios.post(`/${pluginId}/campaign`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     let toastMsg = 'Campaign updated!';
  //     if (mode === 'create') {
  //       if (type === 'publish') toastMsg = 'Campaign published!';
  //       else if (type === 'save') toastMsg = 'Campaign saved as draft!';
  //     } else {
  //       if (type === 'publish') toastMsg = 'Campaign published!';
  //       else if (type === 'save') toastMsg = 'Campaign changes saved!';
  //       else if (type === 'unpublish') toastMsg = 'Campaign unpublished!';
  //     }

  //     // Reset unsaved changes flag BEFORE navigation to prevent prompt

  //     setHasUnsavedChanges(false);
  //     allowNavigationRef.current = true; // Allow navigation immediately

  //     if (mode === 'edit') {
  //       setOriginalFormData(JSON.parse(JSON.stringify(methods.getValues())));
  //     }

  //     toast.success(toastMsg, {
  //       icon: <CheckCircle color="success500" />,
  //       position: 'top-center',
  //     });
  //     setIsOpenPublishCampaignAdsModal(false);
  //     setIsOpenUnpublishCampaignAdsModal(false);
  //     setIsOpenCreateCampaignModal(false);
  //     setOpenAdDurationOverlapModal(false);
  //     setIsOpenPublishChangesOnSaveModal(false);
  //     setIsOpenWarnAtLeastOneAdShouldBeSelectedModal(false);

  //     if (mode === 'create') {
  //       history.push(`/plugins/${pluginId}/campaigns/edit/${response.data.id}`);
  //     }

  //     if (mode === 'edit') {
  //       await mutate(['campaign', Number(campaignId)], undefined, {
  //         revalidate: true,
  //       });
  //     }
  //   } catch (error) {
  //     toast.error(error.message, {
  //       position: 'top-center',
  //     });
  //   } finally {
  //     setIsSubmittingCampaignForm(false);
  //     setIsSaving(false);
  //   }
  // };

  function buildCampaignFormData({ type }) {
    const data = methods.getValues();
    const ads = data.ads || [];
    const selectedAds = ads.filter((ad) => ad.selected);

    // Determine which ads to include
    let adsToSend = ads;
    if (selectedAds.length > 0) {
      adsToSend = selectedAds;
    } else if (type === 'save') {
      adsToSend = ads;
    } else {
      adsToSend = [];
    }
    const adImages = adsToSend.map((ad) => (ad.ad_image ? ad.ad_image : null));

    // const computeAdStatus = (status, selected, adEndDate) => {
    //   let adStatus = status;

    //   if (status === 'expired' && isAfterToday(adEndDate)) {
    //     adStatus = 'inactive';
    //   }

    //   if (selected) {
    //     if (type === 'unpublish' && status === 'live') {
    //       adStatus = 'inactive';
    //     } else if (type === 'publish') {
    //       adStatus = 'live';
    //     }
    //   } else if (status === 'live') {
    //     adStatus = 'inactive';
    //   }
    //   return adStatus;
    // };

    const formattedAds = adsToSend.map((ad) => {
      const formatted = {
        ...ad,
        ad_start_date: formatDate(ad.ad_start_date),
        ad_end_date: formatDate(ad.ad_end_date),
        // ad_status: computeAdStatus(ad.ad_status, ad.selected, ad.ad_end_date),
        ad_external_url: ad.is_external === 'yes' ? ad.ad_external_url : null,
        ad_destination_page: ad.is_external === 'no' ? ad.ad_destination_page : null,
        ad_destination_models:
          ad.is_external === 'no'
            ? ad.ad_destination_models !== ''
              ? ad.ad_destination_models
              : null
            : null,
      };
      const { ad_image, ad_image_url, ...rest } = formatted;
      return rest;
    });

    // let campaignStatus =
    //   type === 'publish'
    //     ? 'active'
    //     : type === 'unpublish'
    //       ? 'inactive'
    //       : data.id === null
    //         ? 'draft'
    //         : campaign.campaign_status;

    // if (campaignStatus === 'expired') {
    //   const hasInactiveOrLiveAd = formattedAds.some(
    //     (ad) => ad.ad_status === 'inactive' || ad.ad_status === 'live'
    //   );
    //   if (hasInactiveOrLiveAd) {
    //     campaignStatus = 'inactive';
    //   }
    // }

    const payload = {
      ...data,
      // campaign_status: campaignStatus,
      ads: formattedAds,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    adImages.forEach((img, idx) => {
      if (img) {
        formData.append(`files[ads][${idx}][ad_image]`, img);
      }
    });

    return formData;
  }

  const handleCampaignSave = async () => {
    try {
      methods.clearErrors();
      const isValid = await validateForm({ isSave: true });

      if (!isValid) {
        toast.error('Please fix the errors in the form before submitting.', {
          position: 'top-center',
        });
        return;
      }

      setIsSubmittingCampaignForm(true);
      setIsSaving(true);

      const formData = buildCampaignFormData({ type: 'save' });

      const response = await axios.post(`/${pluginId}/campaign/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      let toastMsg = 'Campaign Saved!';
      // if (mode === 'create') {
      //   if (type === 'publish') toastMsg = 'Campaign published!';
      //   else if (type === 'save') toastMsg = 'Campaign saved as draft!';
      // } else {
      //   if (type === 'publish') toastMsg = 'Campaign published!';
      //   else if (type === 'save') toastMsg = 'Campaign changes saved!';
      //   else if (type === 'unpublish') toastMsg = 'Campaign unpublished!';
      // }

      // Reset unsaved changes flag BEFORE navigation to prevent prompt

      setHasUnsavedChanges(false);
      allowNavigationRef.current = true; // Allow navigation immediately

      if (mode === 'edit') {
        setOriginalFormData(JSON.parse(JSON.stringify(methods.getValues())));
      }

      toast.success(toastMsg, {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
      });
      setIsOpenPublishCampaignAdsModal(false);
      setIsOpenUnpublishCampaignAdsModal(false);
      setIsOpenCreateCampaignModal(false);
      setOpenAdDurationOverlapModal(false);
      setIsOpenPublishChangesOnSaveModal(false);
      setIsOpenWarnAtLeastOneAdShouldBeSelectedModal(false);

      if (mode === 'create') {
        history.push(`/plugins/${pluginId}/campaigns/edit/${response.data.id}`);
      }

      if (mode === 'edit') {
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ?? error.message ?? 'Something went wrong!',
        {
          position: 'top-center',
        }
      );
    } finally {
      setIsSubmittingCampaignForm(false);
      setIsSaving(false);
    }
  };

  const handleCampaignPublish = async () => {
    try {
      methods.clearErrors();
      const isValid = await validateForm({ isSave: false });
      if (!isValid) {
        toast.error('Please fix the errors in the form before submitting.', {
          position: 'top-center',
        });
        return;
      }

      setIsSubmittingCampaignForm(true);

      const formData = buildCampaignFormData({ type: 'publish' });

      const response = await axios.post(`/${pluginId}/campaign/publish`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      let toastMsg = 'Campaign Ads Published!';
      // if (mode === 'create') {
      //   if (type === 'publish') toastMsg = 'Campaign published!';
      //   else if (type === 'save') toastMsg = 'Campaign saved as draft!';
      // } else {
      //   if (type === 'publish') toastMsg = 'Campaign published!';
      //   else if (type === 'save') toastMsg = 'Campaign changes saved!';
      //   else if (type === 'unpublish') toastMsg = 'Campaign unpublished!';
      // }

      // Reset unsaved changes flag BEFORE navigation to prevent prompt

      setHasUnsavedChanges(false);
      allowNavigationRef.current = true; // Allow navigation immediately

      if (mode === 'edit') {
        setOriginalFormData(JSON.parse(JSON.stringify(methods.getValues())));
      }

      toast.success(toastMsg, {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
      });
      setIsOpenPublishCampaignAdsModal(false);
      setIsOpenUnpublishCampaignAdsModal(false);
      setIsOpenCreateCampaignModal(false);
      setOpenAdDurationOverlapModal(false);
      setIsOpenPublishChangesOnSaveModal(false);
      setIsOpenWarnAtLeastOneAdShouldBeSelectedModal(false);

      if (mode === 'create') {
        history.push(`/plugins/${pluginId}/campaigns/edit/${response.data.id}`);
      }

      if (mode === 'edit') {
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ?? error.message ?? 'Something went wrong!',
        {
          position: 'top-center',
        }
      );
    } finally {
      setIsSubmittingCampaignForm(false);
      setIsSaving(false);
    }
  };

  const handleCampaignUnpublish = async () => {
    try {
      methods.clearErrors();
      const isValid = await validateForm({ isSave: false });
      if (!isValid) {
        toast.error('Please fix the errors in the form before submitting.', {
          position: 'top-center',
        });
        return;
      }

      setIsSubmittingCampaignForm(true);

      const formData = buildCampaignFormData({ type: 'unpublish' });

      const response = await axios.post(`/${pluginId}/campaign/unpublish`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      let toastMsg = 'Campaign Ads Unpublished!';
      // if (mode === 'create') {
      //   if (type === 'publish') toastMsg = 'Campaign published!';
      //   else if (type === 'save') toastMsg = 'Campaign saved as draft!';
      // } else {
      //   if (type === 'publish') toastMsg = 'Campaign published!';
      //   else if (type === 'save') toastMsg = 'Campaign changes saved!';
      //   else if (type === 'unpublish') toastMsg = 'Campaign unpublished!';
      // }

      // Reset unsaved changes flag BEFORE navigation to prevent prompt

      setHasUnsavedChanges(false);
      allowNavigationRef.current = true; // Allow navigation immediately

      if (mode === 'edit') {
        setOriginalFormData(JSON.parse(JSON.stringify(methods.getValues())));
      }

      toast.success(toastMsg, {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
      });
      setIsOpenPublishCampaignAdsModal(false);
      setIsOpenUnpublishCampaignAdsModal(false);
      setIsOpenCreateCampaignModal(false);
      setOpenAdDurationOverlapModal(false);
      setIsOpenPublishChangesOnSaveModal(false);
      setIsOpenWarnAtLeastOneAdShouldBeSelectedModal(false);

      if (mode === 'create') {
        history.push(`/plugins/${pluginId}/campaigns/edit/${response.data.id}`);
      }

      if (mode === 'edit') {
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ?? error.message ?? 'Something went wrong!',
        {
          position: 'top-center',
        }
      );
    } finally {
      setIsSubmittingCampaignForm(false);
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Prompt
        when={hasUnsavedChanges && mode !== 'view'}
        message={(location) => {
          // If we just saved, allow navigation without prompt
          if (allowNavigationRef.current) {
            return true; // Return true to allow navigation
          }

          return 'You have unsaved changes. If you leave now, your changes will be lost. Do you want to continue?';
        }}
      />
      {openAdDurationOverlapModal && (
        <AdDurationOverlapModal
          isOpen={openAdDurationOverlapModal}
          data={AdDurationOverlapData}
          setIsOpen={setOpenAdDurationOverlapModal}
          disabled={isSubmittingCampaignForm}
          campaign={methods.getValues()}
          onSubmit={() => {
            setOpenAdDurationOverlapModal(false);
          }}
        />
      )}
      <ConfirmChangeAdTypeModal
        isOpen={openConfirmChangeAdTypeModal}
        setIsOpen={setOpenConfirmChangeAdTypeModal}
        onSubmit={() => {
          if (pendingAdTypeChange) {
            const { idx, adTypeId } = pendingAdTypeChange;

            // Apply the ad type change
            methods.setValue(`ads.${idx}.ad_type`, adTypeId);
            setActiveAdType(getCurrentAdType(adTypeId));
            setActivePreviewAdType(getCurrentAdType(adTypeId));

            // Clear image-related fields
            methods.setValue(`ads.${idx}.ad_image`, null);
            methods.setValue(`ads.${idx}.ad_image_url`, null);
            methods.setValue(`ads.${idx}.ad_video_url`, null);
            methods.setValue(`ads.${idx}.ad_spot`, null);
            methods.setValue(`ads.${idx}.ad_screens`, []);

            // Reset pending change and close modal
            setPendingAdTypeChange(null);
            setOpenConfirmChangeAdTypeModal(false);
          }
        }}
        onCancel={() => {
          setPendingAdTypeChange(null);
          setOpenConfirmChangeAdTypeModal(false);
        }}
      />
      <ConfirmChangeMediaTabModal
        isOpen={openConfirmChangeMediaTabModal}
        setIsOpen={setOpenConfirmChangeMediaTabModal}
        onSubmit={() => {
          if (pendingMediaTabChange) {
            const { idx, index } = pendingMediaTabChange;

            methods.setValue(`ads.${idx}.ad_media_tab`, index, {
              shouldDirty: true,
            });
            methods.setValue(`ads.${idx}.ad_image`, null);
            methods.setValue(`ads.${idx}.ad_image_url`, null);
            methods.setValue(`ads.${idx}.ad_video_url`, null);
            setPendingMediaTabChange(null);
            setOpenConfirmChangeMediaTabModal(false);
          }
        }}
        onCancel={() => {
          setPendingMediaTabChange(null);
          setOpenConfirmChangeMediaTabModal(false);
        }}
      />
      <CreateCampaignModal
        isOpen={isOpenCreateCampaignModal}
        disabled={isSubmittingCampaignForm}
        setIsOpen={setIsOpenCreateCampaignModal}
        onSubmit={() => {}}
        adsCount={getSelectedAdsToPublish(formAds).length}
      />
      <EditCampaignModal
        isOpen={isOpenPublishCampaignAdsModal}
        setIsOpen={setIsOpenPublishCampaignAdsModal}
        disabled={isSubmittingCampaignForm}
        isPublish={true}
        onSubmit={handleCampaignPublish}
        adsCount={getSelectedAdsToPublish(formAds).length}
      />
      <EditCampaignModal
        isOpen={isOpenUnpublishCampaignAdsModal}
        setIsOpen={setIsOpenUnpublishCampaignAdsModal}
        disabled={isSubmittingCampaignForm}
        isPublish={false}
        onSubmit={handleCampaignUnpublish}
        adsCount={getSelectedAdsToUnpublish(formAds).length}
      />
      <ConfirmArchiveModal
        isOpen={isOpenArchiveCampaignModal}
        setIsOpen={setIsOpenArchiveCampaignModal}
        onSubmit={handleArchive}
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishCampaignModal}
        setIsOpen={setIsOpenUnpublishCampaignModal}
        onSubmit={handleUnpublish}
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishAdModal}
        setIsOpen={setIsOpenUnpublishAdModal}
        onSubmit={handleUnpublishAd}
        variant="ads"
      />

      <ConfirmDeleteAdModal
        isOpen={isOpenDeleteAdModal}
        setIsOpen={setIsOpenDeleteAdModal}
        onSubmit={() => handleDeleteAd(deleteAdId)}
      />
      <ConfirmPublishChangesOnSaveModal
        isOpen={isOpenPublishChangesOnSaveModal}
        setIsOpen={setIsOpenPublishChangesOnSaveModal}
        onSubmit={handleCampaignSave}
      />
      <WarnAtLeastOneAdShouldBeSelectedModal
        isOpen={isOpenWarnAtLeastOneAdShouldBeSelectedModal}
        setIsOpen={setIsOpenWarnAtLeastOneAdShouldBeSelectedModal}
        onSubmit={() => {}}
      />
      <form
        className="py-16"
        // onSubmit={methods.handleSubmit(handleCampaignSubmit)}
      >
        {/*
         =============================================
         HEADER SECTION
         Campaign title and action buttons
         =============================================
        */}
        <Box padding={4} position="sticky" top={0} zIndex={100} background="neutral0">
          {(mode === 'edit' || mode === 'view') && (
            <Flex
              aria-label="Go back"
              style={{ cursor: 'pointer', marginBottom: 8 }}
              gap={2}
              onClick={(e) => {
                handleNavigationWithWarning(() => history.goBack());
              }}
            >
              <Typography variant="epsilon" textColor="primary600">
                ← Back
              </Typography>
            </Flex>
          )}

          <div className="flex justify-between items-center gap-4">
            <Flex
              direction="column"
              alignItems="flex-start"
              style={{ flex: 1, minWidth: 0 }}
              gap={1}
            >
              {(mode === 'edit' || mode === 'view') && (
                <Flex gap={2}>
                  <Typography variant="pi" textColor="neutral600">
                    {campaign?.min_date ? format(new Date(campaign?.min_date), 'dd/MM/yyyy') : ''}{' '}
                    {campaign?.max_date && ' - '}{' '}
                    {campaign?.max_date ? format(new Date(campaign?.max_date), 'dd/MM/yyyy') : ''}
                  </Typography>
                  <StatusBadge
                    status={
                      campaign?.campaign_status === 'active' &&
                      campaign?.min_date &&
                      new Date(campaign.min_date) > new Date()
                        ? 'active-scheduled'
                        : (campaign?.campaign_status ?? 'draft')
                    }
                  />
                </Flex>
              )}
              {mode === 'create' ? (
                <Typography variant="alpha">Create New Campaign</Typography>
              ) : (
                <Typography
                  variant="alpha"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {methods.getValues('campaign_name')}
                </Typography>
              )}

              <Breadcrumb style={{ fontSize: 12 }}>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>Strapi</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        handleNavigationWithWarning(() =>
                          history.push(`/plugins/${pluginId}/campaigns`)
                        );
                      }}
                    >
                      Campaign Management
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      {mode === 'create'
                        ? 'Create New Campaign'
                        : methods.getValues('campaign_name')}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Flex>
            <div
              style={{
                maxWidth: '680px',
                flexShrink: 0,
                justifyContent: 'flex-end',
              }}
              className="flex gap-4 "
            >
              {mode === 'view' && (
                <CustomButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    history.push(`/plugins/${pluginId}/campaigns/edit/${campaign?.id}`);
                  }}
                >
                  <Edit stroke={isDarkMode ? '#fff' : '#666687'} />
                  Edit
                </CustomButton>
              )}
              {mode === 'edit' && (
                <>
                  <Button
                    startIcon={<More />}
                    variant="tertiary"
                    size="L"
                    ref={morePopoverRef}
                    onClick={() => setOpenMorePopover(!openMorePopover)}
                  >
                    More
                  </Button>

                  {openMorePopover && (
                    <Popover
                      source={morePopoverRef}
                      placement="bottom"
                      spacing={4}
                      onDismiss={() => setOpenMorePopover(false)}
                    >
                      <Flex direction="column">
                        <PopoverItem
                          role="button"
                          onClick={
                            campaign?.campaign_status === 'inactive'
                              ? undefined
                              : () => setIsOpenUnpublishCampaignModal(true)
                          }
                          justifyContent="space-between"
                          gap={6}
                          className={campaign?.campaign_status !== 'active' ? 'disabled' : ''}
                        >
                          <Typography>Unpublish</Typography>
                          <Pause stroke={isDarkMode ? '#fff' : '#666687'} />
                        </PopoverItem>
                        {campaign?.campaign_status === 'archived' ? (
                          <PopoverItem
                            justifyContent="space-between"
                            role="button"
                            style={{ width: '100%' }}
                            onClick={() => handleArchive('unarchive')}
                          >
                            <Typography>Unarchive</Typography>
                            <Archive stroke={isDarkMode ? '#fff' : '#666687'} />
                          </PopoverItem>
                        ) : (
                          <PopoverItem
                            justifyContent="space-between"
                            role="button"
                            style={{ width: '100%' }}
                            className={campaign?.campaign_status === 'archived' ? 'disabled' : ''}
                            onClick={() => setIsOpenArchiveCampaignModal(true)}
                          >
                            <Typography>Archive</Typography>
                            <Archive stroke={isDarkMode ? '#fff' : '#666687'} />
                          </PopoverItem>
                        )}
                      </Flex>
                    </Popover>
                  )}
                </>
              )}
              {mode === 'edit' && campaign?.campaign_status !== 'draft' && (
                <CustomButton
                  disabled={mode === 'view'}
                  onClick={() =>
                    history.push(`/plugins/${pluginId}/campaigns/report/${campaignId}`)
                  }
                >
                  <Analytics stroke={isDarkMode ? '#fff' : '#32324d'} />
                  View Report
                </CustomButton>
              )}
              {mode !== 'view' && (
                <CustomButton
                  onClick={async () => {
                    // if (
                    //   campaign?.campaign_status === 'active' &&
                    //   getSelectedAds(formAds).length === 0
                    // ) {
                    //   setIsOpenWarnAtLeastOneAdShouldBeSelectedModal(true);
                    //   return;
                    // }
                    campaign?.campaign_status === 'active'
                      ? checkAdDurationOverlapOnSave()
                      : handleCampaignSave();
                  }}
                  disabled={mode === 'view' || isSubmittingCampaignForm}
                >
                  {isSaving ? (
                    <Loader small />
                  ) : (
                    <Save stroke={isDarkMode ? '#ffffff' : '#32324d'} />
                  )}
                  Save
                </CustomButton>
              )}

              {getSelectedAds(formAds).length > 0 &&
                getSelectedAdsToPublish(formAds).length > 0 && (
                  <Button
                    className="accordion-svg"
                    startIcon={
                      <Rocket
                        stroke={
                          getSelectedAds(formAds).length === 0 || isSubmittingCampaignForm
                            ? isDarkMode
                              ? '#ffffff'
                              : '#4a4a6a'
                            : '#ffffff'
                        }
                      />
                    }
                    onClick={async () => {
                      checkAdDurationOverlapOnPublish();
                    }}
                    variant="default"
                    size="L"
                    disabled={getSelectedAds(formAds).length === 0 || isSubmittingCampaignForm}
                  >
                    {`Publish  ${getSelectedAdsToPublish(formAds).length === 1 ? 'Ad' : 'Ads'}`}
                  </Button>
                )}

              {campaign?.campaign_status === 'active' &&
                getSelectedAds(formAds).length > 0 &&
                getSelectedAdsToUnpublish(formAds).length > 0 && (
                  <Button
                    startIcon={
                      <Pause
                        stroke={
                          getSelectedAds(formAds).length === 0 || isSubmittingCampaignForm
                            ? isDarkMode
                              ? '#ffffff'
                              : '#4a4a6a'
                            : '#ffffff'
                        }
                        className="accordion-svg"
                      />
                    }
                    onClick={() => {
                      setIsOpenUnpublishCampaignAdsModal(true);
                    }}
                    variant="default"
                    size="L"
                    disabled={isSubmittingCampaignForm}
                  >
                    {`Unpublish  ${getSelectedAdsToUnpublish(formAds).length === 1 ? 'Ad' : 'Ads'}`}
                  </Button>
                )}

              {/* {mode === 'create' && (
                <Button
                  className="accordion-svg"
                  startIcon={
                    <Rocket
                      stroke={
                        getSelectedAds(formAds).length === 0 || isSubmittingCampaignForm
                          ? isDarkMode
                            ? '#ffffff'
                            : '#4a4a6a'
                          : '#ffffff'
                      }
                    />
                  }
                  onClick={async () => {
                    checkAdDurationOverlap('publish', 'create');
                  }}
                  variant="default"
                  size="L"
                  disabled={getSelectedAds(formAds).length === 0 || isSubmittingCampaignForm}
                >
                  {getSelectedAds(formAds).length === 0
                    ? hasUnsavedChanges
                      ? 'Save & Publish'
                      : 'Publish'
                    : `Publish with ${
                        campaign?.campaign_status === 'active'
                          ? getSelectedAdsToUnpublish(formAds).length
                          : getSelectedAdsToPublish(formAds).length
                      } Ads`}
                </Button>
              )} */}
              {/* 
              {mode === 'edit' &&
                (campaign?.campaign_status === 'active' ? (
                  <Button
                    startIcon={<Rocket />}
                    onClick={async () => {
                      checkAdDurationOverlap('unpublish', 'edit');
                    }}
                    variant="default"
                    size="L"
                    disabled={isSubmittingCampaignForm}
                  >
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    startIcon={<Rocket />}
                    onClick={async () => {
                      checkAdDurationOverlap('publish', 'edit');
                    }}
                    variant="default"
                    size="L"
                    disabled={getSelectedAds(formAds).length === 0 || isSubmittingCampaignForm}
                  >
                    {`Publish with ${
                      campaign?.campaign_status === 'active'
                        ? getSelectedAdsToUnpublish(formAds).length
                        : getSelectedAdsToPublish(formAds).length
                    } Ads`}
                  </Button>
                ))} */}
            </div>
          </div>
        </Box>

        {/*
         =============================================
         MAIN FORM CONTAINER
         =============================================
        */}
        <Flex
          marginTop={'24px'}
          background="neutral0"
          padding={'20px'}
          gap={5}
          hasRadius
          alignItems="flex-start"
          className="max-md:!flex-col z-99 relative"
        >
          {/*
           =============================================
           LEFT COLUMN: FORM SECTIONS
           Campaign details and advertisements
           =============================================
          */}
          <div className="flex flex-col gap-11 md:w-2/3  ">
            {/* ********** CAMPAIGN DETAILS SECTION ********** */}
            <Flex
              background="neutral100"
              padding={'20px'}
              direction="column"
              hasRadius
              gap={4}
              alignItems="unset"
            >
              <Typography variant="beta">Campaign Details</Typography>

              <FormInput
                name="campaign_name"
                label="Campaign Name*"
                placeholder="Enter campaign name"
                error={errors.campaign_name?.message}
                disabled={mode === 'view'}
                isViewMode={mode === 'view'}
              />
              <Flex alignItems="flex-start" direction="column" gap={3}>
                <Typography style={{ fontWeight: 600, fontSize: '12px' }}>
                  Company registered as *
                </Typography>
                <Controller
                  name="campaign_entity_type"
                  control={methods.control}
                  defaultValue="adgm_entity"
                  render={({ field }) => (
                    <Flex gap={5}>
                      <Radio
                        name={field.name}
                        value="adgm_entity"
                        checked={field.value === 'adgm_entity'}
                        onChange={() => field.onChange('adgm_entity')}
                        disabled={mode === 'view'}
                      >
                        Strapi Entity
                      </Radio>
                      <Radio
                        name={field.name}
                        value="external_entity"
                        checked={field.value === 'external_entity'}
                        onChange={() => field.onChange('external_entity')}
                        disabled={mode === 'view'}
                      >
                        External Entity
                      </Radio>
                    </Flex>
                  )}
                />
              </Flex>

              <FormInput
                name="campaign_entity_name"
                label="Entity Name *"
                placeholder="Enter entity name*"
                error={errors.campaign_entity_name?.message}
                disabled={mode === 'view'}
                isViewMode={mode === 'view'}
              />
              {methods.watch('campaign_entity_type') === 'adgm_entity' && (
                <FormInput
                  name="campaign_entity_license_number"
                  label="License Number"
                  placeholder="Enter license number"
                  error={errors.campaign_entity_license_number?.message}
                  disabled={mode === 'view'}
                  isViewMode={mode === 'view'}
                />
              )}
            </Flex>
            {/* ********** ADVERTISEMENTS SECTION ********** */}
            <Box
              background="neutral100"
              padding={'20px'}
              hasRadius
              // borderColor="neutral150"
              // borderStyle="solid"
              // borderWidth="1px"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Typography as="h3" variant="beta">
                  Advertisements
                </Typography>
                {formAds.length > 0 && (
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    style={{ cursor: mode !== 'view' ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (mode !== 'view') {
                        handleSelectAllChange(!formAds.every((ad) => ad.selected));
                      }
                    }}
                  >
                    <Checkbox
                      className="relative z-50"
                      name="selectAll"
                      checked={formAds.every((ad) => ad.selected)}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      disabled={mode === 'view'}
                    />

                    <Typography style={{ marginBottom: '6px' }} variant="omega">
                      Select All
                    </Typography>
                  </Flex>
                )}
              </Flex>
              {formAds.length === 0 ? (
                <>
                  {/*
                   ********** EMPTY ADS CONTAINER **********
                   */}
                  <Box
                    borderStyle="dashed"
                    borderWidth="2px"
                    borderColor="neutral300"
                    padding="20px"
                    hasRadius
                    height="400px"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    marginTop={3}
                    cursor="pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const currentAds = methods.getValues('ads') || [];
                      methods.setValue('ads', [...currentAds, defaultAdValues]);
                      setActiveAdIdx(currentAds.length);
                      setActivePreviewAdIdx(currentAds.length);
                    }}
                  >
                    <Flex
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                      width="100%"
                    >
                      <p style={{ fontSize: '50px', color: isDarkMode ? '#fff' : '#212134' }}>+</p>

                      <Typography variant="alpha">Create Ad</Typography>
                    </Flex>
                  </Box>
                  {/* <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-[300px]">
                    <Button
                      variant="tertiary"
                      onClick={(e) => {
                        e.preventDefault();
                        const currentAds = methods.getValues('ads') || [];
                        methods.setValue('ads', [...currentAds, defaultAdValues]);
                        setActiveAdIdx(currentAds.length); // focus new ad
                      }}
                      startIcon={<Plus />}
                    >
                      Create New Ad
                    </Button>
                  </div> */}
                </>
              ) : (
                <>
                  {/*
                   ********** ADS ACCORDION **********
                   */}
                  <Flex alignItems="unset" direction="column" gap={6} marginTop={5}>
                    {formAds.map((ad, idx) => (
                      <div key={idx} class="accordion-header" id={`ad-accordion-${idx}`}>
                        <Accordion
                          expanded={activeAdIdx === idx}
                          // toggle={() => {
                          //   if (mode !== 'edit') {
                          //     setActiveAdIdx(activeAdIdx === idx ? null : idx);
                          //   }
                          // }}

                          toggle={() => {
                            setActiveAdIdx(activeAdIdx === idx ? null : idx);
                            activePreviewAdIdx !== idx && setActivePreviewAdIdx(idx);
                          }}
                          onToggle={() => {
                            setActiveAdIdx(activeAdIdx === idx ? null : idx);
                            activePreviewAdIdx !== idx && setActivePreviewAdIdx(idx);
                          }}
                          hasRadius
                          shadow={false}
                          error={null}
                        >
                          <AccordionToggle
                            style={{ width: '100%' }}
                            action={
                              <Flex gap={2}>
                                {mode === 'edit' && (
                                  <>
                                    {ad?.ad_status === 'live' && (
                                      <CustomButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();

                                          setUnpublishAdId(ad.id);
                                          setIsOpenUnpublishAdModal(true);
                                        }}
                                      >
                                        <Pause
                                          stroke={isDarkMode ? '#fff' : '#666687'}
                                          className="accordion-svg"
                                        />
                                        Unpublish
                                      </CustomButton>
                                    )}

                                    {ad?.id &&
                                      campaign?.campaign_status !== 'draft' &&
                                      ad?.ad_status !== 'draft' && (
                                        <CustomButton
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            history.push(
                                              `/plugins/${pluginId}/ads/report/${ad.id}`
                                            );
                                          }}
                                        >
                                          <Analytics
                                            stroke={isDarkMode ? '#fff' : '#666687'}
                                            className="accordion-svg"
                                          />
                                          Report
                                        </CustomButton>
                                      )}
                                  </>
                                )}
                                {mode === 'view' && (
                                  <CustomButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      history.push(
                                        `/plugins/${pluginId}/campaigns/edit/${campaign?.id}?ad=${ad?.id}`
                                      );
                                    }}
                                  >
                                    <Edit
                                      className="accordion-svg"
                                      stroke={isDarkMode ? '#fff' : '#32324d'}
                                    />
                                    Edit
                                  </CustomButton>
                                )}
                                {!ad?.id && mode !== 'view' && (
                                  <Button
                                    variant="tertiary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleRemoveAd(idx);
                                    }}
                                    startIcon={<Cross />}
                                  >
                                    Delete
                                  </Button>
                                )}
                                {ad?.id && ad?.ad_status === 'draft' && (
                                  <Button
                                    variant="tertiary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      setDeleteAdId(ad.id);
                                      setIsOpenDeleteAdModal(true);
                                    }}
                                    startIcon={<Cross />}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </Flex>
                            }
                            title={
                              <Flex
                                style={{ width: 'auto' }}
                                direction="row"
                                alignItems="center"
                                gap={1}
                                wrap="wrap"
                              >
                                <Checkbox
                                  className="relative z-50"
                                  name={`ads.${idx}.selected`}
                                  checked={!!formAds[idx]?.selected}
                                  onChange={(e) => handleAdCheckboxChange(e.target.checked, idx)}
                                  onClick={(e) => e.stopPropagation()}
                                  disabled={
                                    mode === 'view' || !!errors?.ads?.[idx]
                                    // ||
                                    // campaign?.campaign_status === 'active'
                                  }
                                />

                                <Flex direction="column" alignItems="flexStart" gap={1}>
                                  <Flex gap={2} alignItems="center">
                                    <Typography>{`Ad ${idx + 1}`}</Typography>
                                    {ad?.id ? (
                                      <StatusBadge
                                        status={
                                          ad?.ad_status === 'live' &&
                                          ad?.ad_start_date &&
                                          new Date(ad.ad_start_date) > new Date()
                                            ? 'live-scheduled'
                                            : ad?.ad_status
                                        }
                                      />
                                    ) : (
                                      <StatusBadge status="New" />
                                    )}
                                  </Flex>

                                  <Typography
                                    style={{
                                      whiteSpace: 'normal',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {formAds[idx]?.ad_name || 'Ad Title Preview'}
                                  </Typography>

                                  <Typography
                                    textColor="neutral600"
                                    variant="pi"
                                    style={{
                                      whiteSpace: 'normal',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {formAds[idx]?.ad_type
                                      ? adTypes.find((t) => t.id === formAds[idx]?.ad_type)?.title
                                      : 'Ad Type Preview - '}
                                    {formAds[idx]?.ad_spot ? ' - ' : ''}
                                    {formAds[idx]?.ad_spot
                                      ? (() => {
                                          const currentAdType = adTypes.find(
                                            (t) => t.id === formAds[idx]?.ad_type
                                          );
                                          const adSpot = currentAdType?.ad_spots?.find(
                                            (s) => s.id === formAds[idx]?.ad_spot
                                          );
                                          return (adSpot?.ad_spot_title || '').replace(
                                            /\b\w/g,
                                            (c) => c.toUpperCase()
                                          );
                                        })()
                                      : ''}
                                    {formAds[idx]?.ad_start_date &&
                                    formAds[idx]?.ad_start_date !== '{}' &&
                                    !isNaN(new Date(formAds[idx]?.ad_start_date).getTime())
                                      ? ' • '
                                      : ''}
                                    {formAds[idx]?.ad_start_date &&
                                    formAds[idx]?.ad_start_date !== '{}' &&
                                    !isNaN(new Date(formAds[idx]?.ad_start_date).getTime())
                                      ? `${format(new Date(formAds[idx]?.ad_start_date), 'dd/MM/yyyy')} - ${
                                          formAds[idx]?.ad_end_date &&
                                          formAds[idx]?.ad_end_date !== '{}' &&
                                          !isNaN(new Date(formAds[idx]?.ad_end_date).getTime())
                                            ? format(
                                                new Date(formAds[idx]?.ad_end_date),
                                                'dd/MM/yyyy'
                                              )
                                            : 'Ongoing'
                                        }`
                                      : 'Date Preview'}
                                  </Typography>
                                </Flex>
                              </Flex>
                            }
                            description={null}
                          />
                          <AccordionContent padding="24px">
                            <div className="flex flex-col gap-5 mt-4 p-8">
                              <FormInput
                                name={`ads.${idx}.ad_name`}
                                label={`Ad ${idx + 1} Name`}
                                placeholder={`Enter ad name for Ad ${idx + 1}*`}
                                error={errors.ads?.[idx]?.ad_name?.message}
                                disabled={mode === 'view'}
                                isViewMode={mode === 'view'}
                              />
                              <div className="flex gap-1 flex-col">
                                <div className="flex gap-5 w-full">
                                  <div className="flex flex-col flex-[1_1_0%] min-w-0">
                                    {mode === 'view' ||
                                    (campaign?.campaign_status === 'active' &&
                                      ad?.ad_status === 'live') ? (
                                      <Tooltip description="If you need to change the date, please unpublish the ad first and then make the update.">
                                        <div style={{ cursor: 'not-allowed' }}>
                                          <FormDatePicker
                                            name={`ads.${idx}.ad_start_date`}
                                            label="Start Date*"
                                            error={errors.ads?.[idx]?.ad_start_date?.message}
                                            disabled={true}
                                            disablePastDates={
                                              methods.getValues(`ads.${idx}.ad_id`) ? false : true
                                            }
                                          />
                                        </div>
                                      </Tooltip>
                                    ) : (
                                      <FormDatePicker
                                        name={`ads.${idx}.ad_start_date`}
                                        label="Start Date*"
                                        error={errors.ads?.[idx]?.ad_start_date?.message}
                                        disabled={mode === 'view'}
                                        disablePastDates={
                                          methods.getValues(`ads.${idx}.ad_id`) ? false : true
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className="flex flex-col flex-[1_1_0%] min-w-0">
                                    {mode === 'view' ||
                                    (campaign?.campaign_status === 'active' &&
                                      ad?.ad_status === 'live') ? (
                                      <Tooltip description="If you need to change the date, please unpublish the ad first and then make the update.">
                                        <div style={{ cursor: 'not-allowed' }}>
                                          <FormDatePicker
                                            name={`ads.${idx}.ad_end_date`}
                                            label="End Date*"
                                            error={errors.ads?.[idx]?.ad_end_date?.message}
                                            disabled={true}
                                            disablePastDates={true}
                                          />
                                        </div>
                                      </Tooltip>
                                    ) : (
                                      <FormDatePicker
                                        name={`ads.${idx}.ad_end_date`}
                                        label="End Date*"
                                        error={errors.ads?.[idx]?.ad_end_date?.message}
                                        disabled={mode === 'view'}
                                        disablePastDates={true}
                                      />
                                    )}
                                  </div>
                                </div>
                                {/* <Typography textColor="neutral600" variant="pi">
                                  Your campaign will be publised on the above dates subject to adgm
                                  admin team approval
                                </Typography> */}
                              </div>
                              <Box>
                                <Typography
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    margin: '0 0 8px 0',
                                    display: 'block',
                                  }}
                                >
                                  Ad Type*
                                </Typography>
                                <Controller
                                  name={`ads.${idx}.ad_type`}
                                  control={methods.control}
                                  disabled={
                                    mode === 'view' ||
                                    (campaign?.campaign_status === 'active' &&
                                      ad?.ad_status === 'live')
                                  }
                                  render={({ field }) => {
                                    const isDisabled =
                                      mode === 'view' ||
                                      (campaign?.campaign_status === 'active' &&
                                        ad?.ad_status === 'live');

                                    return (
                                      <Flex gap={2} style={{ height: '184px' }}>
                                        {adTypes.map((adType) => {
                                          const adTypeCard = (
                                            <Flex
                                              key={adType.id}
                                              style={{
                                                width: '100%',
                                                borderRadius: '4px',
                                                height: '184px',
                                                padding: '14px',
                                                opacity: isDisabled ? 0.5 : 1,
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                              }}
                                              background={
                                                field.value === adType.id ? 'neutral00' : 'neutral0'
                                              }
                                              borderColor={
                                                field.value === adType.id
                                                  ? 'primary700'
                                                  : 'primary100'
                                              }
                                              borderWidth="2px"
                                              borderStyle="solid"
                                              direction="column"
                                              justifyContent="space-between"
                                              alignItems="start"
                                              onClick={() => {
                                                if (isDisabled) return;
                                                if (field.value === adType.id) return;
                                                // Check if image exists and ad type is changing
                                                const hasImage =
                                                  methods.getValues(`ads.${idx}.ad_image`) ||
                                                  methods.getValues(`ads.${idx}.ad_image_url`);

                                                if (hasImage) {
                                                  // Show confirmation modal
                                                  setPendingAdTypeChange({
                                                    idx,
                                                    adTypeId: adType.id,
                                                  });
                                                  setOpenConfirmChangeAdTypeModal(true);
                                                } else {
                                                  // No image, proceed with change
                                                  field.onChange(adType.id);
                                                  setActiveAdType(adType);
                                                  setActivePreviewAdType(adType);
                                                  methods.setValue(`ads.${idx}.ad_image`, null);
                                                  methods.setValue(`ads.${idx}.ad_image_url`, null);
                                                  methods.setValue(`ads.${idx}.ad_video_url`, null);
                                                  methods.setValue(`ads.${idx}.ad_spot`, null);
                                                  methods.setValue(`ads.${idx}.ad_screens`, []);
                                                }
                                              }}
                                              tabIndex={0}
                                              aria-pressed={field.value === adType.id}
                                            >
                                              <Flex
                                                justifyContent="space-between"
                                                alignItems="start"
                                                style={{ width: '100%' }}
                                              >
                                                <img
                                                  style={{ width: '29px' }}
                                                  src={adTypeCardImages[adType.ad_type_id] || ''}
                                                  alt={adType.title}
                                                />
                                                <Radio
                                                  name={field.name}
                                                  value={adType.id}
                                                  checked={field.value === adType.id}
                                                  onChange={() => {
                                                    if (field.value === adType.id) return;

                                                    // Check if image exists and ad type is changing
                                                    const hasImage =
                                                      methods.getValues(`ads.${idx}.ad_image`) ||
                                                      methods.getValues(`ads.${idx}.ad_image_url`);

                                                    if (hasImage) {
                                                      // Show confirmation modal
                                                      setPendingAdTypeChange({
                                                        idx,
                                                        adTypeId: adType.id,
                                                      });
                                                      setOpenConfirmChangeAdTypeModal(true);
                                                    } else {
                                                      // No image, proceed with change
                                                      field.onChange(adType.id);
                                                      setActiveAdType(adType);
                                                      setActivePreviewAdType(adType);
                                                      methods.setValue(`ads.${idx}.ad_image`, null);
                                                      methods.setValue(
                                                        `ads.${idx}.ad_image_url`,
                                                        null
                                                      );
                                                      methods.setValue(
                                                        `ads.${idx}.ad_video_url`,
                                                        null
                                                      );
                                                      methods.setValue(`ads.${idx}.ad_spot`, null);
                                                      methods.setValue(`ads.${idx}.ad_screens`, []);
                                                    }
                                                  }}
                                                />
                                              </Flex>
                                              <Flex direction="column" alignItems="start" gap="2">
                                                <Typography
                                                  style={{ fontSize: '12px' }}
                                                  variant="beta"
                                                >
                                                  {adType.title}
                                                </Typography>
                                                <Typography
                                                  style={{ fontSize: '10px' }}
                                                  textColor="neutral600"
                                                  variant="epsilon"
                                                >
                                                  {adType.description}
                                                </Typography>
                                              </Flex>
                                            </Flex>
                                          );

                                          return isDisabled ? (
                                            <Tooltip
                                              key={adType.id}
                                              description="If you need to change the type, please unpublish the ad first and then make the update."
                                            >
                                              {adTypeCard}
                                            </Tooltip>
                                          ) : (
                                            adTypeCard
                                          );
                                        })}
                                      </Flex>
                                    );
                                  }}
                                />

                                {methods.formState.errors?.ads?.[idx]?.ad_type?.message && (
                                  <Typography
                                    variant="pi"
                                    textColor="danger600"
                                    style={{ marginTop: '8px', fontSize: '12px' }}
                                  >
                                    {methods.formState.errors.ads[idx].ad_type.message}
                                  </Typography>
                                )}
                              </Box>

                              {activeAdType && (
                                <Box style={{ width: '100%' }} key={activeAdType.id}>
                                  <Controller
                                    name={`ads.${idx}.ad_spot`}
                                    control={methods.control}
                                    render={({ field }) => (
                                      <Flex alignItems="start" direction="column" gap={2}>
                                        {activeAdType?.ad_spots.map((adSpot) => (
                                          <Flex
                                            justifyContent="space-between"
                                            style={{ width: '100%' }}
                                          >
                                            <Radio
                                              name={field.name}
                                              value={adSpot.id}
                                              checked={field.value === adSpot.id}
                                              onChange={() => {
                                                field.onChange(adSpot.id);
                                                methods.setValue(`ads.${idx}.ad_screens`, []);
                                              }}
                                              disabled={
                                                mode === 'view'
                                                // ||
                                                // (campaign?.campaign_status === 'active' &&
                                                //   ad?.ad_status === 'live')
                                              }
                                            >
                                              {adSpot.ad_spot_display_text}
                                            </Radio>
                                            {methods.watch(`ads.${idx}.ad_spot`) === adSpot.id &&
                                              adSpot.ad_screens.length > 0 && (
                                                <Controller
                                                  name={`ads.${idx}.ad_screens`}
                                                  control={methods.control}
                                                  defaultValue={[]} // Ensures the value is always an array
                                                  render={({ field }) => (
                                                    <Flex gap={4}>
                                                      {adSpot.ad_screens.map((screen) => (
                                                        <Checkbox
                                                          key={screen.id}
                                                          value={screen.id}
                                                          checked={
                                                            Array.isArray(field.value) &&
                                                            field.value.includes(screen.id)
                                                          }
                                                          onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            const value = screen.id;
                                                            let newValue = Array.isArray(
                                                              field.value
                                                            )
                                                              ? [...field.value]
                                                              : [];
                                                            if (checked) {
                                                              if (!newValue.includes(value))
                                                                newValue.push(value);
                                                            } else {
                                                              newValue = newValue.filter(
                                                                (v) => v !== value
                                                              );
                                                            }
                                                            field.onChange(newValue);
                                                          }}
                                                          disabled={
                                                            mode === 'view'
                                                            // ||
                                                            // (campaign?.campaign_status ===
                                                            //   'active' &&
                                                            //   ad?.ad_status === 'live')
                                                          }
                                                        >
                                                          {screen.ad_screen_title}
                                                        </Checkbox>
                                                      ))}
                                                    </Flex>
                                                  )}
                                                />
                                              )}
                                          </Flex>
                                        ))}
                                        {methods.formState.errors?.ads?.[idx]?.ad_spot?.message && (
                                          <Typography
                                            variant="pi"
                                            textColor="danger600"
                                            style={{ marginTop: '4px', fontSize: '12px' }}
                                          >
                                            {methods.formState.errors.ads[idx].ad_spot?.message}
                                          </Typography>
                                        )}
                                        {methods.formState.errors?.ads?.[idx]?.ad_screens
                                          ?.message && (
                                          <Typography
                                            variant="pi"
                                            textColor="danger600"
                                            style={{ marginTop: '4px', fontSize: '12px' }}
                                          >
                                            {methods.formState.errors.ads[idx].ad_screens?.message}
                                          </Typography>
                                        )}
                                      </Flex>
                                    )}
                                  />
                                </Box>
                              )}

                              <FormInput
                                name={`ads.${idx}.ad_headline`}
                                label="Headline*"
                                placeholder="Enter headline"
                                maxLength={getCurrentValidationRules(idx).titleMax}
                                showCharCount={true}
                                error={errors.ads?.[idx]?.ad_headline?.message}
                                disabled={mode === 'view'}
                                isViewMode={mode === 'view'}
                              />
                              <Box>
                                <Typography
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    margin: '0 0 8px 0',
                                    display: 'block',
                                  }}
                                >
                                  Destination URL*
                                </Typography>

                                <Controller
                                  name={`ads.${idx}.is_external`}
                                  control={methods.control}
                                  // defaultValue={true}
                                  render={({ field }) => (
                                    <Flex
                                      gap={5}
                                      style={{
                                        margin: '0 0 8px 0',
                                      }}
                                    >
                                      <Radio
                                        name={field.name}
                                        value="yes"
                                        checked={field.value === 'yes'}
                                        onChange={() => field.onChange('yes')}
                                        disabled={mode === 'view'}
                                      >
                                        External
                                      </Radio>
                                      <Radio
                                        name={field.name}
                                        value="no"
                                        checked={field.value === 'no'}
                                        onChange={() => field.onChange('no')}
                                        disabled={mode === 'view'}
                                      >
                                        Internal (In-app route)
                                      </Radio>
                                    </Flex>
                                  )}
                                />
                                {methods.watch(`ads.${idx}.is_external`) === 'yes' && (
                                  <FormInput
                                    name={`ads.${idx}.ad_external_url`}
                                    // label={`Destination URL*`}
                                    placeholder="Enter Destination URL"
                                    style={{ margin: 0 }}
                                    type="url"
                                    maxLength={2048}
                                    error={errors.ads?.[idx]?.ad_external_url?.message}
                                    disabled={mode === 'view'}
                                    isViewMode={mode === 'view'}
                                    className="m-0"
                                  />
                                )}
                                {methods.watch(`ads.${idx}.is_external`) === 'no' && (
                                  <Box>
                                    <Box marginBottom={3}>
                                      <Controller
                                        name={`ads.${idx}.ad_destination_models`}
                                        control={methods.control}
                                        defaultValue=""
                                        render={({ field }) => (
                                          <SingleSelect
                                            value={field.value ?? ''}
                                            onChange={(value) => {
                                              field.onChange(value);
                                              setActiveDestinationPage(1);
                                              setActiveDestinationPageOptions([]);
                                              methods.setValue(
                                                `ads.${idx}.ad_destination_page`,
                                                ''
                                              );
                                            }}
                                            disabled={mode === 'view'}
                                            placeholder="Select Destination Model"
                                          >
                                            {destinationModels.map((option) => (
                                              <SingleSelectOption
                                                key={option?.key}
                                                value={option?.key}
                                              >
                                                {option?.label}
                                              </SingleSelectOption>
                                            ))}
                                          </SingleSelect>
                                        )}
                                      />
                                      {methods.formState.errors?.ads?.[idx]?.ad_destination_models
                                        ?.message && (
                                        <Typography
                                          variant="pi"
                                          textColor="danger600"
                                          style={{ marginTop: '4px', fontSize: '12px' }}
                                        >
                                          {
                                            methods.formState.errors.ads[idx].ad_destination_models
                                              ?.message
                                          }
                                        </Typography>
                                      )}
                                    </Box>
                                    <Controller
                                      name={`ads.${idx}.ad_destination_page`}
                                      control={methods.control}
                                      defaultValue=""
                                      render={({ field }) => {
                                        // Build options list from lazy-loaded options
                                        const lazyOptions = activeDestinationPageOptions || [];
                                        let rawOptions = [...lazyOptions];

                                        // Only add the selected option if there's a value and it's not already in the list
                                        if (
                                          field.value &&
                                          selectedDestinationPageOptionRef.current &&
                                          !lazyOptions.some(
                                            (opt) =>
                                              String(opt.id) ===
                                              String(selectedDestinationPageOptionRef.current.id)
                                          )
                                        ) {
                                          rawOptions = [
                                            selectedDestinationPageOptionRef.current,
                                            ...rawOptions,
                                          ];
                                        }

                                        // Convert to react-select format
                                        const selectOptions = rawOptions.map((opt) => ({
                                          value: String(opt.id),
                                          label: opt.title,
                                          data: opt,
                                        }));

                                        // Find current selected option
                                        const selectedOption = field.value
                                          ? selectOptions.find(
                                              (opt) => opt.value === String(field.value)
                                            ) || null
                                          : null;

                                        const hasMorePages =
                                          activeDestinationPage * 10 < totalDestinationPageOptions;

                                        return (
                                          <Select
                                            key={`destination-page-${watchCurrentDestinationModel}`}
                                            value={selectedOption}
                                            onChange={(option) => {
                                              field.onChange(option ? option.value : '');
                                              if (option) {
                                                selectedDestinationPageOptionRef.current =
                                                  option.data;
                                              } else {
                                                selectedDestinationPageOptionRef.current = null;
                                              }
                                            }}
                                            options={selectOptions}
                                            isDisabled={mode === 'view'}
                                            placeholder="Select Destination Page"
                                            isClearable
                                            isLoading={
                                              isLoadingMoreDestinations ||
                                              destinationPageSearch !==
                                                debouncedDestinationPageSearch
                                            }
                                            onInputChange={(inputValue, { action }) => {
                                              if (action === 'input-change') {
                                                setDestinationPageSearch(inputValue);
                                                setActiveDestinationPage(1);
                                              }
                                            }}
                                            onMenuScrollToBottom={() => {
                                              if (!isLoadingMoreDestinations && hasMorePages) {
                                                setIsLoadingMoreDestinations(true);
                                                setActiveDestinationPage((prev) => prev + 1);
                                              }
                                            }}
                                            filterOption={() => true} // Disable client-side filtering, we do server-side
                                            styles={{
                                              control: (base, state) => ({
                                                ...base,
                                                minHeight: '40px',
                                                backgroundColor: isDarkMode ? '#181826' : '#ffffff',
                                                borderColor: state.isFocused
                                                  ? '#7b79ff'
                                                  : isDarkMode
                                                    ? '#4a4a6a'
                                                    : '#dcdce4',
                                                borderRadius: '4px',
                                                boxShadow: state.isFocused
                                                  ? '0 0 0 2px rgba(123, 121, 255, 0.2)'
                                                  : 'none',
                                                '&:hover': {
                                                  borderColor: '#7b79ff',
                                                },
                                              }),
                                              menu: (base) => ({
                                                ...base,
                                                backgroundColor: isDarkMode ? '#212134' : '#ffffff',
                                                border: isDarkMode
                                                  ? '1px solid #4a4a6a'
                                                  : '1px solid #dcdce4',
                                                borderRadius: '4px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                zIndex: 9999,
                                              }),
                                              menuList: (base) => ({
                                                ...base,
                                                padding: '4px',
                                              }),
                                              option: (base, state) => ({
                                                ...base,
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                backgroundColor: state.isSelected
                                                  ? '#7b79ff'
                                                  : state.isFocused
                                                    ? isDarkMode
                                                      ? '#2a2a44'
                                                      : '#f0f0ff'
                                                    : 'transparent',
                                                color: state.isSelected
                                                  ? '#ffffff'
                                                  : isDarkMode
                                                    ? '#ffffff'
                                                    : '#32324d',
                                                borderRadius: '4px',
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                '&:active': {
                                                  backgroundColor: '#7b79ff',
                                                },
                                              }),
                                              singleValue: (base) => ({
                                                ...base,
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                color: isDarkMode ? '#ffffff' : '#32324d',
                                              }),
                                              input: (base) => ({
                                                ...base,
                                                color: isDarkMode ? '#ffffff' : '#32324d',
                                              }),
                                              placeholder: (base) => ({
                                                ...base,
                                                color: isDarkMode ? '#a5a5ba' : '#8e8ea9',
                                              }),
                                              indicatorSeparator: (base) => ({
                                                ...base,
                                                backgroundColor: isDarkMode ? '#4a4a6a' : '#dcdce4',
                                              }),
                                              dropdownIndicator: (base) => ({
                                                ...base,
                                                color: isDarkMode ? '#a5a5ba' : '#8e8ea9',
                                                '&:hover': {
                                                  color: isDarkMode ? '#ffffff' : '#32324d',
                                                },
                                              }),
                                              clearIndicator: (base) => ({
                                                ...base,
                                                color: isDarkMode ? '#a5a5ba' : '#8e8ea9',
                                                '&:hover': {
                                                  color: isDarkMode ? '#ffffff' : '#32324d',
                                                },
                                              }),
                                              loadingIndicator: (base) => ({
                                                ...base,
                                                color: '#7b79ff',
                                              }),
                                              noOptionsMessage: (base) => ({
                                                ...base,
                                                color: isDarkMode ? '#a5a5ba' : '#8e8ea9',
                                              }),
                                            }}
                                          />
                                        );
                                      }}
                                    />
                                    {methods.formState.errors?.ads?.[idx]?.ad_destination_page
                                      ?.message && (
                                      <Typography
                                        variant="pi"
                                        textColor="danger600"
                                        style={{ marginTop: '4px', fontSize: '12px' }}
                                      >
                                        {
                                          methods.formState.errors.ads[idx].ad_destination_page
                                            ?.message
                                        }
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Box>
                              <FormTextArea
                                name={`ads.${idx}.ad_description`}
                                label="Description*"
                                maxLength={getCurrentValidationRules(idx).descMax}
                                placeholder="Enter ad description"
                                error={errors.ads?.[idx]?.ad_description?.message}
                                disabled={mode === 'view'}
                                isViewMode={mode === 'view'}
                                showCharCount={true}
                              />
                              {activeAdType?.ad_type_id === 'sticky-ad' && (
                                <FormInput
                                  name={`ads.${idx}.ad_cta_name`}
                                  label="CTA Name*"
                                  placeholder="Enter CTA Name"
                                  error={errors.ads?.[idx]?.ad_cta_name?.message}
                                  disabled={mode === 'view'}
                                  isViewMode={mode === 'view'}
                                />
                              )}
                              {getCurrentValidationRules(idx).videoAllowed ? (
                                <TabGroup
                                  selectedTabIndex={Number(mediaTab)}
                                  onTabChange={(index) => {
                                    const hasImageOrVideo =
                                      methods.getValues(`ads.${idx}.ad_image`) ||
                                      methods.getValues(`ads.${idx}.ad_image_url`) ||
                                      methods.getValues(`ads.${idx}.ad_video_url`);

                                    if (hasImageOrVideo) {
                                      setPendingMediaTabChange({ idx, index });
                                      setOpenConfirmChangeMediaTabModal(true);
                                    } else {
                                      methods.setValue(`ads.${idx}.ad_media_tab`, index, {
                                        shouldDirty: true,
                                      });
                                      methods.setValue(`ads.${idx}.ad_image`, null);
                                      methods.setValue(`ads.${idx}.ad_image_url`, null);
                                      methods.setValue(`ads.${idx}.ad_video_url`, null);
                                    }
                                  }}
                                >
                                  <Tabs style={{ marginBottom: '16px', width: '15rem' }}>
                                    <TabButton>
                                      <Button
                                        variant="tertiary"
                                        size="L"
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Typography
                                          variant="pi"
                                          fontWeight="bold"
                                          textColor="neutral800"
                                        >
                                          Upload Image
                                        </Typography>
                                      </Button>
                                    </TabButton>

                                    <TabButton>
                                      <Button
                                        variant="tertiary"
                                        size="L"
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Typography
                                          variant="pi"
                                          fontWeight="bold"
                                          textColor="neutral800"
                                        >
                                          Video
                                        </Typography>
                                      </Button>
                                    </TabButton>
                                  </Tabs>
                                  <TabPanels>
                                    <TabPanel>
                                      <FileUpload
                                        name={`ads.${idx}.ad_image`}
                                        adImageUrl={`ads.${idx}.ad_image_url`}
                                        disabled={mode === 'view'}
                                        activeAdTypeId={methods.watch(`ads.${idx}.ad_type`)}
                                        activeAdSpotId={methods.watch(`ads.${idx}.ad_spot`)}
                                        activeAdScreens={
                                          methods.watch(`ads.${idx}.ad_screens`) || []
                                        }
                                        adTypes={adTypes}
                                        error={errors.ads?.[idx]?.ad_image?.message}
                                      />
                                    </TabPanel>
                                    <TabPanel>
                                      <Box marginBottom={4}>
                                        <FormInput
                                          name={`ads.${idx}.ad_video_url`}
                                          label={`Vimeo Link*`}
                                          placeholder={`https://example.com`}
                                          type="url"
                                          error={errors.ads?.[idx]?.ad_video_url?.message}
                                          disabled={mode === 'view'}
                                          isViewMode={mode === 'view'}
                                        />
                                      </Box>
                                      <FileUpload
                                        name={`ads.${idx}.ad_image`}
                                        adImageUrl={`ads.${idx}.ad_image_url`}
                                        disabled={mode === 'view'}
                                        activeAdTypeId={methods.watch(`ads.${idx}.ad_type`)}
                                        activeAdSpotId={methods.watch(`ads.${idx}.ad_spot`)}
                                        activeAdScreens={
                                          methods.watch(`ads.${idx}.ad_screens`) || []
                                        }
                                        adTypes={adTypes}
                                        error={errors.ads?.[idx]?.ad_image?.message}
                                      />
                                    </TabPanel>
                                  </TabPanels>
                                </TabGroup>
                              ) : (
                                <FileUpload
                                  name={`ads.${idx}.ad_image`}
                                  adImageUrl={`ads.${idx}.ad_image_url`}
                                  disabled={mode === 'view'}
                                  activeAdTypeId={methods.watch(`ads.${idx}.ad_type`)}
                                  activeAdSpotId={methods.watch(`ads.${idx}.ad_spot`)}
                                  activeAdScreens={methods.watch(`ads.${idx}.ad_screens`) || []}
                                  adTypes={adTypes}
                                  error={errors.ads?.[idx]?.ad_image?.message}
                                />
                              )}
                            </div>
                          </AccordionContent>
                        </Accordion>
                      </div>
                    ))}
                  </Flex>

                  {/*
                   ********** ADD AD BUTTON **********
                   */}
                  <div className="flex justify-end !mt-6">
                    <Button
                      variant="tertiary"
                      className="w-full !h-auto py-6 flex items-center justify-center mt-4"
                      disabled={mode === 'view'}
                      onClick={(e) => {
                        e.preventDefault();
                        const currentAds = methods.getValues('ads') || [];
                        methods.setValue('ads', [...currentAds, defaultAdValues]);
                        setActiveAdIdx(currentAds.length); // focus new ad
                        setActivePreviewAdIdx(currentAds.length); // set preview to new ad
                      }}
                      startIcon={<Plus />}
                    >
                      New Ad
                    </Button>
                  </div>
                </>
              )}
            </Box>
          </div>

          {/*
           =============================================
           RIGHT COLUMN: PREVIEW AND SUMMARY
           Ad preview and campaign summary sections
           =============================================
          */}
          <Flex
            // background="neutral100"
            direction="column"
            as="aside"
            className="flex-1 gap-4 relative"
            style={{ alignSelf: 'flex-start', position: 'sticky', top: '170px' }}
          >
            {/*
             ********** AD PREVIEW SECTION **********
             */}
            <Flex
              background="neutral100"
              direction="column"
              padding="20px"
              width="100%"
              className="flex-1 gap-5 relative"
            >
              <div className="items-center justify-center py-16 flex flex-col bg-card-color border border-border-form rounded-md">
                <div
                  style={{
                    marginBottom: '10px',
                  }}
                  className="w-full px-5"
                >
                  <Flex direction="column" justifyContent="space-between" alignItems="center">
                    <Typography variant="omega" fontWeight="bold" className="mb-5 text-label">
                      Ad Preview
                    </Typography>
                    <Typography
                      textColor="neutral500"
                      variant="pi"
                      fontWeight="bold"
                      className="text-label"
                    >
                      Select AD to preview
                    </Typography>
                  </Flex>
                  {(methods.getValues(`ads.${activePreviewAdIdx}.ad_image`) ||
                    methods.getValues(`ads.${activePreviewAdIdx}.ad_image_url`)) && (
                    <>
                      <div onClick={downloadImage}>
                        <Download
                          style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: '25px',
                            right: '25px',
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative mt-5" ref={imgRef}>
                  <img
                    src={iphoneFrame}
                    alt="Ad Preview"
                    className="rounded  h-[424px] object-contain object-center"
                  />

                  {activePreviewAdIdx !== null &&
                  methods.getValues(`ads.${activePreviewAdIdx}.ad_type`) ? (
                    renderAdPreviewByType({
                      adTypeId: activePreviewAdType?.ad_type_id,
                      imageSrc,
                      aspectRatio: activePreviewAdType?.image_size
                        ? `${activePreviewAdType.image_size.width} / ${activePreviewAdType.image_size.height}`
                        : '1',
                      title: getCurrentAdTitle(),
                      description: getCurrentAdDescription(),
                      ctaName: getCurrentAdCtaName(),
                      isPreviewImage,
                    })
                  ) : (
                    <div className="z-10 flex items-center justify-center top-0 absolute h-full py-20 w-full left-1/2 -translate-x-1/2">
                      <Typography
                        textColor="neutral500"
                        className="text-label"
                        style={{
                          fontSize: '12px',
                          textAlign: 'center',
                          lineHeight: '16px',
                          fontWeight: '700',
                        }}
                      >
                        {activePreviewAdIdx !== null ? (
                          <>
                            Add information
                            <br />
                            to load preview
                          </>
                        ) : (
                          <>
                            Please click an <br />
                            Ad on the left
                            <br /> for preview
                          </>
                        )}
                      </Typography>
                    </div>
                  )}
                </div>
                <Typography
                  textColor="neutral500"
                  variant="pi"
                  fontWeight="bold"
                  className="text-label"
                  style={{ marginTop: '12px' }}
                >
                  {(methods.getValues(`ads.${activePreviewAdIdx}.ad_image`) ||
                    methods.getValues(`ads.${activePreviewAdIdx}.ad_image_url`)) &&
                  activePreviewAdType?.image_size
                    ? `${methods.getValues(`ads.${activePreviewAdIdx}.ad_name`)} - ${activePreviewAdType.image_size.width}px × ${activePreviewAdType.image_size.height}px`
                    : 'Ad Name - Ad Size'}
                </Typography>
              </div>
            </Flex>
            <Flex direction="column" gap="1">
              <Typography
                textColor="neutral600"
                style={{
                  fontSize: '12px',
                  marginBottom: '4px',
                }}
                variant="pi"
              >
                {campaign?.updatedAt && (
                  <>
                    Last updated{' '}
                    {formatDistanceToNow(new Date(campaign.updatedAt), { addSuffix: true })}
                    {campaign?.updatedBy ? (
                      <>
                        {' by '}
                        {campaign.updatedBy.firstname} {campaign.updatedBy.lastname}
                      </>
                    ) : campaign?.createdBy ? (
                      <>
                        {' by '}
                        {campaign.createdBy.firstname} {campaign.createdBy.lastname}
                      </>
                    ) : null}
                  </>
                )}
              </Typography>
              <Typography
                textColor="neutral600"
                style={{
                  fontSize: '12px',
                }}
                variant="pi"
              >
                {campaign?.createdAt && (
                  <>
                    Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                    {campaign?.createdBy ? (
                      <>
                        {' by '}
                        {campaign?.createdBy?.firstname} {campaign?.createdBy?.lastname}
                      </>
                    ) : null}
                  </>
                )}
              </Typography>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default CampaignForm;

const ListingBannerPreview = ({ imageSrc, aspectRatio, title, description }) => (
  <div
    style={{ marginTop: '40px' }}
    className="z-10 flex items-start justify-center absolute inset-0 py-20 "
  >
    <div
      style={{
        width: 'calc(100% - 2rem)',
        maxHeight: '100%',
        backgroundColor: '#ffffff',
        padding: 4,
        paddingRight: 8,
      }}
      className="relative flex items-start  rounded-xl overflow-hidden gap-1"
    >
      <img
        src={imageSrc}
        className="aspect-square  object-cover rounded-xl"
        style={{ width: '30%' }}
        crossOrigin="anonymous"
      />

      <div style={{ flexGrow: 1 }}>
        <div className="flex items-center justify-between gap-1 mb-4">
          <Typography
            style={{
              color: 'black',
              fontSize: '9px',
              border: '1px solid #0000001A',
              padding: '2px 4px',
              borderRadius: '15px',
            }}
            variant="pi"
          >
            Sponsored{' '}
            <span
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '2px 3px',
                borderRadius: '4px',
                fontSize: '7px',
              }}
            >
              AD
            </span>
          </Typography>
          <div
            style={{
              backgroundColor: 'black',
              aspectRatio: 1,
              borderRadius: '25%',
              padding: '4px',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Arrow stroke="#fff" style={{ width: 10 }} />
          </div>
        </div>
        <p className="z-20 px-6 pb-4  " style={{ fontSize: '12px', color: 'black', marginTop: 2 }}>
          {truncate(title, 16)}
        </p>
        <p
          style={{
            fontSize: '8px',
            color: '#000000B3',
            marginTop: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '70%',
          }}
        >
          {truncate(description, 30)}
        </p>
      </div>
    </div>
  </div>
);

const WidgetBannerPreview = ({ imageSrc, aspectRatio, title, description, isPreviewImage }) => (
  <div
    style={{ marginTop: '40px' }}
    className="z-10 flex items-start justify-center absolute inset-0 py-20 "
  >
    <div
      style={{
        width: 'calc(100% - 2rem)',
        maxHeight: '100%',
        backgroundColor: '#ffffff',
      }}
      className="relative flex items-start  rounded-xl overflow-hidden gap-1"
    >
      <img
        src={imageSrc}
        className="aspect-square  object-cover rounded-xl"
        crossOrigin="anonymous"
      />
      {isPreviewImage && (
        <div
          style={{
            position: 'absolute',

            bottom: 0,
            left: 0,
            maskImage: 'linear-gradient(transparent, black, black)',
            width: '100%',
            height: '60%',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.5))',
            backdropFilter: 'blur(21px)',
            zIndex: 0,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          padding: '8px',
        }}
      >
        <div className="flex flex-col h-full justify-between gap-1">
          <div
            style={{
              backgroundColor: 'black',
              aspectRatio: 1,
              borderRadius: '25%',
              padding: '4px',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto',
            }}
          >
            <Arrow stroke="#fff" style={{ width: 10 }} />
          </div>
          <div>
            <p
              className="z-20 px-6 pb-4"
              style={{
                fontSize: '12px',
                color: isPreviewImage ? 'white' : 'black',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {truncate(title, 24)}
            </p>
            <p
              style={{
                fontSize: '8px',
                color: isPreviewImage ? '#ffffffB3' : '000000B3',
                marginTop: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {truncate(description, 30)}
            </p>
            <Typography
              style={{
                color: isPreviewImage ? 'white' : 'black',
                fontSize: '9px',
                border: '1px solid #0000001A',
                padding: '2px 4px',
                borderRadius: '15px',
                marginTop: '10px',
                display: 'inline-block',
              }}
              variant="pi"
            >
              Sponsored{' '}
              <span
                style={{
                  backgroundColor: isPreviewImage ? 'white' : 'black',
                  color: isPreviewImage ? 'black' : 'white',
                  padding: '2px 3px',
                  borderRadius: '4px',
                  fontSize: '7px',
                }}
              >
                AD
              </span>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StickyAdPreview = ({
  imageSrc,
  aspectRatio,
  title,
  description,
  isPreviewImage,
  ctaName,
}) => (
  <div className="z-10 flex items-center justify-center absolute inset-0 py-20 ">
    <div
      style={{
        width: 'calc(100% - 2rem)',
        maxHeight: '100%',
        backgroundColor: '#ffffff',
      }}
      className="relative flex items-start  rounded-xl overflow-hidden gap-1"
    >
      <img
        src={imageSrc}
        className="  object-cover rounded-xl"
        style={{ aspectRatio: 0.67 }}
        crossOrigin="anonymous"
      />
      {isPreviewImage && (
        <div
          style={{
            position: 'absolute',

            bottom: 0,
            left: 0,
            maskImage: 'linear-gradient(transparent, black, black)',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.5))',
            backdropFilter: 'blur(21px)',
            zIndex: 0,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          padding: '8px',
        }}
      >
        <div className="flex flex-col h-full justify-between gap-1">
          <div className="flex items-center justify-between">
            <Typography
              style={{
                color: isPreviewImage ? 'white' : 'black',
                fontSize: '9px',
                border: '1px solid #0000001A',
                padding: '2px 4px',
                borderRadius: '15px',

                display: 'inline-block',
              }}
              variant="pi"
            >
              Sponsored{' '}
              <span
                style={{
                  backgroundColor: isPreviewImage ? 'white' : 'black',
                  color: isPreviewImage ? 'black' : 'white',
                  padding: '2px 3px',
                  borderRadius: '4px',
                  fontSize: '7px',
                }}
              >
                AD
              </span>
            </Typography>
            <div
              style={{
                backgroundColor: 'black',
                aspectRatio: 1,
                borderRadius: '25%',
                padding: '4px',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Arrow stroke="#fff" style={{ width: 10 }} />
            </div>
          </div>
          <div>
            <p
              className="z-20 px-6 pb-4"
              style={{
                fontSize: '12px',
                color: isPreviewImage ? 'white' : 'black',
                marginTop: 2,
                wordWrap: 'break-word',
              }}
            >
              {truncate(title, 60)}
            </p>
            <p
              style={{
                fontSize: '8px',
                color: isPreviewImage ? '#ffffffB3' : '000000B3',
                marginTop: '4px',
                wordWrap: 'break-word',
              }}
            >
              {truncate(description, 150)}
            </p>
            <div
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '6px 8px ',
                borderRadius: '24px',
                border: isPreviewImage ? '1px solid #ffffffB3' : '1px solid #000000B3',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '9px',
                color: isPreviewImage ? '#ffffffB3' : '#000000B3',
              }}
            >
              {ctaName}
              <span style={{ marginLeft: '8px' }}>
                <Arrow rotateArrow={true} stroke="#fff" style={{ width: 10 }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HomeCarouselPreview = ({ imageSrc, aspectRatio, title, description, isPreviewImage }) => (
  <div
    style={{ marginTop: '40px' }}
    className="z-10 flex items-start justify-center absolute inset-0 py-20 "
  >
    <div
      style={{
        width: 'calc(100% - 2rem)',
        maxHeight: '100%',
        backgroundColor: '#ffffff',
      }}
      className="relative flex items-end  rounded-xl overflow-hidden gap-1"
    >
      <img
        src={imageSrc}
        className="  object-cover rounded-xl"
        style={{ aspectRatio: 0.9 }}
        crossOrigin="anonymous"
      />
      {isPreviewImage && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            maskImage: 'linear-gradient(transparent, black, black)',
            width: '100%',
            height: '60%',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.5))',
            backdropFilter: 'blur(21px)',
            zIndex: 0,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          padding: '8px',
        }}
      >
        <div className="flex flex-col justify-end h-full ">
          <div>
            <div className="flex items-start justify-between gap-2" style={{ marginBottom: 6 }}>
              <p
                className="z-20 px-6 pb-4"
                style={{
                  fontSize: '15px',
                  color: isPreviewImage ? 'white' : 'black',
                  marginTop: 2,
                  wordWrap: 'break-word',
                  width: '80%',
                }}
              >
                {truncate(title, 30)}
              </p>
              <div
                style={{
                  backgroundColor: isPreviewImage ? 'transparent' : 'black',
                  aspectRatio: 1,
                  borderRadius: '25%',
                  border: isPreviewImage ? '1px solid #ffffff1A' : 'none',
                  padding: '4px',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 'auto',
                }}
              >
                <Arrow stroke="#fff" style={{ width: 10 }} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-1">
              <p
                style={{
                  fontSize: '8px',
                  color: isPreviewImage ? '#ffffffB3' : '000000B3',
                }}
              >
                {truncate(description, 15)}
              </p>
              <Typography
                style={{
                  color: isPreviewImage ? 'white' : 'black',
                  fontSize: '9px',
                  border: '1px solid #0000001A',
                  padding: '2px 4px',
                  borderRadius: '15px',

                  display: 'inline-block',
                  flexShrink: 0,
                }}
                variant="pi"
              >
                Sponsored{' '}
                <span
                  style={{
                    backgroundColor: isPreviewImage ? 'white' : 'black',
                    color: isPreviewImage ? 'black' : 'white',
                    padding: '2px 3px',
                    borderRadius: '4px',
                    fontSize: '7px',
                  }}
                >
                  AD
                </span>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const renderAdPreviewByType = ({
  adTypeId,
  imageSrc,
  aspectRatio,
  title,
  description,
  ctaName,
  isPreviewImage,
}) => {
  switch (adTypeId) {
    case 'listing-banner':
      return (
        <ListingBannerPreview
          imageSrc={imageSrc}
          aspectRatio={aspectRatio}
          title={title}
          description={description}
          isPreviewImage={isPreviewImage}
        />
      );
    case 'widget-banner':
      return (
        <WidgetBannerPreview
          imageSrc={imageSrc}
          title={title}
          description={description}
          isPreviewImage={isPreviewImage}
        />
      );

    case 'home-carousel':
      return (
        <HomeCarouselPreview
          imageSrc={imageSrc}
          description={description}
          title={title}
          isPreviewImage={isPreviewImage}
        />
      );

    case 'sticky-ad':
      return (
        <StickyAdPreview
          imageSrc={imageSrc}
          description={description}
          title={title}
          ctaName={ctaName}
          isPreviewImage={isPreviewImage}
        />
      );

    default:
      return null;
  }
};

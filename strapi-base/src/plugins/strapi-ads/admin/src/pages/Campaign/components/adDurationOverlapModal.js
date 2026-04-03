import { Box, Flex, Typography } from '@strapi/design-system';
import { format, parseISO } from 'date-fns';
import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';
import pluginId from '../../../pluginId';

export default function adDurationOverlapModal({
  isOpen,
  setIsOpen,
  onSubmit,
  data,
  disabled,
  campaign,
}) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      disabled={disabled}
      onSubmit={onSubmit}
      label="ad-duration-overlap-modal"
      endActionOkayLabel
    >
      <Flex direction="column">
        <Typography
          style={{
            marginBottom: '0.5rem',
            fontWeight: 700,
            fontSize: '22px',
            lineHeight: '22px',
          }}
        >
          {data?.conflicts?.length} Ad {data?.conflicts?.length === 1 ? 'Overlap' : 'Overlaps'}{' '}
          found
        </Typography>
        <Typography
          style={{ fontSize: '16px', marginBottom: '0.5rem', lineHeight: '20px', fontWeight: 400 }}
        >
          Already an ad running for the same "AD Spot" during <br /> the date range provided. <br />
          Please refer to the timeline view to adjust the dates.
        </Typography>
        {data?.conflicts?.map((conflict, index) => {
          const screenTitles =
            conflict?.adLocal?.ad_screens && conflict?.adLocal?.ad_screens.length > 0
              ? conflict?.adLocal?.ad_screens.map((screen) => screen.ad_screen_title).join(', ')
              : '';
          return (
            <Box key={index} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <Typography
                style={{
                  fontSize: '16px',
                  marginBottom: '0.5rem',
                  lineHeight: '20px',
                  fontWeight: 700,
                }}
              >
                Overlap{data?.conflicts?.length > 1 ? ` ${index + 1}` : ''} :
              </Typography>
              <Box>
                <Typography
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: 700,
                    display: 'block',
                    marginTop: '10px',
                    marginBottom: '5px',
                    textDecoration: 'underline',
                  }}
                >
                  Existing Ad
                </Typography>
                <Typography style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}>
                  Campaign Name : {campaign?.campaign_name}
                </Typography>
                <br />
                <Typography style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}>
                  Ad Name : {conflict?.adLocal?.ad_name}
                </Typography>
                <Box>
                  <Typography
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontWeight: 400,
                    }}
                  >
                    {conflict?.adLocal?.ad_type?.title &&
                      `Ad type: ${conflict?.adLocal?.ad_type?.title}`}{' '}
                    : {conflict?.adLocal?.ad_spot?.ad_spot_display_text}{' '}
                    {screenTitles ? ` : ${screenTitles}` : ''}
                  </Typography>
                  <br />
                  <Typography
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontWeight: 400,
                    }}
                  >
                    Duration :{format(parseISO(conflict?.adLocal?.ad_start_date), 'dd/MM/yyyy')}-{' '}
                    {conflict?.adLocal?.ad_end_date
                      ? format(parseISO(conflict?.adLocal?.ad_end_date), 'dd/MM/yyyy')
                      : 'Ongoing'}
                  </Typography>
                </Box>
              </Box>
              {conflict?.remoteConflicts?.map((remoteConflict, remoteIndex) => {
                const screenTitles =
                  remoteConflict?.adRemote?.ad_screens &&
                  remoteConflict?.adRemote?.ad_screens.length > 0
                    ? remoteConflict?.adRemote?.ad_screens
                        .map((screen) => screen.ad_screen_title)
                        .join(', ')
                    : '';
                return (
                  <Box key={remoteIndex} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <Typography
                      style={{
                        fontSize: '14px',
                        lineHeight: '20px',
                        fontWeight: 700,
                        display: 'block',
                        marginTop: '10px',
                        marginBottom: '5px',
                        textDecoration: 'underline',
                      }}
                    >
                      Conflicting Ad{conflict?.remoteConflicts?.length > 1 ? ` ${remoteIndex + 1}` : ''}
                    </Typography>
                    <Typography style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}>
                      Campaign Name :{' '}
                      {remoteConflict?.adRemote?.campaign?.id &&
                      remoteConflict?.adRemote?.campaign?.id !== campaign?.id ? (
                        <a
                          href={`/admin/plugins/${pluginId}/campaigns/edit/${remoteConflict?.adRemote?.campaign?.id}?ad=${remoteConflict?.adRemote?.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#4945FF',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {remoteConflict?.adRemote?.campaign?.campaign_name}
                        </a>
                      ) : (
                        remoteConflict?.adRemote?.campaign?.campaign_name
                      )}
                    </Typography>
                    <br />
                    <Typography style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400 }}>
                      Ad Name : {remoteConflict?.adRemote?.ad_name}
                    </Typography>
                    <Box>
                      <Typography
                        style={{
                          fontSize: '14px',
                          lineHeight: '20px',
                          fontWeight: 400,
                        }}
                      >
                        {remoteConflict?.adRemote?.ad_type?.title &&
                          `Ad type: ${remoteConflict?.adRemote?.ad_type?.title}`}{' '}
                        : {remoteConflict?.adRemote?.ad_spot?.ad_spot_display_text}{' '}
                        {screenTitles ? ` : ${screenTitles}` : ''}
                      </Typography>
                      <br />
                      <Typography
                        style={{
                          fontSize: '14px',
                          lineHeight: '20px',
                          fontWeight: 400,
                        }}
                      >
                        Duration :
                        {format(parseISO(remoteConflict?.adRemote?.ad_start_date), 'dd/MM/yyyy')}-{' '}
                        {remoteConflict?.adRemote?.ad_end_date
                          ? format(parseISO(remoteConflict?.adRemote?.ad_end_date), 'dd/MM/yyyy')
                          : 'Ongoing'}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Flex>
    </CustomModal>
  );
}

//  <>
//             <Typography style={{ fontSize: '16px', lineHeight: '20px', fontWeight: 400 }}>
//               Campaign Name :{' '}
//               {singleItem?.campaign?.id ? (
//                 <a
//                   href={`/admin/plugins/${pluginId}/campaigns/edit/${singleItem?.campaign?.id}?ad=${singleItem?.id}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     color: '#4945FF',
//                     cursor: 'pointer',
//                     textDecoration: 'underline',
//                   }}
//                 >
//                   {singleItem?.campaign?.campaign_name}
//                 </a>
//               ) : (
//                 singleItem?.campaign?.campaign_name
//               )}
//             </Typography>
//             <Typography style={{ fontSize: '16px', lineHeight: '20px', fontWeight: 400 }}>
//               Ad Name : {singleItem?.ad_name}
//             </Typography>
//             <Box>
//               <Typography
//                 style={{
//                   fontSize: '16px',
//                   lineHeight: '20px',
//                   fontWeight: 400,
//                 }}
//               >
//                 {singleItem?.ad_type?.title && `Ad type: ${singleItem?.ad_type?.title}`} :{' '}
//                 {singleItem?.ad_spot?.ad_spot_display_text}{' '}
//                 {screenTitles ? ` : ${screenTitles}` : ''}
//               </Typography>
//               <br />
//               <Typography
//                 style={{
//                   fontSize: '16px',
//                   lineHeight: '20px',
//                   fontWeight: 400,
//                 }}
//               >
//                 Duration :{format(parseISO(singleItem?.ad_start_date), 'dd/MM/yyyy')}-{' '}
//                 {singleItem?.ad_end_date
//                   ? format(parseISO(singleItem?.ad_end_date), 'dd/MM/yyyy')
//                   : 'Ongoing'}
//               </Typography>
//             </Box>
//           </>

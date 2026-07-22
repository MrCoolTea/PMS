import { Box, Link, Stack, Typography } from '@mui/material';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { useResort } from '../../context/ResortContext.jsx';
import { usePublicDesign } from '../../context/PublicDesignContext.jsx';

const socialIcons = {
  Facebook: FacebookRoundedIcon,
  Instagram: InstagramIcon,
  TikTok: MusicNoteRoundedIcon,
};

export function PublicFooter() {
  const { data } = useResort();
  const { currentDesign } = usePublicDesign();
  const content = data.siteContent ?? {};
  const socials = data.socialMedia.filter((account) =>
    ['Facebook', 'Instagram', 'TikTok'].includes(account.platform)
  );

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        px: { xs: 2, md: 4 },
        pt: 3.5,
        pb: 4,
        position: 'relative',
        zIndex: 1,
        background: currentDesign.footerBackground,
      }}
    >
      <Box sx={{ maxWidth: 1740, mx: 'auto', color: currentDesign.footerText }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            gap: 2.25,
          }}
        >
          <Box sx={{ py: 0.5 }}>
            <Typography sx={{ fontWeight: 700, color: currentDesign.footerText }}>Get in Touch</Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <Link
                href={`tel:${content.phone ?? data.resort.phone}`}
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: currentDesign.footerText, textDecoration: 'none' }}
                underline="none"
              >
                <CallRoundedIcon fontSize="small" />
                {content.phone ?? data.resort.phone}
              </Link>
              <Link
                href={`mailto:${content.email ?? data.resort.email}`}
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: currentDesign.footerText, textDecoration: 'none' }}
                underline="none"
              >
                <EmailRoundedIcon fontSize="small" />
                {content.email ?? data.resort.email}
              </Link>
            </Stack>
          </Box>

          <Box sx={{ py: 0.5 }}>
            <Typography sx={{ fontWeight: 700, color: currentDesign.footerText }}>Location</Typography>
            <Stack direction="row" spacing={1.25} sx={{ mt: 2 }} alignItems="flex-start">
              <PlaceRoundedIcon fontSize="small" sx={{ mt: '2px' }} />
              <Typography sx={{ color: currentDesign.footerText, opacity: 0.78 }}>
                {content.name ?? data.resort.name}
                <br />
                {content.location ?? data.resort.location}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ py: 0.5 }}>
            <Typography sx={{ fontWeight: 700, color: currentDesign.footerText }}>About Us</Typography>
            <Typography sx={{ mt: 2, color: currentDesign.footerText, opacity: 0.78 }}>
              {content.footerAbout ??
                `${data.resort.name} is a coastal stay in ${data.resort.location}, offering comfortable rooms, local experiences, and direct booking for guests planning their beach getaway.`}
            </Typography>
          </Box>

          <Box sx={{ py: 0.5 }}>
            <Typography sx={{ fontWeight: 700, color: currentDesign.footerText }}>Socials</Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {socials.map((account) => {
                const Icon = socialIcons[account.platform] ?? MusicNoteRoundedIcon;

                return (
                  <Link
                    key={account.id}
                    href={account.url}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: currentDesign.footerText, textDecoration: 'none' }}
                    underline="none"
                  >
                    <Icon fontSize="small" />
                    {account.platform}
                  </Link>
                );
              })}
            </Stack>
          </Box>
        </Box>

        <Typography
          sx={{
            mt: 3,
            pt: 2.5,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            color: currentDesign.footerText,
            opacity: 0.76,
          }}
        >
          {content.footerCopyright ??
            `© 2026 ${data.resort.name}. Beach stays and direct bookings in Tondol, Anda, Pangasinan.`}
        </Typography>
      </Box>
    </Box>
  );
}

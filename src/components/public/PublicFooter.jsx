import { Box, Link, Stack, Typography } from '@mui/material';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { useResort } from '../../context/ResortContext.jsx';
import { ui } from '../../styles/ui.js';

const socialIcons = {
  Facebook: FacebookRoundedIcon,
  Instagram: InstagramIcon,
  TikTok: MusicNoteRoundedIcon,
};

export function PublicFooter() {
  const { data } = useResort();
  const socials = data.socialMedia.filter((account) =>
    ['Facebook', 'Instagram', 'TikTok'].includes(account.platform)
  );

  return (
    <Box component="footer" sx={ui.siteFooter}>
      <Box sx={ui.siteFooterInner}>
        <Box sx={ui.siteFooterGrid}>
          <Box sx={ui.siteFooterCard}>
            <Typography sx={ui.siteFooterHeading}>Get in Touch</Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <Link href={`tel:${data.resort.phone}`} sx={ui.footerLink} underline="none">
                <CallRoundedIcon fontSize="small" />
                {data.resort.phone}
              </Link>
              <Link href={`mailto:${data.resort.email}`} sx={ui.footerLink} underline="none">
                <EmailRoundedIcon fontSize="small" />
                {data.resort.email}
              </Link>
            </Stack>
          </Box>

          <Box sx={ui.siteFooterCard}>
            <Typography sx={ui.siteFooterHeading}>Location</Typography>
            <Stack direction="row" spacing={1.25} sx={{ mt: 2 }} alignItems="flex-start">
              <PlaceRoundedIcon fontSize="small" sx={ui.footerIconTop} />
              <Typography sx={ui.siteFooterCopy}>
                {data.resort.name}
                <br />
                {data.resort.location}
              </Typography>
            </Stack>
          </Box>

          <Box sx={ui.siteFooterCard}>
            <Typography sx={ui.siteFooterHeading}>About Us</Typography>
            <Typography sx={{ ...ui.siteFooterCopy, mt: 2 }}>
              {data.resort.name} is a coastal stay in {data.resort.location}, offering
              comfortable rooms, local experiences, and direct booking for guests planning
              their beach getaway.
            </Typography>
          </Box>

          <Box sx={ui.siteFooterCard}>
            <Typography sx={ui.siteFooterHeading}>Socials</Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {socials.map((account) => {
                const Icon = socialIcons[account.platform] ?? MusicNoteRoundedIcon;

                return (
                  <Link
                    key={account.id}
                    href={account.url}
                    target="_blank"
                    rel="noreferrer"
                    sx={ui.footerLink}
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

        <Typography sx={ui.siteFooterNote}>
          © 2026 {data.resort.name}. Beach stays and direct bookings in Tondol, Anda,
          Pangasinan.
        </Typography>
      </Box>
    </Box>
  );
}

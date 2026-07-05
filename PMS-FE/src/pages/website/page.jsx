import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import { getSiteContent, updateSiteContent } from '../../lib/site.js';
import { ui } from '../../styles/ui.js';

const emptyContent = {
  name: '',
  location: '',
  phone: '',
  email: '',
  tagline: '',
  homeEyebrow: '',
  homeHeadline: '',
  homeCopy: '',
  experiencesEyebrow: '',
  experiencesHeadline: '',
  experiencesCopy: '',
  bookingEyebrow: '',
  bookingHeadline: '',
  bookingCopy: '',
  footerAbout: '',
  footerCopyright: '',
};

function toEditableContent(content) {
  return {
    name: content.name ?? '',
    location: content.location ?? '',
    phone: content.phone ?? '',
    email: content.email ?? '',
    tagline: content.tagline ?? '',
    homeEyebrow: content.homeEyebrow ?? '',
    homeHeadline: content.homeHeadline ?? '',
    homeCopy: content.homeCopy ?? '',
    experiencesEyebrow: content.experiencesEyebrow ?? '',
    experiencesHeadline: content.experiencesHeadline ?? '',
    experiencesCopy: content.experiencesCopy ?? '',
    bookingEyebrow: content.bookingEyebrow ?? '',
    bookingHeadline: content.bookingHeadline ?? '',
    bookingCopy: content.bookingCopy ?? '',
    footerAbout: content.footerAbout ?? '',
    footerCopyright: content.footerCopyright ?? '',
  };
}

export function WebsitePage() {
  const { accessToken } = useAuth();
  const [form, setForm] = useState(emptyContent);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const content = await getSiteContent(accessToken);
        if (active) setForm(toEditableContent(content));
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    }

    loadContent();
    return () => {
      active = false;
    };
  }, [accessToken]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');
      setSaved('');
      const updated = await updateSiteContent(accessToken, toEditableContent(form));
      setForm(toEditableContent(updated));
      setSaved('Website content saved.');
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Website</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Public page content and resort presentation
        </Typography>
        <Typography sx={ui.heroCopy}>
          Control what guests see on the public website, including hero copy, contact details, and footer messaging.
        </Typography>
      </Paper>

      <Paper sx={ui.contentPanel} elevation={0}>
        <Typography variant="h5" sx={ui.panelTitle}>Public Site Content</Typography>
        {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}
        {saved ? <Alert severity="success" sx={{ mt: 2.5 }}>{saved}</Alert> : null}
        <Stack component="form" spacing={2} sx={{ mt: 2.5, maxWidth: 840 }} onSubmit={handleSubmit}>
          <TextField label="Resort Name" name="name" value={form.name} onChange={handleChange} />
          <TextField label="Location" name="location" value={form.location} onChange={handleChange} />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} />
          <TextField label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
          <TextField label="Home Eyebrow" name="homeEyebrow" value={form.homeEyebrow} onChange={handleChange} />
          <TextField label="Home Headline" name="homeHeadline" value={form.homeHeadline} onChange={handleChange} />
          <TextField label="Home Copy" name="homeCopy" value={form.homeCopy} onChange={handleChange} multiline minRows={3} />
          <TextField label="Experiences Eyebrow" name="experiencesEyebrow" value={form.experiencesEyebrow} onChange={handleChange} />
          <TextField label="Experiences Headline" name="experiencesHeadline" value={form.experiencesHeadline} onChange={handleChange} />
          <TextField label="Experiences Copy" name="experiencesCopy" value={form.experiencesCopy} onChange={handleChange} multiline minRows={3} />
          <TextField label="Booking Eyebrow" name="bookingEyebrow" value={form.bookingEyebrow} onChange={handleChange} />
          <TextField label="Booking Headline" name="bookingHeadline" value={form.bookingHeadline} onChange={handleChange} />
          <TextField label="Booking Copy" name="bookingCopy" value={form.bookingCopy} onChange={handleChange} multiline minRows={3} />
          <TextField label="Footer About" name="footerAbout" value={form.footerAbout} onChange={handleChange} multiline minRows={4} />
          <TextField label="Footer Copyright" name="footerCopyright" value={form.footerCopyright} onChange={handleChange} />
          <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Save Website Content</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

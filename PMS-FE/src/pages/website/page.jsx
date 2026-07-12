import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { publicDesignModes } from '../../context/PublicDesignContext.jsx';
import {
  getSiteContent,
  getSiteSettings,
  updateSiteContent,
  updateSiteSettings,
} from '../../lib/site.js';
import { ui } from '../../styles/ui.js';

const emptyContent = {
  name: '',
  logoUrl: '',
  location: '',
  phone: '',
  email: '',
  tagline: '',
  homeEyebrow: '',
  homeHeadline: '',
  homeCopy: '',
  heroImageUrl: '',
  experiencesEyebrow: '',
  experiencesHeadline: '',
  experiencesCopy: '',
  bookingEyebrow: '',
  bookingHeadline: '',
  bookingCopy: '',
  footerAbout: '',
  footerCopyright: '',
};

const emptySettings = {
  publicTheme: 'lagoon',
};

function toEditableContent(content) {
  return {
    name: content.name ?? '',
    logoUrl: content.logoUrl ?? '',
    location: content.location ?? '',
    phone: content.phone ?? '',
    email: content.email ?? '',
    tagline: content.tagline ?? '',
    homeEyebrow: content.homeEyebrow ?? '',
    homeHeadline: content.homeHeadline ?? '',
    homeCopy: content.homeCopy ?? '',
    heroImageUrl: content.heroImageUrl ?? '',
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
  const [settings, setSettings] = useState(emptySettings);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState('/');

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const [content, nextSettings] = await Promise.all([
          getSiteContent(accessToken),
          getSiteSettings(accessToken),
        ]);
        if (!active) {
          return;
        }
        setForm(toEditableContent(content));
        setSettings({
          publicTheme: nextSettings.publicTheme ?? 'lagoon',
        });
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

  function handleThemeSelect(themeId) {
    setSettings((current) => ({ ...current, publicTheme: themeId }));
  }

  function handleImageChange(fieldName) {
    return async (event) => {
      const [file] = event.target.files ?? [];
      event.target.value = '';

      if (!file) {
        return;
      }

      try {
        const value = await readFileAsDataUrl(file);
        setForm((current) => ({ ...current, [fieldName]: value }));
      } catch {
        setError(`Unable to read ${fieldName === 'logoUrl' ? 'logo' : 'hero image'} file.`);
      }
    };
  }

  function handleImageClear(fieldName) {
    setForm((current) => ({ ...current, [fieldName]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');
      setSaved('');
      const [updated] = await Promise.all([
        updateSiteContent(accessToken, toEditableContent(form)),
        updateSiteSettings(accessToken, settings),
      ]);
      setForm(toEditableContent(updated));
      setSaved('Website content and design saved.');
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  const previewUrl = `${previewPath}?previewDesign=${encodeURIComponent(settings.publicTheme)}`;

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
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid rgba(20, 55, 44, 0.08)',
              backgroundColor: '#f7fbf8',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography sx={ui.panelTitle}>Public Design Mode</Typography>
                <Typography sx={ui.panelCopy}>
                  Choose the default visual system for the public website. The preview uses the actual public pages.
                </Typography>
              </Box>
              <Button
                type="button"
                variant="outlined"
                startIcon={<VisibilityRoundedIcon />}
                onClick={() => setPreviewOpen(true)}
              >
                Preview Theme
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
              {publicDesignModes.map((theme) => (
                <Chip
                  key={theme.id}
                  label={theme.label}
                  onClick={() => handleThemeSelect(theme.id)}
                  color={settings.publicTheme === theme.id ? 'primary' : 'default'}
                  variant={settings.publicTheme === theme.id ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 700 }}
                />
              ))}
            </Stack>
          </Paper>
          <TextField label="Resort Name" name="name" value={form.name} onChange={handleChange} />
          <TextField
            label="Business Logo URL"
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            helperText="Paste an image URL or upload a logo below."
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button component="label" variant="outlined">
              Upload Logo
              <input hidden accept="image/*" type="file" onChange={handleImageChange('logoUrl')} />
            </Button>
            <Button variant="text" color="inherit" onClick={() => handleImageClear('logoUrl')}>
              Clear Logo
            </Button>
          </Stack>
          {form.logoUrl ? (
            <Box
              component="img"
              src={form.logoUrl}
              alt="Business logo preview"
              sx={{
                width: 128,
                height: 128,
                objectFit: 'contain',
                borderRadius: 2,
                border: '1px solid rgba(20, 55, 44, 0.12)',
                p: 1,
                backgroundColor: '#fff',
              }}
            />
          ) : null}
          <TextField label="Location" name="location" value={form.location} onChange={handleChange} />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} />
          <TextField label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
          <TextField label="Home Eyebrow" name="homeEyebrow" value={form.homeEyebrow} onChange={handleChange} />
          <TextField label="Home Headline" name="homeHeadline" value={form.homeHeadline} onChange={handleChange} />
          <TextField label="Home Copy" name="homeCopy" value={form.homeCopy} onChange={handleChange} multiline minRows={3} />
          <TextField
            label="Homepage Hero Image URL"
            name="heroImageUrl"
            value={form.heroImageUrl}
            onChange={handleChange}
            helperText="Used as the main public homepage image."
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button component="label" variant="outlined">
              Upload Hero Image
              <input hidden accept="image/*" type="file" onChange={handleImageChange('heroImageUrl')} />
            </Button>
            <Button variant="text" color="inherit" onClick={() => handleImageClear('heroImageUrl')}>
              Clear Hero Image
            </Button>
          </Stack>
          {form.heroImageUrl ? (
            <Box
              component="img"
              src={form.heroImageUrl}
              alt="Homepage hero preview"
              sx={{
                width: '100%',
                maxWidth: 520,
                height: 220,
                objectFit: 'cover',
                borderRadius: 3,
                border: '1px solid rgba(20, 55, 44, 0.12)',
              }}
            />
          ) : null}
          <TextField label="Experiences Eyebrow" name="experiencesEyebrow" value={form.experiencesEyebrow} onChange={handleChange} />
          <TextField label="Experiences Headline" name="experiencesHeadline" value={form.experiencesHeadline} onChange={handleChange} />
          <TextField label="Experiences Copy" name="experiencesCopy" value={form.experiencesCopy} onChange={handleChange} multiline minRows={3} />
          <TextField label="Booking Eyebrow" name="bookingEyebrow" value={form.bookingEyebrow} onChange={handleChange} />
          <TextField label="Booking Headline" name="bookingHeadline" value={form.bookingHeadline} onChange={handleChange} />
          <TextField label="Booking Copy" name="bookingCopy" value={form.bookingCopy} onChange={handleChange} multiline minRows={3} />
          <TextField label="Footer About" name="footerAbout" value={form.footerAbout} onChange={handleChange} multiline minRows={4} />
          <TextField label="Footer Copyright" name="footerCopyright" value={form.footerCopyright} onChange={handleChange} />
          <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
            Save Website Content & Design
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>Public Website Preview</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Tabs
                value={previewPath}
                onChange={(_, nextValue) => setPreviewPath(nextValue)}
                variant="scrollable"
                allowScrollButtonsMobile
              >
                <Tab value="/" label="Home" />
                <Tab value="/experiences" label="Experiences" />
                <Tab value="/book" label="Booking" />
              </Tabs>
              <Chip label={`Theme: ${publicDesignModes.find((item) => item.id === settings.publicTheme)?.label ?? settings.publicTheme}`} />
            </Stack>

            <Box
              sx={{
                width: '100%',
                height: { xs: 520, md: 720 },
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid rgba(20, 55, 44, 0.12)',
                backgroundColor: '#fff',
              }}
            >
              <Box
                component="iframe"
                title="Public website preview"
                src={previewUrl}
                sx={{
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Unable to read file.'));
    reader.readAsDataURL(file);
  });
}

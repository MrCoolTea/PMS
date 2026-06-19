import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import { ui } from '../../styles/ui.js';

const socialPlatforms = ['Facebook', 'Instagram', 'Twitter', 'Threads', 'TikTok'];

function connectionColor(status) {
  if (status === 'Ready') return 'success';
  if (status === 'Needs Auth') return 'warning';
  return 'default';
}

function postColor(status) {
  if (status === 'Scheduled') return 'success';
  if (status === 'Draft') return 'warning';
  return 'default';
}

export function MarketingPage() {
  const { data, addPost } = useResort();
  const [form, setForm] = useState({
    title: '',
    caption: '',
    cta: '',
    mediaUrl: '',
    publishAt: '',
    platforms: ['Facebook', 'Instagram'],
  });

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function togglePlatform(platform) {
    setForm((current) => ({
      ...current,
      platforms: current.platforms.includes(platform)
        ? current.platforms.filter((item) => item !== platform)
        : [...current.platforms, platform],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addPost({
      ...form,
      platforms: form.platforms.length ? form.platforms : ['Facebook'],
      status: form.publishAt ? 'Scheduled' : 'Draft',
    });
    setForm({
      title: '',
      caption: '',
      cta: '',
      mediaUrl: '',
      publishAt: '',
      platforms: ['Facebook', 'Instagram'],
    });
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Marketing</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Social post creation and publishing connections
        </Typography>
        <Typography sx={ui.heroCopy}>
          Draft campaigns, prepare visual posts, and keep publishing connections ready
          for Facebook, Instagram, Twitter, Threads, and TikTok.
        </Typography>
      </Paper>

      <Box sx={ui.dashboardGrid(true)}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Create Post
          </Typography>
          <Typography sx={{ ...ui.panelCopy, mt: 0.5 }}>
            Build one caption and push it to selected social channels when the backend
            publishing flow is wired.
          </Typography>

          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField label="Post Title" name="title" value={form.title} onChange={handleChange} />
            <TextField
              label="Caption"
              name="caption"
              value={form.caption}
              onChange={handleChange}
              multiline
              minRows={4}
            />
            <TextField label="Call to Action" name="cta" value={form.cta} onChange={handleChange} />
            <TextField
              label="Media URL"
              name="mediaUrl"
              value={form.mediaUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
            <TextField
              label="Publish Date & Time"
              name="publishAt"
              type="datetime-local"
              value={form.publishAt}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <Stack spacing={1}>
              <Typography sx={ui.sidebarSection}>Select Platforms</Typography>
              <Box sx={ui.platformChipGroup}>
                {socialPlatforms.map((platform) => {
                  const selected = form.platforms.includes(platform);

                  return (
                    <Button
                      key={platform}
                      type="button"
                      variant={selected ? 'contained' : 'outlined'}
                      onClick={() => togglePlatform(platform)}
                      sx={ui.platformChipButton}
                    >
                      {platform}
                    </Button>
                  );
                })}
              </Box>
            </Stack>

            <Button type="submit" variant="contained">
              Save Post
            </Button>
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Connection Module
          </Typography>
          <Typography sx={{ ...ui.panelCopy, mt: 0.5 }}>
            Channel readiness for social publishing and account linking.
          </Typography>

          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.socialMedia.map((account) => (
              <Box key={account.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{account.platform}</Typography>
                  <Typography sx={ui.rowCopy}>
                    {account.accountName ?? account.handle}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {account.sync} • {account.audience}
                  </Typography>
                </Box>
                <Chip
                  label={account.status}
                  color={connectionColor(account.status)}
                  variant={account.status === 'Ready' ? 'filled' : 'outlined'}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      <Paper sx={ui.contentPanel} elevation={0}>
        <Typography variant="h5" sx={ui.panelTitle}>
          Post Queue
        </Typography>
        <Typography sx={{ ...ui.panelCopy, mt: 0.5 }}>
          Saved drafts and scheduled posts prepared for social publishing.
        </Typography>

        <Box sx={{ ...ui.marketingPostGrid, mt: 2.5 }}>
          {(data.posts ?? []).map((post) => (
            <Box key={post.id} sx={{ ...ui.recordCard, ...ui.marketingPostCard }}>
              <Stack spacing={1.25}>
                <Box>
                  <Typography sx={ui.rowTitle}>{post.title}</Typography>
                  <Typography sx={ui.rowCopy}>{post.caption}</Typography>
                </Box>
                <Typography sx={ui.rowCopy}>
                  {post.cta ? `CTA: ${post.cta}` : 'No CTA set'}
                </Typography>
                <Typography sx={ui.rowCopy}>
                  {post.publishAt ? `Publish: ${post.publishAt}` : 'Draft only'}
                </Typography>
                <Box sx={ui.platformTagRow}>
                  {post.platforms.map((platform) => (
                    <Chip key={`${post.id}-${platform}`} label={platform} size="small" variant="outlined" />
                  ))}
                </Box>
              </Stack>
              <Chip label={post.status} color={postColor(post.status)} />
            </Box>
          ))}
        </Box>
      </Paper>
    </Stack>
  );
}

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  createPost,
  createSocialAccount,
  deletePost,
  deleteSocialAccount,
  listPosts,
  listSocialAccounts,
  updatePost,
  updateSocialAccount,
} from '../../lib/marketing.js';
import { ui } from '../../styles/ui.js';

const socialPlatforms = ['Facebook', 'Instagram', 'Twitter', 'Threads', 'TikTok'];
const statusOptions = ['Ready', 'Needs Auth', 'Paused'];
const postStatusOptions = ['Draft', 'Scheduled', 'Published'];

const emptyAccountForm = {
  platform: 'Facebook',
  handle: '',
  url: '',
  accountName: '',
  sync: 'Ready to publish',
  audience: '',
  status: 'Ready',
};

const emptyPostForm = {
  title: '',
  caption: '',
  cta: '',
  mediaUrl: '',
  publishAt: '',
  status: 'Draft',
  platforms: ['Facebook', 'Instagram'],
};

function connectionColor(status) {
  if (status === 'Ready') return 'success';
  if (status === 'Needs Auth') return 'warning';
  return 'default';
}

function postColor(status) {
  if (status === 'Published') return 'success';
  if (status === 'Scheduled') return 'warning';
  return 'default';
}

export function MarketingPage() {
  const { accessToken } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [accountForm, setAccountForm] = useState(emptyAccountForm);
  const [postForm, setPostForm] = useState(emptyPostForm);

  useEffect(() => {
    let active = true;

    async function loadMarketing() {
      try {
        setLoading(true);
        setError('');
        const [nextAccounts, nextPosts] = await Promise.all([
          listSocialAccounts(accessToken),
          listPosts(accessToken),
        ]);

        if (active) {
          setAccounts(nextAccounts);
          setPosts(nextPosts);
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMarketing();
    return () => {
      active = false;
    };
  }, [accessToken]);

  function handleAccountChange(event) {
    setAccountForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handlePostChange(event) {
    setPostForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function togglePlatform(platform) {
    setPostForm((current) => ({
      ...current,
      platforms: current.platforms.includes(platform)
        ? current.platforms.filter((item) => item !== platform)
        : [...current.platforms, platform],
    }));
  }

  function editAccount(account) {
    setSelectedAccountId(account.id);
    setAccountForm({
      platform: account.platform ?? 'Facebook',
      handle: account.handle ?? '',
      url: account.url ?? '',
      accountName: account.accountName ?? '',
      sync: account.sync ?? 'Ready to publish',
      audience: account.audience ?? '',
      status: account.status ?? 'Ready',
    });
  }

  function editPost(post) {
    setSelectedPostId(post.id);
    setPostForm({
      title: post.title ?? '',
      caption: post.caption ?? '',
      cta: post.cta ?? '',
      mediaUrl: post.mediaUrl ?? '',
      publishAt: post.publishAt ?? '',
      status: post.status ?? 'Draft',
      platforms: post.platforms ?? ['Facebook'],
    });
  }

  function resetAccountForm() {
    setSelectedAccountId(null);
    setAccountForm(emptyAccountForm);
  }

  function resetPostForm() {
    setSelectedPostId(null);
    setPostForm(emptyPostForm);
  }

  async function submitAccount(event) {
    event.preventDefault();
    const payload = {
      platform: accountForm.platform,
      handle: accountForm.handle.trim(),
      url: accountForm.url.trim(),
      accountName: accountForm.accountName.trim(),
      sync: accountForm.sync.trim(),
      audience: accountForm.audience.trim(),
      status: accountForm.status,
    };

    try {
      setError('');
      if (selectedAccountId) {
        const updated = await updateSocialAccount(accessToken, selectedAccountId, payload);
        setAccounts((current) =>
          current.map((account) => (account.id === updated.id ? updated : account))
        );
      } else {
        const created = await createSocialAccount(accessToken, payload);
        setAccounts((current) => [created, ...current]);
      }
      resetAccountForm();
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  async function submitPost(event) {
    event.preventDefault();
    const payload = {
      title: postForm.title.trim(),
      caption: postForm.caption.trim(),
      cta: postForm.cta.trim(),
      mediaUrl: postForm.mediaUrl.trim(),
      publishAt: postForm.publishAt,
      status: postForm.status,
      platforms: postForm.platforms.length ? postForm.platforms : ['Facebook'],
    };

    try {
      setError('');
      if (selectedPostId) {
        const updated = await updatePost(accessToken, selectedPostId, payload);
        setPosts((current) => current.map((post) => (post.id === updated.id ? updated : post)));
      } else {
        const created = await createPost(accessToken, payload);
        setPosts((current) => [created, ...current]);
      }
      resetPostForm();
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  async function removeAccount(id) {
    try {
      setError('');
      await deleteSocialAccount(accessToken, id);
      setAccounts((current) => current.filter((account) => account.id !== id));
      if (selectedAccountId === id) resetAccountForm();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  async function removePost(id) {
    try {
      setError('');
      await deletePost(accessToken, id);
      setPosts((current) => current.filter((post) => post.id !== id));
      if (selectedPostId === id) resetPostForm();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Marketing</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Social post creation and publishing connections
        </Typography>
        <Typography sx={ui.heroCopy}>
          Manage channel links and the post queue from the backend instead of local demo data.
        </Typography>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CircularProgress size={24} />
          <Typography sx={ui.panelCopy}>Loading marketing data...</Typography>
        </Stack>
      ) : null}

      <Box sx={ui.dashboardGrid(true)}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            {selectedAccountId ? 'Edit Social Account' : 'Add Social Account'}
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={submitAccount}>
            <TextField select label="Platform" name="platform" value={accountForm.platform} onChange={handleAccountChange}>
              {socialPlatforms.map((platform) => <MenuItem key={platform} value={platform}>{platform}</MenuItem>)}
            </TextField>
            <TextField required label="Handle" name="handle" value={accountForm.handle} onChange={handleAccountChange} />
            <TextField required label="URL" name="url" value={accountForm.url} onChange={handleAccountChange} />
            <TextField label="Account Name" name="accountName" value={accountForm.accountName} onChange={handleAccountChange} />
            <TextField label="Sync Note" name="sync" value={accountForm.sync} onChange={handleAccountChange} />
            <TextField label="Audience" name="audience" value={accountForm.audience} onChange={handleAccountChange} />
            <TextField select label="Status" name="status" value={accountForm.status} onChange={handleAccountChange}>
              {statusOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <Stack direction="row" spacing={1.5}>
              <Button type="submit" variant="contained">{selectedAccountId ? 'Save Account' : 'Save Account'}</Button>
              {selectedAccountId ? <Button onClick={resetAccountForm}>Cancel</Button> : null}
            </Stack>
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>Connection Module</Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {accounts.map((account) => (
              <Box key={account.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{account.platform}</Typography>
                  <Typography sx={ui.rowCopy}>{account.accountName ?? account.handle}</Typography>
                  <Typography sx={ui.rowCopy}>{account.sync} • {account.audience}</Typography>
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Chip label={account.status} color={connectionColor(account.status)} />
                  <Button variant="outlined" onClick={() => editAccount(account)}>Edit</Button>
                  <Button variant="outlined" color="error" onClick={() => removeAccount(account.id)}>Delete</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      <Box sx={ui.dashboardGrid(true)}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            {selectedPostId ? 'Edit Post' : 'Create Post'}
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={submitPost}>
            <TextField required label="Post Title" name="title" value={postForm.title} onChange={handlePostChange} />
            <TextField required label="Caption" name="caption" value={postForm.caption} onChange={handlePostChange} multiline minRows={4} />
            <TextField label="Call to Action" name="cta" value={postForm.cta} onChange={handlePostChange} />
            <TextField label="Media URL" name="mediaUrl" value={postForm.mediaUrl} onChange={handlePostChange} />
            <TextField label="Publish Date & Time" name="publishAt" type="datetime-local" value={postForm.publishAt} onChange={handlePostChange} InputLabelProps={{ shrink: true }} />
            <TextField select label="Status" name="status" value={postForm.status} onChange={handlePostChange}>
              {postStatusOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <Stack spacing={1}>
              <Typography sx={ui.sidebarSection}>Select Platforms</Typography>
              <Box sx={ui.platformChipGroup}>
                {socialPlatforms.map((platform) => {
                  const selected = postForm.platforms.includes(platform);

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
            <Stack direction="row" spacing={1.5}>
              <Button type="submit" variant="contained">{selectedPostId ? 'Save Post' : 'Save Post'}</Button>
              {selectedPostId ? <Button onClick={resetPostForm}>Cancel</Button> : null}
            </Stack>
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>Post Queue</Typography>
          <Box sx={{ ...ui.marketingPostGrid, mt: 2.5 }}>
            {posts.map((post) => (
              <Box key={post.id} sx={{ ...ui.recordCard, ...ui.marketingPostCard }}>
                <Stack spacing={1.25}>
                  <Box>
                    <Typography sx={ui.rowTitle}>{post.title}</Typography>
                    <Typography sx={ui.rowCopy}>{post.caption}</Typography>
                  </Box>
                  <Typography sx={ui.rowCopy}>{post.cta ? `CTA: ${post.cta}` : 'No CTA set'}</Typography>
                  <Typography sx={ui.rowCopy}>{post.publishAt ? `Publish: ${post.publishAt}` : 'Draft only'}</Typography>
                  <Box sx={ui.platformTagRow}>
                    {(post.platforms ?? []).map((platform) => (
                      <Chip key={`${post.id}-${platform}`} label={platform} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={() => editPost(post)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => removePost(post.id)}>Delete</Button>
                  </Stack>
                </Stack>
                <Chip label={post.status} color={postColor(post.status)} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Stack>
  );
}

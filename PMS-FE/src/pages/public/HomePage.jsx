import { useEffect, useState } from 'react';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { Link } from 'react-router-dom';
import { useResort } from '../../context/ResortContext.jsx';
import { usePublicDesign } from '../../context/PublicDesignContext.jsx';

export function HomePage() {
  const { data } = useResort();
  const { currentDesign, mode } = usePublicDesign();
  const featuredRooms = data.rooms.slice(0, 3);
  const social = data.socialMedia.slice(0, 3);
  const content = data.siteContent ?? {};
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % featuredRooms.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [featuredRooms.length]);

  const slide = featuredRooms[activeSlide] ?? featuredRooms[0];
  const heroImageUrl = content.heroImageUrl || slide?.image;
  const isBackgroundHero =
    currentDesign.heroImageMode === 'background' || currentDesign.heroImageMode === 'background-soft';
  const isCenteredHero = currentDesign.heroLayout === 'centered' || currentDesign.heroLayout === 'stacked';
  const heroColumns =
    currentDesign.heroLayout === 'wide'
      ? { xs: '1fr', xl: '1.2fr 0.8fr' }
      : currentDesign.heroLayout === 'reverse'
        ? { xs: '1fr', xl: '420px minmax(0, 1fr)' }
        : currentDesign.heroLayout === 'asymmetric'
          ? { xs: '1fr', xl: '0.85fr 1.15fr' }
          : currentDesign.heroLayout === 'stacked' || currentDesign.heroLayout === 'centered'
            ? { xs: '1fr' }
            : { xs: '1fr', xl: 'minmax(0, 1fr) 420px' };
  const detailsOrder =
    currentDesign.heroLayout === 'reverse' || currentDesign.heroLayout === 'asymmetric' ? 2 : 1;
  const mediaOrder =
    currentDesign.heroLayout === 'reverse' || currentDesign.heroLayout === 'asymmetric' ? 1 : 2;
  const quickStats = [
    {
      title: 'Room Types',
      value: new Set(data.rooms.map((room) => room.type)).size,
      note: 'Villas, suites, lofts, and cabins',
    },
    {
      title: 'Scheduled Experiences',
      value: data.programs.filter((program) => program.isActive !== false).length,
      note: 'Daily guest activities available',
    },
  ];

  return (
    <Stack spacing={3.5}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4.5 },
          borderRadius: `${currentDesign.radiusHero}px`,
          border: currentDesign.panelBorder,
          background: isBackgroundHero
            ? `${currentDesign.heroBackground}, linear-gradient(0deg, rgba(0,0,0,${currentDesign.heroImageMode === 'background' ? 0.28 : 0.1}), rgba(0,0,0,${currentDesign.heroImageMode === 'background' ? 0.28 : 0.1})), url("${heroImageUrl}")`
            : currentDesign.heroBackground,
          backgroundSize: isBackgroundHero ? 'cover' : 'auto',
          backgroundPosition: isBackgroundHero ? 'center' : 'initial',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: currentDesign.buttonShadow,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: heroColumns,
            gap: 3,
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              order: detailsOrder,
              textAlign: currentDesign.heroTextAlign,
              mx: isCenteredHero ? 'auto' : 0,
              maxWidth: isCenteredHero ? 760 : 'none',
            }}
          >
            <Chip
              label={content.homeEyebrow ?? data.resort.location}
              sx={{
                mb: 2,
                px: 1,
                borderRadius: 999,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isBackgroundHero ? currentDesign.footerText : currentDesign.accentStrong,
                background: isBackgroundHero ? 'rgba(255,255,255,0.18)' : currentDesign.accentSoft,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                maxWidth: currentDesign.titleWidth,
                m: 0,
                lineHeight: 0.94,
                color: isBackgroundHero ? currentDesign.footerText : currentDesign.textPrimary,
                fontFamily: currentDesign.titleFontFamily,
                fontSize: {
                  xs: '3rem',
                  md:
                    mode === 'festival'
                      ? '5.6rem'
                      : currentDesign.heroLayout === 'centered'
                        ? '5.2rem'
                        : '4.8rem',
                },
                textTransform: mode === 'festival' ? 'uppercase' : 'none',
                letterSpacing: mode === 'editorial' ? '-0.05em' : 'normal',
                mx: isCenteredHero ? 'auto' : 0,
              }}
            >
              {content.homeHeadline ?? `Escape to ${data.resort.name}`}
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 620,
                color: isBackgroundHero ? 'rgba(255,255,255,0.82)' : currentDesign.textSecondary,
                fontSize: '1.05rem',
                mx: isCenteredHero ? 'auto' : 0,
              }}
            >
              {content.homeCopy ?? data.resort.tagline}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ mt: 3, justifyContent: isCenteredHero ? 'center' : 'flex-start' }}
            >
              <Button
                component={Link}
                to="/book"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: `${Math.max(currentDesign.radiusCard - 6, 10)}px`,
                  px: 2.5,
                  py: 1.3,
                  textTransform: 'none',
                  background: currentDesign.heroSecondary,
                  boxShadow: currentDesign.buttonShadow,
                }}
              >
                Check Availability
              </Button>
              <Button
                component={Link}
                to="/experiences"
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: `${Math.max(currentDesign.radiusCard - 6, 10)}px`,
                  px: 2.5,
                  py: 1.3,
                  textTransform: 'none',
                  color: currentDesign.accentStrong,
                  borderColor: currentDesign.accent,
                }}
              >
                Explore Experiences
              </Button>
            </Stack>
            <Button
              onClick={() => document.getElementById('home-discover')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              startIcon={<ArrowDownwardRoundedIcon />}
              sx={{
                mt: 2,
                px: 0,
                color: isBackgroundHero ? 'rgba(255,255,255,0.78)' : currentDesign.textSecondary,
                textTransform: 'none',
                justifyContent: isCenteredHero ? 'center' : 'flex-start',
              }}
            >
              Scroll to discover what changes with each mode
            </Button>
          </Box>

          {!isBackgroundHero ? (
            <Box
              sx={{
                order: mediaOrder,
                p: { xs: 2, md: 2.25 },
                borderRadius: `${currentDesign.radiusPanel}px`,
                background: currentDesign.heroSecondary,
                color: currentDesign.footerText,
                minHeight: currentDesign.heroMinHeight,
                display: 'grid',
                alignContent: 'space-between',
                ml: currentDesign.heroImageMode === 'edge' ? { xl: -2 } : 0,
                mr: currentDesign.heroLayout === 'reverse' ? { xl: -2 } : 0,
              }}
            >
              <Box
                component="img"
                src={heroImageUrl}
                alt={content.homeHeadline ?? `${data.resort.name} hero`}
                sx={{
                  width: '100%',
                  height: currentDesign.heroImageHeight,
                  objectFit: 'cover',
                  borderRadius: `${Math.max(currentDesign.radiusCard - 2, 12)}px`,
                  mb: 2,
                }}
              />
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.78 }}>
                    Featured stay
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>{slide?.name}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700 }}>${slide?.rate}/night</Typography>
              </Stack>
              <Typography sx={{ opacity: 0.82 }}>
                {slide?.type} • {slide?.capacity} guests • {slide?.amenities}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: isCenteredHero ? 'center' : 'flex-start' }}>
                {featuredRooms.map((room, index) => (
                  <Box
                    key={room.id}
                    onClick={() => setActiveSlide(index)}
                    sx={{
                      width: index === activeSlide ? 34 : 12,
                      height: 12,
                      borderRadius: 999,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      backgroundColor: index === activeSlide ? '#fff' : 'rgba(255,255,255,0.38)',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Paper>

      <Box
        id="home-discover"
        sx={{
          display: 'grid',
          gridTemplateColumns:
            currentDesign.statsLayout === 'feature'
              ? { xs: '1fr', md: '1.3fr 0.7fr' }
              : currentDesign.statsLayout === 'strip'
                ? { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }
                : { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2.25,
        }}
      >
        {quickStats.map((item) => (
          <Paper
            key={item.title}
            elevation={0}
            sx={{
              p: 2.8,
              borderRadius: `${currentDesign.radiusPanel}px`,
              border: currentDesign.panelBorder,
              background: currentDesign.panelBackground,
            }}
          >
            <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary }}>{item.title}</Typography>
            <Typography variant="h3" sx={{ mt: 1, fontFamily: currentDesign.titleFontFamily, color: currentDesign.textPrimary }}>
              {item.value}
            </Typography>
            <Typography sx={{ mt: 0.5, color: currentDesign.textSecondary }}>{item.note}</Typography>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            currentDesign.sectionLayout === 'stack'
              ? { xs: '1fr' }
              : currentDesign.sectionLayout === 'reverse'
                ? { xs: '1fr', xl: '0.9fr 1.1fr' }
                : currentDesign.sectionLayout === 'mosaic'
                  ? { xs: '1fr', xl: '0.95fr 1.05fr' }
                  : { xs: '1fr', xl: '1.1fr 0.9fr' },
          gap: 2.25,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: `${currentDesign.radiusPanel}px`,
            border: currentDesign.panelBorder,
            background: currentDesign.panelBackground,
            order: currentDesign.sectionLayout === 'reverse' ? 2 : 1,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: currentDesign.textPrimary, fontFamily: currentDesign.titleFontFamily }}>
            Featured Rooms
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {featuredRooms.map((room) => (
              <Box
                key={room.id}
                sx={{
                  p: 2,
                  borderRadius: `${currentDesign.radiusCard}px`,
                  border: currentDesign.cardBorder,
                  background: currentDesign.cardBackground,
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary }}>{room.name}</Typography>
                  <Typography sx={{ color: currentDesign.textSecondary }}>
                    {room.type} • {room.capacity} guests • {room.amenities}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={1}>
                  <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary }}>${room.rate}/night</Typography>
                  <Chip
                    label={room.status}
                    sx={{
                      borderRadius: 999,
                      background: currentDesign.accentSoft,
                      color: currentDesign.accentStrong,
                    }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: `${currentDesign.radiusPanel}px`,
            border: currentDesign.panelBorder,
            background: currentDesign.panelBackground,
            order: currentDesign.sectionLayout === 'reverse' ? 1 : 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: currentDesign.textPrimary, fontFamily: currentDesign.titleFontFamily }}>
            Follow the Resort
          </Typography>
          <Typography sx={{ color: currentDesign.textSecondary }}>
            Social channels configured in your admin frontend can also surface here.
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {social.map((account) => (
              <Box
                key={account.id}
                sx={{
                  p: 2,
                  borderRadius: `${currentDesign.radiusCard}px`,
                  border: currentDesign.cardBorder,
                  background: currentDesign.cardBackground,
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary }}>{account.platform}</Typography>
                  <Typography sx={{ color: currentDesign.textSecondary }}>{account.handle}</Typography>
                </Box>
                <Chip
                  label="Live"
                  sx={{
                    borderRadius: 999,
                    background: currentDesign.accentSoft,
                    color: currentDesign.accentStrong,
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}

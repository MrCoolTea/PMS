import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useResort } from '../../context/ResortContext.jsx';
import { usePublicDesign } from '../../context/PublicDesignContext.jsx';

export function ExperiencesPage() {
  const { data } = useResort();
  const { currentDesign, mode } = usePublicDesign();
  const content = data.siteContent ?? {};
  const activePrograms = data.programs.filter((program) => program.isActive !== false);
  const heroImageUrl = data.rooms[0]?.image;
  const isBackgroundHero =
    currentDesign.heroImageMode === 'background' || currentDesign.heroImageMode === 'background-soft';
  const isCenteredHero = currentDesign.heroLayout === 'centered' || currentDesign.heroLayout === 'stacked';

  return (
    <Stack spacing={3.5}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: `${currentDesign.radiusHero}px`,
          border: currentDesign.panelBorder,
          background: isBackgroundHero
            ? `${currentDesign.heroBackground}, linear-gradient(0deg, rgba(0,0,0,${currentDesign.heroImageMode === 'background' ? 0.28 : 0.14}), rgba(0,0,0,${currentDesign.heroImageMode === 'background' ? 0.28 : 0.14})), url("${heroImageUrl}")`
            : currentDesign.heroBackground,
          backgroundSize: isBackgroundHero ? 'cover' : 'auto',
          backgroundPosition: isBackgroundHero ? 'center' : 'initial',
          minHeight: isBackgroundHero ? currentDesign.heroMinHeight : 'auto',
          display: 'grid',
          alignItems: 'center',
          textAlign: currentDesign.heroTextAlign,
        }}
      >
        <Chip
          label={content.experiencesEyebrow ?? 'Experiences'}
          sx={{
            mb: 2,
            borderRadius: 999,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: isBackgroundHero ? currentDesign.footerText : currentDesign.accentStrong,
            background: isBackgroundHero ? 'rgba(255,255,255,0.18)' : currentDesign.accentSoft,
            justifySelf: isCenteredHero ? 'center' : currentDesign.heroTextAlign === 'right' ? 'end' : 'start',
          }}
        />
        <Typography
          variant="h2"
          sx={{
            maxWidth: currentDesign.titleWidth,
            lineHeight: 0.96,
            color: isBackgroundHero ? currentDesign.footerText : currentDesign.textPrimary,
            fontFamily: currentDesign.titleFontFamily,
            fontSize: { xs: '2.8rem', md: mode === 'festival' ? '4.8rem' : '4rem' },
            mx: isCenteredHero ? 'auto' : 0,
          }}
        >
          {content.experiencesHeadline ?? 'Curated activities for every stay'}
        </Typography>
        <Typography
          sx={{
            mt: 2,
            maxWidth: 640,
            color: isBackgroundHero ? 'rgba(255,255,255,0.82)' : currentDesign.textSecondary,
            fontSize: '1.02rem',
            mx: isCenteredHero ? 'auto' : 0,
          }}
        >
          {content.experiencesCopy ?? 'Surface scheduled programs from the same resort system visitors book from.'}
        </Typography>
        <Button
          onClick={() => document.getElementById('experience-rail')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          startIcon={<ArrowDownwardRoundedIcon />}
          sx={{
            mt: 2,
            px: 0,
            color: isBackgroundHero ? 'rgba(255,255,255,0.78)' : currentDesign.textSecondary,
            textTransform: 'none',
            justifySelf: isCenteredHero ? 'center' : currentDesign.heroTextAlign === 'right' ? 'end' : 'start',
          }}
        >
          Scroll into the program rail
        </Button>
      </Paper>

      <Box
        id="experience-rail"
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: currentDesign.railCardWidth,
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          pb: 1,
        }}
      >
        {activePrograms.map((program, index) => (
          <Paper
            key={program.id}
            elevation={0}
            sx={{
              p: 3,
              minHeight: 280,
              scrollSnapAlign: 'start',
              borderRadius: `${currentDesign.radiusPanel}px`,
              border: currentDesign.panelBorder,
              background: program.imageUrl
                ? `linear-gradient(0deg, rgba(10, 20, 16, 0.58), rgba(10, 20, 16, 0.28)), url("${program.imageUrl}")`
                : index % 2 === 0
                  ? currentDesign.panelBackground
                  : currentDesign.heroSecondary,
              backgroundSize: program.imageUrl ? 'cover' : 'auto',
              backgroundPosition: program.imageUrl ? 'center' : 'initial',
              color: program.imageUrl || index % 2 !== 0 ? currentDesign.footerText : currentDesign.textPrimary,
              display: 'grid',
              alignContent: 'space-between',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.8 }}>
                {program.venue}
              </Typography>
              <Typography sx={{ mt: 1, fontWeight: 700, fontSize: '1.75rem', fontFamily: currentDesign.titleFontFamily }}>
                {program.title}
              </Typography>
              {program.schedule ? <Typography sx={{ mt: 1, opacity: 0.8 }}>{program.schedule}</Typography> : null}
            </Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography sx={{ opacity: 0.82 }}>
                Hosted by {program.host}
                <br />
                {program.bookings}/{program.capacity} spots booked
              </Typography>
              <Chip
                label="Active"
                sx={{
                  borderRadius: 999,
                  background: index % 2 === 0 ? currentDesign.accentSoft : 'rgba(255,255,255,0.18)',
                  color: index % 2 === 0 ? currentDesign.accentStrong : currentDesign.footerText,
                }}
              />
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: `${currentDesign.radiusPanel}px`,
          border: currentDesign.panelBorder,
          background: currentDesign.panelBackground,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: currentDesign.textPrimary, fontFamily: currentDesign.titleFontFamily }}>
          Upcoming Programs
        </Typography>
        <Stack
          spacing={1.5}
          sx={{
            mt: 2.5,
            alignItems: currentDesign.heroTextAlign === 'center' ? 'center' : 'stretch',
          }}
        >
        {activePrograms.map((program) => (
            <Box
              key={program.id}
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
                width: '100%',
                textAlign: currentDesign.heroTextAlign,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary }}>{program.title}</Typography>
                <Typography sx={{ color: currentDesign.textSecondary }}>
                  {program.schedule ? `${program.schedule} • ` : ''}{program.venue}
                </Typography>
                <Typography sx={{ color: currentDesign.textSecondary }}>
                  Hosted by {program.host} • {program.bookings}/{program.capacity} spots booked
                </Typography>
              </Box>
              <Chip
                label="Active"
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
    </Stack>
  );
}

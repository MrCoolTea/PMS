import { useMemo, useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { usePublicDesign } from '../../context/PublicDesignContext.jsx';
import { formatCurrency } from '../../utils/currency.js';

export function BookingPage() {
  const { data } = useResort();
  const { currentDesign, mode } = usePublicDesign();
  const currency = data.settings?.currency;
  const content = data.siteContent ?? {};
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
  });

  const availableRooms = useMemo(
    () => data.rooms.filter((room) => room.status === 'Available' || room.status === 'Reserved'),
    [data.rooms]
  );
  const heroImageUrl = availableRooms[0]?.image || data.rooms[0]?.image;
  const isBackgroundHero =
    currentDesign.heroImageMode === 'background' || currentDesign.heroImageMode === 'background-soft';
  const isCenteredHero = currentDesign.heroLayout === 'centered' || currentDesign.heroLayout === 'stacked';

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <Stack spacing={3.5}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: `${currentDesign.radiusHero}px`,
          border: currentDesign.panelBorder,
          background: isBackgroundHero
            ? `${currentDesign.heroBackground}, linear-gradient(0deg, rgba(0,0,0,${currentDesign.heroImageMode === 'background' ? 0.28 : 0.12}), rgba(0,0,0,${currentDesign.heroImageMode === 'background' ? 0.28 : 0.12})), url("${heroImageUrl}")`
            : currentDesign.heroBackground,
          backgroundSize: isBackgroundHero ? 'cover' : 'auto',
          backgroundPosition: isBackgroundHero ? 'center' : 'initial',
          minHeight: isBackgroundHero ? currentDesign.heroMinHeight : 'auto',
          textAlign: currentDesign.heroTextAlign,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: isBackgroundHero ? currentDesign.footerText : currentDesign.accentStrong,
          }}
        >
          {content.bookingEyebrow ?? 'Direct Booking'}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            mt: 1.5,
            maxWidth: currentDesign.titleWidth,
            lineHeight: 0.96,
            color: isBackgroundHero ? currentDesign.footerText : currentDesign.textPrimary,
            fontFamily: currentDesign.titleFontFamily,
            fontSize: { xs: '2.8rem', md: mode === 'festival' ? '4.8rem' : '4rem' },
            mx: isCenteredHero ? 'auto' : 0,
          }}
        >
          {content.bookingHeadline ?? 'Search dates and choose your stay'}
        </Typography>
        <Typography
          sx={{
            mt: 2,
            maxWidth: 680,
            color: isBackgroundHero ? 'rgba(255,255,255,0.82)' : currentDesign.textSecondary,
            fontSize: '1.02rem',
            mx: isCenteredHero ? 'auto' : 0,
          }}
        >
          {content.bookingCopy ?? 'This booking page is ready to connect to your real availability, pricing, and payment backend later.'}
        </Typography>
        <Button
          onClick={() => document.getElementById('booking-search')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          startIcon={<ArrowDownwardRoundedIcon />}
          sx={{
            mt: 2,
            px: 0,
            color: isBackgroundHero ? 'rgba(255,255,255,0.78)' : currentDesign.textSecondary,
            textTransform: 'none',
            justifyContent: isCenteredHero ? 'center' : currentDesign.heroTextAlign === 'right' ? 'flex-end' : 'flex-start',
          }}
        >
          Jump to search and room picks
        </Button>
      </Paper>

      <Paper
        id="booking-search"
        elevation={0}
        sx={{
          p: 3,
          borderRadius: `${currentDesign.radiusPanel}px`,
          border: currentDesign.panelBorder,
          background: currentDesign.panelBackground,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Check In"
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: `${Math.max(currentDesign.radiusCard - 6, 10)}px`,
                backgroundColor: 'rgba(255,255,255,0.72)',
              },
            }}
          />
          <TextField
            label="Check Out"
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: `${Math.max(currentDesign.radiusCard - 6, 10)}px`,
                backgroundColor: 'rgba(255,255,255,0.72)',
              },
            }}
          />
          <TextField
            label="Guests"
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: `${Math.max(currentDesign.radiusCard - 6, 10)}px`,
                backgroundColor: 'rgba(255,255,255,0.72)',
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            sx={{
              minWidth: 150,
              borderRadius: `${Math.max(currentDesign.radiusCard - 6, 10)}px`,
              textTransform: 'none',
              background: currentDesign.heroSecondary,
              boxShadow: currentDesign.buttonShadow,
            }}
          >
            Search
          </Button>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: currentDesign.bookingRailWidth,
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          pb: 1,
        }}
      >
        {availableRooms.map((room) => (
          <Paper
            key={room.id}
            elevation={0}
            sx={{
              p: 2.5,
              scrollSnapAlign: 'start',
              borderRadius: `${currentDesign.radiusPanel}px`,
              border: currentDesign.panelBorder,
              background: currentDesign.cardBackground,
            }}
          >
            {room.image ? (
              <Box
                component="img"
                src={room.image}
                alt={room.name}
                sx={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: `${Math.max(currentDesign.radiusCard - 2, 12)}px`,
                  mb: 2,
                }}
              />
            ) : null}
            <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary, fontSize: '1.15rem' }}>{room.name}</Typography>
            <Typography sx={{ mt: 0.75, color: currentDesign.textSecondary }}>
              {room.type} • Sleeps {room.capacity}
            </Typography>
            <Typography sx={{ mt: 0.75, color: currentDesign.textSecondary }}>{room.amenities}</Typography>
            <Typography sx={{ mt: 1.5, fontWeight: 700, color: currentDesign.accentStrong }}>
              {formatCurrency(room.rate, currency)}/night
            </Typography>
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
          Available Options
        </Typography>
        <Stack
          spacing={1.5}
          sx={{
            mt: 2.5,
            alignItems: currentDesign.heroTextAlign === 'center' ? 'center' : 'stretch',
          }}
        >
          {availableRooms.map((room) => (
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
                width: '100%',
                textAlign: currentDesign.heroTextAlign,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary }}>{room.name}</Typography>
                <Typography sx={{ color: currentDesign.textSecondary }}>
                  {room.type} • Sleeps {room.capacity} • {room.amenities}
                </Typography>
              </Box>
              <Stack alignItems="flex-end" spacing={1}>
                <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary }}>
                  {formatCurrency(room.rate, currency)}/night
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: `${Math.max(currentDesign.radiusCard - 6, 10)}px`,
                    textTransform: 'none',
                    color: currentDesign.accentStrong,
                    borderColor: currentDesign.accent,
                  }}
                >
                  Select Room
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

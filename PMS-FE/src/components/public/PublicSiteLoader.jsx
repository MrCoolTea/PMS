import { Box, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const floatPalm = keyframes`
  0%,
  100% {
    transform: translateY(0px) rotate(-5deg);
  }
  50% {
    transform: translateY(-8px) rotate(-3deg);
  }
`;

const swayLeafLeft = keyframes`
  0%,
  100% {
    transform: rotate(-32deg) scaleY(1);
  }
  50% {
    transform: rotate(-24deg) scaleY(1.02);
  }
`;

const swayLeafMid = keyframes`
  0%,
  100% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(2deg);
  }
`;

const swayLeafRight = keyframes`
  0%,
  100% {
    transform: rotate(30deg) scaleY(1);
  }
  50% {
    transform: rotate(22deg) scaleY(1.03);
  }
`;

const sunRise = keyframes`
  0%,
  100% {
    transform: translateY(6px) scale(0.96);
    box-shadow: 0 0 0 rgba(255, 183, 54, 0.18);
  }
  50% {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 0 42px rgba(255, 183, 54, 0.34);
  }
`;

const hillShift = keyframes`
  0%,
  100% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(5px);
  }
`;

const waveRoll = keyframes`
  0%,
  100% {
    transform: translateX(0px) translateY(0px);
  }
  50% {
    transform: translateX(8px) translateY(-3px);
  }
`;

const waveCurl = keyframes`
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.06) rotate(4deg);
  }
`;

const shoreSweep = keyframes`
  0%,
  100% {
    transform: translateX(0px) scaleX(1);
  }
  50% {
    transform: translateX(-6px) scaleX(1.03);
  }
`;

const letterLift = keyframes`
  0%,
  100% {
    transform: translateY(0px);
    opacity: 0.72;
  }
  45% {
    transform: translateY(-8px);
    opacity: 1;
  }
`;

const dotPulse = keyframes`
  0%,
  80%,
  100% {
    transform: translateY(0px) scale(0.9);
    opacity: 0.28;
  }
  40% {
    transform: translateY(-8px) scale(1);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-150%) skewX(-18deg);
    opacity: 0;
  }
  25% {
    opacity: 0.16;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: translateX(200%) skewX(-18deg);
    opacity: 0;
  }
`;

const brandText = 'PARAISO SA GUBAT';

function PalmLeaf({ sx, animation }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: 126,
        height: 42,
        borderRadius: '70% 30% 72% 28% / 58% 42% 58% 42%',
        background: 'linear-gradient(135deg, #2d8b3c 0%, #1d6a2a 100%)',
        transformOrigin: '8% 50%',
        animation: `${animation} 2.8s ease-in-out infinite`,
        ...sx,
      }}
    />
  );
}

export function PublicSiteLoader({ design }) {
  const accent = design?.accent ?? '#1e9183';
  const accentStrong = design?.accentStrong ?? '#0d5f56';
  const textPrimary = design?.textPrimary ?? '#173833';
  const textSecondary = design?.textSecondary ?? 'rgba(23, 56, 51, 0.76)';
  const shellBackground =
    design?.shellBackground ??
    'radial-gradient(circle at top, rgba(255, 194, 73, 0.34), transparent 28%), linear-gradient(180deg, #fffaf1 0%, #f4ead8 52%, #efe2cc 100%)';
  const shellOverlay =
    design?.shellOverlay ??
    'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 48%, transparent 100%)';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 3,
        position: 'relative',
        overflow: 'hidden',
        background: shellBackground,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: shellOverlay,
          animation: `${shimmer} 4s ease-in-out infinite`,
          pointerEvents: 'none',
        }}
      />

      <Stack
        spacing={3}
        alignItems="center"
        sx={{ position: 'relative', zIndex: 1, color: textPrimary }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: 280, sm: 360, md: 440 },
            height: { xs: 220, sm: 270, md: 320 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '9%',
              bottom: '18%',
              width: '34%',
              height: '56%',
              animation: `${floatPalm} 2.8s ease-in-out infinite`,
              transformOrigin: '35% 100%',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: '37%',
                bottom: '2%',
                width: 28,
                height: '72%',
                borderRadius: '50% 50% 12% 12% / 16% 16% 12% 12%',
                background: 'linear-gradient(180deg, #8d5526 0%, #b87938 55%, #d7974f 100%)',
                transform: 'skewX(-10deg) rotate(7deg)',
                boxShadow: 'inset -8px 0 0 rgba(90, 47, 17, 0.18)',
              }}
            />
            <PalmLeaf sx={{ left: -8, top: 78, transform: 'rotate(-28deg)' }} animation={swayLeafLeft} />
            <PalmLeaf sx={{ left: 30, top: 44, width: 116, transform: 'rotate(-6deg)' }} animation={swayLeafMid} />
            <PalmLeaf sx={{ left: 64, top: 14, width: 124, transform: 'rotate(26deg)' }} animation={swayLeafRight} />
            <PalmLeaf sx={{ left: 34, top: -6, width: 112, transform: 'rotate(-62deg)' }} animation={swayLeafLeft} />
            <PalmLeaf sx={{ left: 70, top: -12, width: 110, transform: 'rotate(-32deg)' }} animation={swayLeafMid} />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              right: '18%',
              top: '28%',
              width: { xs: 60, sm: 76, md: 88 },
              height: { xs: 60, sm: 76, md: 88 },
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #ffc23f 0%, #f8a61c 100%)',
              animation: `${sunRise} 2.8s ease-in-out infinite`,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              right: '20%',
              top: '46%',
              width: '32%',
              height: '16%',
              borderRadius: '55% 45% 28% 32% / 70% 60% 40% 30%',
              background: 'linear-gradient(135deg, #6db52e 0%, #4f991f 100%)',
              animation: `${hillShift} 3s ease-in-out infinite`,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              right: '31%',
              top: '49%',
              width: '30%',
              height: '15%',
              borderRadius: '46% 54% 30% 24% / 68% 64% 36% 32%',
              background: 'linear-gradient(135deg, #267a2d 0%, #1c6022 100%)',
              animation: `${hillShift} 3s ease-in-out infinite reverse`,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              right: '4%',
              top: '50%',
              width: '52%',
              height: '22%',
              borderRadius: '46% 54% 58% 42% / 56% 44% 56% 44%',
              border: '20px solid #1481c4',
              borderLeftWidth: 16,
              borderBottomWidth: 24,
              borderColor: '#1490cf #0f6faa #0f6faa #1490cf',
              borderLeftColor: 'transparent',
              borderTopColor: '#22a6de',
              transform: 'rotate(-10deg)',
              animation: `${waveRoll} 2.2s ease-in-out infinite`,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              right: '10%',
              top: '58%',
              width: '22%',
              height: '14%',
              borderRadius: '50%',
              border: '14px solid #25a6df',
              borderRightColor: 'transparent',
              borderTopColor: '#25a6df',
              borderBottomColor: '#25a6df',
              borderLeftColor: '#25a6df',
              transform: 'rotate(18deg)',
              animation: `${waveCurl} 2.2s ease-in-out infinite`,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              left: '17%',
              bottom: '14%',
              width: '62%',
              height: 24,
              borderRadius: '55% 45% 50% 50% / 100% 100% 0% 0%',
              background: 'linear-gradient(90deg, #e8b25e 0%, #f6c66e 52%, #efb75b 100%)',
              transform: 'rotate(6deg)',
              animation: `${shoreSweep} 2.7s ease-in-out infinite`,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              left: '5%',
              bottom: '8%',
              width: '56%',
              height: 20,
              borderRadius: '58% 42% 50% 50% / 100% 100% 0% 0%',
              background: 'linear-gradient(90deg, #217d2f 0%, #165f22 100%)',
              transform: 'rotate(-2deg)',
              animation: `${shoreSweep} 2.7s ease-in-out infinite reverse`,
            }}
          />
        </Box>

        <Stack direction="row" spacing={0.1} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {brandText.split('').map((letter, index) => (
            <Typography
              key={`${letter}-${index}`}
              component="span"
              sx={{
                minWidth: letter === ' ' ? '0.55em' : 'auto',
                fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.34rem' },
                fontWeight: 900,
                letterSpacing: '0.12em',
                color:
                  index % 3 === 0 ? accentStrong : index % 3 === 1 ? accent : '#d88b22',
                animation: `${letterLift} 1.6s ${index * 0.06}s ease-in-out infinite`,
                display: 'inline-block',
                textTransform: 'uppercase',
                textShadow: '0 8px 18px rgba(54, 49, 36, 0.12)',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </Typography>
          ))}
        </Stack>

        <Stack spacing={1} alignItems="center">
          <Typography
            sx={{
              color: textSecondary,
              fontWeight: 600,
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}
          >
            Preparing your island escape
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialResortData } from '../data/resortData.js';

const STORAGE_KEY = 'resort-frontend-data';
const ResortContext = createContext(null);

function readStoredData() {
  if (typeof window === 'undefined') {
    return initialResortData;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return initialResortData;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return initialResortData;
  }
}

function createId(prefix) {
  return `${prefix}-${Date.now()}`;
}

export function ResortProvider({ children }) {
  const [data, setData] = useState(readStoredData);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const value = useMemo(() => {
    function addRoom(room) {
      setData((current) => ({
        ...current,
        rooms: [...current.rooms, { id: createId('room'), status: 'Available', ...room }],
      }));
    }

    function addGuest(guest) {
      setData((current) => ({
        ...current,
        guests: [...current.guests, { id: createId('guest'), vip: 'Standard', ...guest }],
      }));
    }

    function addReservation(reservation) {
      setData((current) => ({
        ...current,
        reservations: [
          { id: createId('res'), status: 'Confirmed', source: 'Direct Website', ...reservation },
          ...current.reservations,
        ],
      }));
    }

    function addProgram(program) {
      setData((current) => ({
        ...current,
        programs: [
          { id: createId('prog'), status: 'Scheduled', bookings: 0, ...program },
          ...current.programs,
        ],
      }));
    }

    function recordPayment(payment) {
      setData((current) => ({
        ...current,
        payments: [
          {
            id: createId('pay'),
            paidDate: new Date().toISOString().slice(0, 10),
            status: 'Paid',
            ...payment,
          },
          ...current.payments,
        ],
      }));
    }

    function addSocialMedia(account) {
      setData((current) => ({
        ...current,
        socialMedia: [
          { id: createId('soc'), status: 'Active', ...account },
          ...current.socialMedia,
        ],
      }));
    }

    function addIntegration(integration) {
      setData((current) => ({
        ...current,
        integrations: [
          {
            id: createId('int'),
            status: 'Pending Setup',
            sync: 'Not configured',
            ...integration,
          },
          ...current.integrations,
        ],
      }));
    }

    function addFile(file) {
      setData((current) => ({
        ...current,
        files: [
          { id: createId('file'), updatedAt: new Date().toISOString().slice(0, 10), ...file },
          ...current.files,
        ],
      }));
    }

    function updateSettings(settings) {
      setData((current) => ({
        ...current,
        settings: { ...current.settings, ...settings },
      }));
    }

    return {
      data,
      addRoom,
      addGuest,
      addReservation,
      addProgram,
      recordPayment,
      addSocialMedia,
      addIntegration,
      addFile,
      updateSettings,
    };
  }, [data]);

  return <ResortContext.Provider value={value}>{children}</ResortContext.Provider>;
}

export function useResort() {
  const context = useContext(ResortContext);

  if (!context) {
    throw new Error('useResort must be used within a ResortProvider');
  }

  return context;
}

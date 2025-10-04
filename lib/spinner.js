import spinnies from 'spinnies';

const spinnerFrames = [
  "Selamat",
  "Selamat datang",
  "Selamat datang di",
  "Selamat datang di Nightmare MD",
  "Selamat datang di Nightmare MD,",
  "Selamat datang di Nightmare MD, source",
  "Selamat datang di Nightmare MD, source code",
  "Selamat datang di Nightmare MD, source code Bot",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan dan",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan dan keren.",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan dan keren. Fitur",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan dan keren. Fitur menggunakan",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan dan keren. Fitur menggunakan scraper",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan dan keren. Fitur menggunakan scraper dan",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan dan keren. Fitur menggunakan scraper dan 10%",
  "Selamat datang di Nightmare MD, source code Bot WhatsApp yang elegan dan keren. Fitur menggunakan scraper dan 10% API"
];

const spinner = { 
  interval: 100,
  frames: spinnerFrames
};

let globalSpinner;

const getGlobalSpinner = (disableSpins = false) => {
  if (!globalSpinner) globalSpinner = new spinnies({ color: 'yellow', succeedColor: 'green', spinner, disableSpins });
  return globalSpinner;
};

const spins = getGlobalSpinner(false);

export const start = (id, text) => {
  spins.add(id, { text });
};

export const success = (id, text) => {
  spins.succeed(id, { text });
};

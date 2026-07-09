const startedAt = Date.now();

export function getUptime() {
  const seconds = Math.floor(
    (Date.now() - startedAt) / 1000
  );

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}
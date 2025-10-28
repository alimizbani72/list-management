export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

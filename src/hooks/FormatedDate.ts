export const formatDate = (dateInput: string | Date | null) => {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (isNaN(date.getTime())) return "";

  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date,
  );
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}. ${day} ${year}`;
};

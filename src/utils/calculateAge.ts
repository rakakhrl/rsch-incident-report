export function calculateAge(dateOfBirth: string | Date) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Jika hari negatif, kurangi bulan
  if (days < 0) {
    months--;

    // Ambil jumlah hari bulan sebelumnya
    const prevMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    ).getDate();

    days += prevMonth;
  }

  // Jika bulan negatif, kurangi tahun
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

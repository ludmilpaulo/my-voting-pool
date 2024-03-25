'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Birthday {
  id: number;
  name: string;
  surname: string;
  month: string;
  day: string;
}

const BirthdaysClient = () => {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [monthCounts, setMonthCounts] = useState<{ [key: string]: number }>({});
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [existingSurnames, setExistingSurnames] = useState<string[]>([]);

  useEffect(() => {
    fetchBirthdays();
  }, []);

  useEffect(() => {
    updateExistingNamesAndSurnames();
  }, [birthdays]);

  const fetchBirthdays = async () => {
    try {
      const response = await axios.get<Birthday[]>('https://maindo.pythonanywhere.com/api/birthdays/');
      setBirthdays(response.data);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
    }
  };

  const handleAddBirthday = async () => {
    try {
      if (existingNames.includes(name) && existingSurnames.includes(surname)) {
        alert('O nome e sobrenome já existem.');
        return;
      }

      const response = await axios.post<Birthday>('https://maindo.pythonanywhere.com/api/birthdays/', {
        name,
        surname,
        month: selectedMonth,
        day,
      });
      alert('Aniversário adicionado com sucesso.');
      fetchBirthdays();
    } catch (error) {
      console.error('Error adding birthday:', error);
    }
  };

  const countBirthdaysByMonth = () => {
    const counts: { [key: string]: number } = {};
    birthdays.forEach((birthday) => {
      const month = birthday.month;
      counts[month] = (counts[month] || 0) + 1;
    });
    setMonthCounts(counts);
  };

  useEffect(() => {
    countBirthdaysByMonth();
  }, [birthdays]);

  const updateExistingNamesAndSurnames = () => {
    const names: string[] = [];
    const surnames: string[] = [];
    birthdays.forEach((birthday) => {
      names.push(birthday.name);
      surnames.push(birthday.surname);
    });
    setExistingNames(names);
    setExistingSurnames(surnames);
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Grupo de votação de aniversário de família</h1>
      <div className="flex flex-col md:flex-row mb-4">
        <input
          type="text"
          placeholder="Nome"
          className="border border-black p-2 mr-2 mb-2 md:mb-0 md:mr-4"
          style={{ minWidth: '100px', width: 'calc(100% - 16px)', color: 'black' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sobrenome"
          className="border border-black p-2 mr-2 mb-2 md:mb-0 md:mr-4"
          style={{ minWidth: '100px', width: 'calc(100% - 16px)', color: 'black' }}
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <select
          className="border border-gray-300 p-2 mr-2 mb-2 md:mb-0 md:mr-4"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Selecione o mês</option>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 p-2 mr-2 mb-2 md:mb-0 md:mr-4"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          <option value="">Selecione o dia</option>
          {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
            <option key={day} value={day < 10 ? `0${day}` : `${day}`}>{day < 10 ? `0${day}` : `${day}`}</option>
          ))}
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={handleAddBirthday}
        >
          Adicionar aniversário
        </button>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Anivers&aacute;rios:</h2>
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th>Mês</th>
              <th>Número de Pessoas</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthCounts).map(([month, count]) => (
              <tr key={month}>
                <td>{month}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="text-lg font-bold mb-2">Detalhes:</h3>
{Object.entries(monthCounts).map(([month, count]) => (
  <div key={month}>
    <h4 className="text-lg font-bold mb-2">{month}</h4>
    <ul>
      {birthdays
        .filter((birthday) => birthday.month === month)
        .map((birthday: Birthday) => (
          <li key={birthday.id}>
            {birthday.name} {birthday.surname} Aniversário: {birthday.month}/{birthday.day}
          </li>
        ))}
    </ul>
  </div>
))}

      </div>
    </div>
  );
};

export default BirthdaysClient;

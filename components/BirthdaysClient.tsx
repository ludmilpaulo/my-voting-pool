// components/BirthdaysClient.tsx
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
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [monthCounts, setMonthCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchBirthdays();
  }, []);

  useEffect(() => {
    countBirthdaysByMonth();
  }, [birthdays, countBirthdaysByMonth]);
  

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
      const response = await axios.post<Birthday>('https://maindo.pythonanywhere.com/api/birthdays/', {
        name,
        surname,
        month,
        day,
      });
      console.log('Birthday added successfully:', response.data);
      // Refresh the list of birthdays after adding a new one
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Grupo de votação de aniversário da família Jorge</h1>
      <div className="flex flex-col md:flex-row mb-4">
        <input
          type="text"
          placeholder="Nome"
          className="border border-gray-300 p-2 mr-2 mb-2 md:mb-0 md:mr-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sobrenome"
          className="border border-gray-300 p-2 mr-2 mb-2 md:mb-0 md:mr-4"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mês"
          className="border border-gray-300 p-2 mr-2 mb-2 md:mb-0 md:mr-4"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dia"
          className="border border-gray-300 p-2 mr-2 mb-2 md:mb-0 md:mr-4"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
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
        <ul>
          {birthdays.map((birthday: Birthday) => (
            <li key={birthday.id}>
              {birthday.name} {birthday.surname} Aniversário: {birthday.month}/{birthday.day}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BirthdaysClient;

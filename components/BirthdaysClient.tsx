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
      <th className="text-center">Mês</th>
      <th className="text-center">Número de Pessoas</th>
    </tr>
  </thead>
  <tbody>
  {Object.entries(monthCounts)
    .sort(([, countA], [, countB]) => countB - countA) // Sort entries by count in descending order
    .map(([month, count]) => (
      <tr key={month}>
        <td className="text-center">{month}</td>
        <td className="text-center">{count}</td>
      </tr>
    ))}
</tbody>

</table>
        <h3 className="text-lg font-bold mb-2">Detalhes:</h3>
<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
  {Object.entries(monthCounts).map(([month, count]) => (
    <div key={month} className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-lg font-bold mb-2">{month}</h4>
      <ul>
        {birthdays
          .filter((birthday) => birthday.month === month)
          .map((birthday: Birthday) => (
            <li key={birthday.id} className="mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-bold">{birthday.day}</span>
                </div>
                <div>
                  <p className="font-semibold">{birthday.name} {birthday.surname}</p>
                  <p className="text-gray-600 text-sm">Aniversário: {birthday.month}/{birthday.day}</p>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  ))}
</div>


      </div>
    </div>
  );
};

export default BirthdaysClient;

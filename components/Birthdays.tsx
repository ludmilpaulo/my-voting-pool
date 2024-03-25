// components/Birthdays.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const Birthdays = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      const response = await axios.get('https://maindo.pythonanywhere.com/api/birthdays/');
      setBirthdays(response.data);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
    }
  };

  const handleAddBirthday = async () => {
    try {
      const response = await axios.post('https://maindo.pythonanywhere.com/api/birthdays/', {
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Family Birthday Voting Pool</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Name"
          className="border border-gray-300 p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Surname"
          className="border border-gray-300 p-2 mr-2"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Month"
          className="border border-gray-300 p-2 mr-2"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="text"
          placeholder="Day"
          className="border border-gray-300 p-2 mr-2"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={handleAddBirthday}
        >
          Add Birthday
        </button>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Birthdays:</h2>
        <ul>
          {birthdays.map((birthday: any) => (
            <li key={birthday.id}>
              {birthday.name} {birthday.surname}'s Birthday: {birthday.month}/{birthday.day}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Birthdays;

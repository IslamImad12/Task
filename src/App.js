import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers: ', error);
      });

    axios.get('http://localhost:5000/transactions')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error('Error fetching transactions: ', error);
      });
  }, []);

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomerId(customerId);
  };

  const filteredTransactions = selectedCustomerId ?
    transactions.filter(transaction => transaction.customer_id === selectedCustomerId) :
    [];

  const chartData = {
    labels: filteredTransactions.map(transaction => transaction.date),
    datasets: [
      {
        label: 'Total Transaction Amount',
        data: filteredTransactions.map(transaction => transaction.amount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="App">
      <h1>Customer Transactions Dashboard</h1>
      <div className="container">
        <div className="customers">
          <h2>Customers</h2>
          <ul>
            {customers.map(customer => (
              <li key={customer.id} onClick={() => handleCustomerSelect(customer.id)}>
                {customer.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="transactions">
          <h2>Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedCustomerId && (
        <div className="chart">
          <h2>Transaction Chart for {customers.find(customer => customer.id === selectedCustomerId).name}</h2>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default App;

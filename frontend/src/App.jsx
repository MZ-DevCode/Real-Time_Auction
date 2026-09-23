import React, { useState, useEffect } from 'react';

const initialLots = [
  {
    id: 1,
    title: "Vintage Rolex Submariner (1984)",
    description: "Original condition, serviced last year. Box and papers included.",
    current_price: 12500,
    status: "active",
    bids_count: 14,
  },
  {
    id: 2,
    title: "Apple Macintosh 128K (Working)",
    description: "Rare collector's item, includes original mouse and keyboard.",
    current_price: 4200,
    status: "active",
    bids_count: 8,
  },
  {
    id: 3,
    title: "Cyberdeck Custom Build Mk. IV",
    description: "Mechanical keyboard, built-in SDR radio, rugged Pelican case.",
    current_price: 1850,
    status: "upcoming",
    bids_count: 0,
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  const [lots, setLots] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/lots')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setLots(data);
        }
      })
      .catch(err => console.error('Ошибка при загрузке лотов:', err));
  }, []);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const [registerData, setRegisterData] = useState({
      name: '',
      username: '',
      password: '',
      repeatPassword: '',
    });

    const [currentUser, setCurrentUser] = useState(null);

  const handleBidChange = (lotId, value) => {
    setBidAmounts({ ...bidAmounts, [lotId]: value });
  };

  const placeBid = (lotId) => {
    if (!currentUser) {
      alert("Пожалуйста, войдите в систему, чтобы делать ставки!");
      setCurrentView('login');
      return;
    }
    const amount = parseFloat(bidAmounts[lotId]);
    const lot = lots.find(l => l.id === lotId);

    if (!amount || amount <= lot.current_price) {
      alert("Ставка должна быть выше текущей цены!");
      return;
    }

    setLots(lots.map(l => l.id === lotId ? { ...l, current_price: amount, bids_count: l.bids_count + 1 } : l));
    setBidAmounts({ ...bidAmounts, [lotId]: '' });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setCurrentUser({ username: loginData.username, balance: 24500 });
    setCurrentView('home');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.repeatPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          username: registerData.username,
          password: registerData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка на сервере');
      }

      const data = await response.json();
      alert(data.message);

      setCurrentUser({ username: registerData.username, balance: 10000 });
      setCurrentView('home');

    } catch (error) {
      console.error('Ошибка подключения:', error);
      alert('Не удалось подключиться к Go-серверу! Убедитесь, что он запущен.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="font-bold tracking-wider text-lg uppercase bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              NexusAuction
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-sm text-slate-400">
                  {currentUser.username} | Баланс: <strong className="text-amber-400">${currentUser.balance.toLocaleString()}</strong>
                </span>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition cursor-pointer"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-sm text-slate-300 hover:text-amber-400 transition px-3 py-1.5 cursor-pointer"
                >
                  Войти
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  Регистрация
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {currentView === 'home' && (
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Активные лоты</h1>
              <p className="text-slate-400 mt-1">Делайте ставки в реальном времени. Побеждает последняя наивысшая ставка.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-wider ${
                      lot.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {lot.status === 'active' ? 'Идет аукцион' : 'Скоро начнется'}
                    </span>
                    <span className="text-xs text-slate-500">{lot.bids_count} ставок</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{lot.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{lot.description}</p>
                </div>

                <div>
                  <div className="bg-slate-950/50 rounded-xl p-4 mb-4 border border-slate-800/60 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-500 block">Текущая цена</span>
                      <span className="text-2xl font-black text-amber-400">${lot.current_price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={`Мин. > ${lot.current_price}`}
                      value={bidAmounts[lot.id] || ''}
                      onChange={(e) => handleBidChange(lot.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:border-amber-500 transition"
                    />
                    <button
                      onClick={() => placeBid(lot.id)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap cursor-pointer"
                    >
                      Ставка
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {currentView === 'login' && (
        <div className="max-w-md mx-auto mt-20 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-amber-400">Вход в аккаунт</h1>
              <p className="text-sm text-slate-400 mt-2">Введите никнейм и пароль</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Никнейм</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="username"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Пароль</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-2.5 rounded-lg transition shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                Войти
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Нет аккаунта?{' '}
              <button onClick={() => setCurrentView('register')} className="text-amber-400 hover:underline cursor-pointer">
                Зарегистрироваться
              </button>
            </p>
          </div>
        </div>
      )}

      {currentView === 'register' && (
        <div className="max-w-md mx-auto mt-20 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-amber-400">Регистрация</h1>
              <p className="text-sm text-slate-400 mt-2">Создайте аккаунт для участия в торгах</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Имя</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  placeholder="Иван"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Никнейм</label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  placeholder="username"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Пароль</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">Повторите пароль</label>
                <input
                  type="password"
                  value={registerData.repeatPassword}
                  onChange={(e) => setRegisterData({ ...registerData, repeatPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-2.5 rounded-lg transition shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                Создать аккаунт
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Уже есть аккаунт?{' '}
              <button onClick={() => setCurrentView('login')} className="text-amber-400 hover:underline cursor-pointer">
                Войти
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

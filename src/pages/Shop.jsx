import React, { useState, useEffect } from 'react';
import { Crown, Shield, Eye, Zap, Gem, Star, Heart, Sparkles, Lock, Search, Scissors, Wand2 } from 'lucide-react';
import { FaBolt, FaCrown, FaEye, FaGem, FaHeart, FaMagic, FaStar } from 'react-icons/fa';
import { FaShield } from 'react-icons/fa6';
import { MdSecurity, MdVisibility } from 'react-icons/md';
import { GiDiamonds, GiKnifeFork, GiMagicSwirl } from 'react-icons/gi';

const Shop = () => {
  // Мокаем данные пользователя для демонстрации
  const [userScore, setUserScore] = useState(1500);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('roles');

  const categories = [
    { id: 'roles', name: 'Роли', icon: <Crown /> },
    { id: 'abilities', name: 'Способности', icon: <Zap /> },
    { id: 'cosmetics', name: 'Косметика', icon: <Gem /> },
    { id: 'boosters', name: 'Бустеры', icon: <Star /> }
  ];



  const shopItems = {
    roles: [
      {
        id: 'detective',
        name: 'Детектив',
        description: 'Может проверить одного игрока за ночь',
        price: 150,
        icon: <FaEye />,
        rarity: 'rare',
        type: 'role'
      },
      {
        id: 'doctor',
        name: 'Доктор',
        description: 'Может спасти одного игрока от убийства',
        price: 200,
        icon: <FaHeart />,
        rarity: 'epic',
        type: 'role'
      },
      {
        id: 'bodyguard',
        name: 'Телохранитель',
        description: 'Защищает выбранного игрока, умирая вместо него',
        price: 250,
        icon: <FaShield />,
        rarity: 'epic',
        type: 'role'
      },
      {
        id: 'psychic',
        name: 'Экстрасенс',
        description: 'Видит роли убитых игроков',
        price: 300,
        icon: <FaMagic />,
        rarity: 'legendary',
        type: 'role'
      }
    ],
    abilities: [
      {
        id: 'extra_vote',
        name: 'Двойной голос',
        description: 'Ваш голос считается за два в течение одного дня',
        price: 100,
        icon: <MdSecurity />,
        rarity: 'common',
        type: 'ability'
      },
      {
        id: 'night_vision',
        name: 'Ночное зрение',
        description: 'Видите кто кого посещает ночью',
        price: 180,
        icon: <MdVisibility />,
        rarity: 'rare',
        type: 'ability'
      },
      {
        id: 'silence',
        name: 'Заткнуть рот',
        description: 'Запретить игроку говорить на один день',
        price: 120,
        icon: <GiKnifeFork />,
        rarity: 'common',
        type: 'ability'
      },
      {
        id: 'reveal',
        name: 'Разоблачение',
        description: 'Узнать роль любого игрока (одноразово)',
        price: 350,
        icon: <GiMagicSwirl />,
        rarity: 'legendary',
        type: 'ability'
      }
    ],
    cosmetics: [
      {
        id: 'golden_name',
        name: 'Золотое имя',
        description: 'Ваше имя отображается золотым цветом',
        price: 80,
        icon: <FaCrown />,
        rarity: 'common',
        type: 'cosmetic'
      },
      {
        id: 'diamond_badge',
        name: 'Алмазный значок',
        description: 'Красивый значок рядом с именем',
        price: 150,
        icon: <GiDiamonds />,
        rarity: 'rare',
        type: 'cosmetic'
      },
      {
        id: 'custom_title',
        name: 'Особое звание',
        description: 'Выберите свое уникальное звание',
        price: 200,
        icon: <FaStar />,
        rarity: 'epic',
        type: 'cosmetic'
      }
    ],
    boosters: [
      {
        id: 'score_boost',
        name: 'Бустер очков',
        description: '+50% очков за следующие 5 игр',
        price: 100,
        icon: <FaBolt />,
        rarity: 'common',
        type: 'booster'
      },
      {
        id: 'win_streak',
        name: 'Серия побед',
        description: 'Дополнительные очки за победные серии',
        price: 150,
        icon: <FaStar />,
        rarity: 'rare',
        type: 'booster'
      }
    ]
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };
  const purchaseItem = async (item) => {
    if (userScore < item.price) {
      alert('Недостаточно очков!');
      return;
    }

    if (purchasedItems.includes(item.id)) {
      alert('Предмет уже куплен!');
      return;
    }

    try {
      setUserScore(prev => prev - item.price);
      setPurchasedItems(prev => [...prev, item.id]);
      alert(`${item.name} успешно куплен!`);
    } catch (error) {
      alert('Ошибка при покупке!');
    }
  };
  return (
    <div className="flex-1 bg-base-300 p-5 flex flex-col items-center">
    {/* Header - moved inside the main content area */}
    <div className="w-full bg-gradient-to-r from-primary to-secondary p-4 text-white rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gem className="text-3xl" />
          Магазин Мафии
        </h1>
        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
          <Gem className="text-yellow-300" />
          <span className="font-bold text-lg">{userScore}</span>
          <span className="text-sm opacity-80">очков</span>
        </div>
      </div>
    </div>

    {/* Main shop content */}
    <div className="flex-1 w-full bg-base-100 rounded-xl overflow-y-auto p-4">
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Categories Sidebar */}
        <div className=" bg-base-200 p-4 rounded-lg">
         
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'hover:bg-base-300 text-base-content'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shopItems[selectedCategory]?.map(item => {
              const isPurchased = purchasedItems.includes(item.id);
              const canAfford = userScore >= item.price;
              
              return (
                <div 
                  key={item.id} 
                  className={`card bg-base-100 shadow-xl border-2 transition-all hover:shadow-2xl ${getRarityColor(item.rarity)} ${
                    isPurchased ? 'opacity-60' : ''
                  }`}
                >
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-full bg-base-200 text-2xl ${getRarityTextColor(item.rarity)}`}>
                        {item.icon}
                      </div>
                      {isPurchased && (
                        <div className="badge badge-success gap-1">
                          <Star className="w-3 h-3" />
                          Куплено
                        </div>
                      )}
                    </div>
                   
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FaGem className="text-yellow-500" />
                        <span className="font-bold text-lg">{item.price}</span>
                      </div>
                     
                    </div>
                    
                    <button 
                      className={`btn w-full ${
                        isPurchased 
                          ? 'btn-success btn-disabled' 
                          : canAfford 
                            ? 'btn-primary hover:btn-primary-focus' 
                            : 'btn-disabled'
                      }`}
                      onClick={() => purchaseItem(item)}
                      disabled={isPurchased || !canAfford}
                    >
                      {isPurchased ? 'Куплено' : canAfford ? 'Купить' : 'Не хватает очков'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Shop;
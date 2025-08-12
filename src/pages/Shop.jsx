import React, { useState, useEffect } from 'react';
import { Crown, Shield, Eye, Zap, Gem, Star, Heart } from 'lucide-react';

// Мок-хук для демонстрации (замените на ваш реальный хук)
const useCoins = () => ({
  coins: 500,
  deductCoins: async (amount) => {
    console.log(`Deducting ${amount} coins`);
    return true;
  },
  loading: false
});

// Мок-компонент для toast (замените на вашу реализацию)
const toast = {
  success: (msg) => console.log('Success:', msg),
  error: (msg) => console.log('Error:', msg),
  warning: (msg) => console.log('Warning:', msg),
  info: (msg) => console.log('Info:', msg)
};

const Shop = () => {
  const { coins, deductCoins, loading } = useCoins();
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('roles');

  // Загрузка купленных предметов
  useEffect(() => {
    // Здесь должна быть загрузка из localStorage или API
    setPurchasedItems([]); // Пример купленного товара
  }, []);

  const categories = [
    { id: 'roles', name: 'Роли', icon: <Crown className="w-5 h-5" />, color: 'text-warning' },
    { id: 'abilities', name: 'Способности', icon: <Zap className="w-5 h-5" />, color: 'text-info' },
    { id: 'cosmetics', name: 'Косметика', icon: <Gem className="w-5 h-5" />, color: 'text-secondary' },
    { id: 'boosters', name: 'Бустеры', icon: <Star className="w-5 h-5" />, color: 'text-accent' }
  ];

  const shopItems = {
    roles: [
      {
        id: 'detective',
        name: 'Детектив',
        description: 'Может проверить одного игрока за ночь',
        price: 150,
        icon: <Eye className="w-8 h-8" />,
        rarity: 'rare',
        type: 'role'
      },
      {
        id: 'doctor',
        name: 'Доктор',
        description: 'Может спасти одного игрока от убийства',
        price: 200,
        icon: <Heart className="w-8 h-8" />,
        rarity: 'epic',
        type: 'role'
      },
      {
        id: 'bodyguard',
        name: 'Телохранитель',
        description: 'Защищает выбранного игрока, умирая вместо него',
        price: 250,
        icon: <Shield className="w-8 h-8" />,
        rarity: 'epic',
        type: 'role'
      },
      {
        id: 'psychic',
        name: 'Экстрасенс',
        description: 'Видит роли убитых игроков',
        price: 300,
        icon: <Star className="w-8 h-8" />,
        rarity: 'legendary',
        type: 'role'
      },
      {
        id: 'sheriff',
        name: 'Шериф',
        description: 'Может убить подозреваемого ночью',
        price: 280,
        icon: <Shield className="w-8 h-8" />,
        rarity: 'epic',
        type: 'role'
      },
      {
        id: 'medium',
        name: 'Медиум',
        description: 'Общается с мертвыми игроками',
        price: 220,
        icon: <Eye className="w-8 h-8" />,
        rarity: 'rare',
        type: 'role'
      }
    ],
    abilities: [
      {
        id: 'extra_vote',
        name: 'Двойной голос',
        description: 'Ваш голос считается за два в течение одного дня',
        price: 100,
        icon: <Shield className="w-8 h-8" />,
        rarity: 'common',
        type: 'ability'
      },
      {
        id: 'night_vision',
        name: 'Ночное зрение',
        description: 'Видите кто кого посещает ночью',
        price: 180,
        icon: <Eye className="w-8 h-8" />,
        rarity: 'rare',
        type: 'ability'
      },
      {
        id: 'silence',
        name: 'Заткнуть рот',
        description: 'Запретить игроку говорить на один день',
        price: 120,
        icon: <Zap className="w-8 h-8" />,
        rarity: 'common',
        type: 'ability'
      },
      {
        id: 'reveal',
        name: 'Разоблачение',
        description: 'Узнать роль любого игрока (одноразово)',
        price: 350,
        icon: <Star className="w-8 h-8" />,
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
        icon: <Crown className="w-8 h-8" />,
        rarity: 'common',
        type: 'cosmetic'
      },
      {
        id: 'diamond_badge',
        name: 'Алмазный значок',
        description: 'Красивый значок рядом с именем',
        price: 150,
        icon: <Gem className="w-8 h-8" />,
        rarity: 'rare',
        type: 'cosmetic'
      },
      {
        id: 'custom_title',
        name: 'Особое звание',
        description: 'Выберите свое уникальное звание',
        price: 200,
        icon: <Star className="w-8 h-8" />,
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
        icon: <Zap className="w-8 h-8" />,
        rarity: 'common',
        type: 'booster'
      },
      {
        id: 'win_streak',
        name: 'Серия побед',
        description: 'Дополнительные очки за победные серии',
        price: 150,
        icon: <Star className="w-8 h-8" />,
        rarity: 'rare',
        type: 'booster'
      }
    ]
  };

  const getRarityStyles = (rarity) => {
    switch (rarity) {
      case 'common': return { 
        cardClass: 'border-gray-300 bg-gray-50 hover:bg-gray-100',
        badgeClass: 'badge-neutral',
        iconBg: 'bg-gray-200 text-gray-600'
      };
      case 'rare': return { 
        cardClass: 'border-blue-300 bg-blue-50 hover:bg-blue-100',
        badgeClass: 'badge-info',
        iconBg: 'bg-blue-200 text-blue-600'
      };
      case 'epic': return { 
        cardClass: 'border-purple-300 bg-purple-50 hover:bg-purple-100',
        badgeClass: 'badge-secondary',
        iconBg: 'bg-purple-200 text-purple-600'
      };
      case 'legendary': return { 
        cardClass: 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100',
        badgeClass: 'badge-warning',
        iconBg: 'bg-yellow-200 text-yellow-600'
      };
      default: return { 
        cardClass: 'border-gray-300 bg-gray-50 hover:bg-gray-100',
        badgeClass: 'badge-neutral',
        iconBg: 'bg-gray-200 text-gray-600'
      };
    }
  };

  const getRarityName = (rarity) => {
    switch (rarity) {
      case 'common': return 'Обычный';
      case 'rare': return 'Редкий';
      case 'epic': return 'Эпический';
      case 'legendary': return 'Легендарный';
      default: return 'Обычный';
    }
  };

  const purchaseItem = async (item) => {
    if (loading) {
      toast.info('Идёт обработка предыдущей операции...');
      return;
    }
  
    if (!item || typeof item.price !== 'number') {
      toast.error('Некорректные данные товара');
      return;
    }
  
    if (typeof coins !== 'number' || coins < item.price) {
      toast.error(`Недостаточно коинов! Требуется: ${item.price}, доступно: ${coins}`);
      return;
    }
  
    if (purchasedItems.includes(item.id)) {
      toast.warning(`${item.name} уже куплен!`);
      return;
    }
  
    try {
      const success = await deductCoins(item.price);
      
      if (!success) {
        throw new Error('Не удалось списать коины');
      }
  
      setPurchasedItems(prevItems => {
        const updatedItems = [...prevItems, item.id];
        return updatedItems;
      });
  
      toast.success(`Покупка успешна! ${item.name} за ${item.price} коинов`);
  
    } catch (error) {
      console.error('Ошибка покупки:', error);
      toast.error(`Ошибка: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      {/* Заголовок магазина в стиле лидерборда */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl shadow-xl mb-6">
        <div className="flex items-center justify-center gap-4 h-20 px-6">
          <div className="text-4xl animate-bounce">🛍️</div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Магазин Мафии</h1>
            <p className="text-sm opacity-90">Shop & Upgrades</p>
          </div>
        </div>
      </div>

      {/* Баланс коинов */}
      <div className="alert alert-info mb-6 shadow-lg">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Gem className="w-6 h-6 animate-pulse" />
            <div>
              <h3 className="font-bold">Ваш баланс</h3>
              <div className="text-xs opacity-75">Коинов доступно</div>
            </div>
          </div>
          <div className="text-2xl font-bold">{coins}</div>
        </div>
      </div>

      {/* Табы категорий */}
      <div className="tabs tabs-boxed mb-6 bg-base-200">
        {categories.map(category => (
          <a
            key={category.id}
            className={`tab flex items-center gap-2 ${
              selectedCategory === category.id ? 'tab-active' : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className={category.color}>{category.icon}</span>
            <span className="hidden sm:inline">{category.name}</span>
          </a>
        ))}
      </div>

      {/* Сетка товаров */}
      <div className="grid grid-cols-2 gap-4">
        {shopItems[selectedCategory]?.map(item => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = coins >= item.price;
          const styles = getRarityStyles(item.rarity);
          
          return (
            <div 
              key={item.id} 
              className={`card bg-base-100 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${styles.cardClass} ${
                isPurchased ? 'opacity-70' : ''
              }`}
            >
              <div className="card-body p-4">
                {/* Заголовок */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                    {item.icon}
                  </div>
                  {isPurchased && (
                    <div className="badge badge-success gap-1">
                      <Star className="w-3 h-3" />
                      Куплено
                    </div>
                  )}
                </div>
                
                {/* Название и описание */}
                <h2 className="card-title text-base">{item.name}</h2>
                <p className="text-xs text-base-content opacity-70 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Редкость */}
                <div className="flex justify-center mb-3">
                  <div className={`badge ${styles.badgeClass} badge-sm`}>
                    {getRarityName(item.rarity)}
                  </div>
                </div>
                
                {/* Цена */}
                <div className="flex items-center justify-center gap-2 bg-base-200 rounded-lg p-2 mb-3">
                  <Gem className="w-4 h-4 text-warning" />
                  <span className="font-bold">{item.price}</span>
                </div>
                
                {/* Кнопка покупки */}
                <div className="card-actions justify-center">
                  <button 
                    className={`btn btn-sm w-full ${
                      isPurchased 
                        ? 'btn-success btn-disabled' 
                        : canAfford 
                          ? 'btn-primary' 
                          : 'btn-disabled'
                    }`}
                    onClick={() => purchaseItem(item)}
                    disabled={isPurchased || !canAfford}
                  >
                    {isPurchased ? '✓ Куплено' : canAfford ? 'Купить' : 'Мало коинов'}
                  </button>
                </div>
                
                {/* Прогресс для редких предметов */}
                {(item.rarity === 'epic' || item.rarity === 'legendary') && (
                  <div className="mt-2">
                    <progress 
                      className={`progress w-full h-1 ${
                        item.rarity === 'legendary' ? 'progress-warning' : 'progress-secondary'
                      }`} 
                      value={isPurchased ? 100 : canAfford ? 80 : 40} 
                      max="100"
                    ></progress>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Статистика */}
      <div className="stats shadow mt-6 w-full">
        <div className="stat">
          <div className="stat-title">Товаров в категории</div>
          <div className="stat-value text-lg">{shopItems[selectedCategory]?.length || 0}</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Куплено</div>
          <div className="stat-value text-lg">{purchasedItems.length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Потрачено</div>
          <div className="stat-value text-lg">
            {purchasedItems.reduce((total, itemId) => {
              const item = Object.values(shopItems).flat().find(i => i.id === itemId);
              return total + (item?.price || 0);
            }, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
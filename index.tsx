import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// 아이템 데이터 구조를 위한 인터페이스
interface Item {
  id: number;
  name: string;
  description: string;
}

// 아이콘 SVG 컴포넌트
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const GameControllerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 8.5h.01M6.5 12.5h.01M12.5 12.5h.01M17.5 12.5h.01M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.72c0 .27.16.58.67.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z"/>
        <path d="M8 16H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2Z"/>
        <path d="M18 16h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2Z"/>
        <path d="m12 15-2-2h4l-2 2Z"/>
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

// 네비게이션 바 컴포넌트
const Navbar: React.FC<{ activeCategory: string; onSelectCategory: (category: string) => void }> = ({ activeCategory, onSelectCategory }) => {
  const categories = ['Websites', '게임', 'mbti'];
  return (
    <nav className="navbar">
      {categories.map(category => (
        <a
          key={category}
          className={`nav-item ${activeCategory === category ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory(category);
          }}
          aria-current={activeCategory === category ? 'page' : undefined}
        >
          {category}
        </a>
      ))}
    </nav>
  );
};

// 푸터 컴포넌트
const Footer: React.FC = () => (
    <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Catherine. All rights reserved.</p>
        <p>학교 주소: 경기 분당구 하오개로 351번길 4</p>
    </footer>
);


// 메인 앱 컴포넌트
const App: React.FC = () => {
  const [allData, setAllData] = useState<{ [key: string]: Item[] }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [activeCategory, setActiveCategory] = useState<string>('Websites');

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('myAppData');
      if (storedData) {
        setAllData(JSON.parse(storedData));
      } else {
        const initialData: { [key: string]: Item[] } = {
          'Websites': [
            { id: Date.now(), name: '나의 포토폴리오', description: '나의 작업물과 프로젝트를 선보이는 개인 포토폴리오입니다.' },
            { id: Date.now() + 1, name: '여행 블로그', description: '전 세계의 여행 이야기와 팁을 공유하는 블로그입니다.' },
            { id: Date.now() + 2, name: '이 코머스 스토어', description: '다양한 상품을 판매하는 온라인 스토어입니다.' },
          ],
          '게임': [
            { id: Date.now() + 3, name: '스페이스 어드벤처', description: '은하계를 탐험하는 공상 과학 게임.' },
            { id: Date.now() + 4, name: '퍼즐 퀘스트', description: '수수께끼와 퍼즐로 가득한 모험.' },
          ],
          'mbti': [
            { id: Date.now() + 5, name: 'INTJ 프로필', description: '전략적 사상가, 모든 일에 계획을 세웁니다.' },
            { id: Date.now() + 6, name: 'ENFP 강점', description: '열정적이고 창의적인 자유로운 영혼.' },
          ]
        };
        setAllData(initialData);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  // 데이터 변경 시 로컬 스토리지에 저장하기
  useEffect(() => {
    if (Object.keys(allData).length > 0) {
      try {
        localStorage.setItem('myAppData', JSON.stringify(allData));
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [allData]);
  
  // 모달 열기
  const handleOpenModal = () => setIsModalOpen(true);

  // 모달 닫기 및 입력 초기화
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewItem({ name: '', description: '' });
  };

  // 폼 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  // 아이템 추가 핸들러
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name.trim() === '') return;
    
    const item: Item = {
      id: Date.now(),
      name: newItem.name,
      description: newItem.description,
    };
    
    setAllData(prev => ({
        ...prev,
        [activeCategory]: [item, ...(prev[activeCategory] || [])]
    }));
    handleCloseModal();
  };
  
  // 아이템 삭제 핸들러
  const handleDeleteItem = useCallback((id: number) => {
    setAllData(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter(item => item.id !== id)
    }));
  }, [activeCategory]);

  const currentItems = allData[activeCategory] || [];

  return (
    <div className="main-container">
      <Navbar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      <header>
        <h1>{activeCategory === 'Websites' ? 'My Websites' : activeCategory}</h1>
        <button className="create-btn" onClick={handleOpenModal} aria-label={`Create new ${activeCategory} item`}>
            <PlusIcon />
            <span>Create New</span>
        </button>
      </header>

      <main>
        {activeCategory === '게임' && <CategoryHeader visual={<GameControllerIcon />} />}
        {activeCategory === 'mbti' && <CategoryHeader visual={<UsersIcon />} />}

        {currentItems.length > 0 ? (
            <div className="item-grid">
            {currentItems.map(item => (
                <ItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
            ))}
            </div>
        ) : (
            <EmptyState category={activeCategory} onCTAClick={handleOpenModal} />
        )}
      </main>

      {isModalOpen && (
        <CreateItemModal
          category={activeCategory}
          onClose={handleCloseModal}
          onSubmit={handleAddItem}
          formData={newItem}
          onInputChange={handleInputChange}
        />
      )}
      <Footer />
    </div>
  );
};

// 아이템 카드 컴포넌트
interface ItemCardProps {
  item: Item;
  onDelete: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => (
  <article className="item-card" aria-labelledby={`item-title-${item.id}`}>
    <div className="card-thumbnail">{item.name.charAt(0)}</div>
    <div className="card-content">
      <h3 id={`item-title-${item.id}`}>{item.name}</h3>
      <p>{item.description || 'No description provided.'}</p>
    </div>
    <button className="delete-btn" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.name}`}>
      <TrashIcon />
    </button>
  </article>
);


// 빈 상태 컴포넌트
interface EmptyStateProps {
    category: string;
    onCTAClick: () => void;
}
const EmptyState: React.FC<EmptyStateProps> = ({ category, onCTAClick }) => (
    <div className="empty-state">
        <h2>No {category} Yet</h2>
        <p>It looks like you haven't created any items for this category. Let's create the first one!</p>
        <button className="create-btn" onClick={onCTAClick}>
            <PlusIcon />
            Create Your First Item
        </button>
    </div>
);

// 카테고리 헤더 컴포넌트
const CategoryHeader: React.FC<{visual: React.ReactNode}> = ({ visual }) => (
    <div className="category-header">
      {visual}
    </div>
);


// 아이템 생성 모달 컴포넌트
interface CreateItemModalProps {
  category: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: { name: string, description: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({ category, onClose, onSubmit, formData, onInputChange }) => {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 id="modal-title">Create a New {category} Item</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              rows={3}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="modal-btn cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const root = createRoot(document.getElementById('root')!);
root.render(<App />);
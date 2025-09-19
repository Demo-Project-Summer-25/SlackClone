import React, { useState } from 'react';

interface UserSearchProps {
  onSearch?: (query: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="user-search">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default UserSearch;
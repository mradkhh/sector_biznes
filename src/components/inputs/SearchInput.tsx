import React, { useState } from "react";
import {SearchIcon} from "../../assets/icons.tsx";



const SearchComponent: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // onSearch(searchText);
  };

  return (
    <form className={"search_wrapper"} onSubmit={handleSearchSubmit}>
      <div className={"search"}  style={{ display: "flex", alignItems: "center" }}>
        <div className={"search__input_wrapper"} style={{ width: "100%" }}>
          <input
              className={"search__input"}
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Поиск"
              style={{ width: "100%" }}
          />
        </div>
        <div className={"search__icon"} style={{ marginLeft: "10px", cursor: "pointer" }}>
          <SearchIcon/>
        </div>
      </div>
    </form>
  );
};

export default SearchComponent;

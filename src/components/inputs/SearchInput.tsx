import React, {FC, useState} from "react";
import {SearchIcon} from "../../assets/icons.tsx";


interface IProps {
  onChange: any;
  value: string
}

const SearchComponent: FC<IProps> = ({ onChange, value }) => {

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchText(event.target.value);
  // };

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
              value={value}
              onChange={onChange}
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

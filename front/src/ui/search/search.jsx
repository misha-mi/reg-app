import "./search.sass";

const Search = () => {
  return (
    <div className="search">
      <label className="search__label" htmlFor="input"></label>
      <input
        id="input"
        type="text"
        className="search__input"
        placeholder="Search"
      />
    </div>
  );
};

export default Search;

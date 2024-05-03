import classes from './SearchBar.module.css'

const SearchBar = () => {
  return (
    <form className={classes.searchBar}>
      <input type="text" placeholder="Search..." />
      <button type="submit">
        search
      </button>
    </form>
  );
}

export default SearchBar
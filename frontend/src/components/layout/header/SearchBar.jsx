import classes from './SearchBar.module.css'

const SearchBar = () => {
  return (
    <form className={`${classes.searchBar} ${classes.glass}`}>
      <input className={classes.glass} type="text" placeholder="Search..." />
      <button type="submit">
        search
      </button>
    </form>
  );
}

export default SearchBar